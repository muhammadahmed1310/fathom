#!/usr/bin/env python3
"""Capture each user prompt and the final agent response into .agent-logs/.

Cursor runs this on beforeSubmitPrompt and afterAgentResponse. Thinking,
tool calls, and intermediate steps are not hooked, so they never land in
the log. A later afterAgentResponse for the same generation replaces the
response text so only the final reply is kept.
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

AUTHOR = "muhammadahmed1310"
TOOL = "cursor"
PROJECT = "fathom"


def utc_now() -> str:
    now = datetime.now(timezone.utc)
    return now.strftime("%Y-%m-%dT%H:%M:%S.") + f"{now.microsecond // 1000:03d}Z"


def repo_root(payload: dict) -> Path:
    roots = payload.get("workspace_roots") or []
    if roots:
        return Path(roots[0])
    return Path(__file__).resolve().parents[2]


def short_id(session_id: str) -> str:
    compact = session_id.replace("-", "")
    return compact[:8] if compact else "session"


def model_name(payload: dict) -> str:
    model_id = str(payload.get("model_id") or "").strip()
    model = str(payload.get("model") or "").strip()
    return model_id or model or "unknown"


def state_path(root: Path) -> Path:
    return root / ".cursor" / "agent-capture-state.json"


def load_state(root: Path) -> dict:
    path = state_path(root)
    if not path.exists():
        return {"sessions": {}}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {"sessions": {}}
    if not isinstance(data, dict) or not isinstance(data.get("sessions"), dict):
        return {"sessions": {}}
    return data


def save_state(root: Path, state: dict) -> None:
    path = state_path(root)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")
    tmp.replace(path)


def session_header(meta: dict) -> str:
    short = short_id(meta["session_id"])
    return (
        "---\n"
        f"session_id: {meta['session_id']}\n"
        f"date: {meta['date']}\n"
        f"author: {AUTHOR}\n"
        f"model: {meta['model']}\n"
        f"tool: {TOOL}\n"
        f"project: {PROJECT}\n"
        f"total_exchanges: {meta['total_exchanges']}\n"
        f"first_prompt_time: {meta['first_prompt_time']}\n"
        f"last_prompt_time: {meta['last_prompt_time']}\n"
        "---\n"
        "\n"
        f"# Session Log - {meta['date']}\n"
        "\n"
        f"Session: `{short}` | Project: `{PROJECT}` | Author: `{AUTHOR}`\n"
        "\n"
        "---\n"
        "\n"
    )


def read_body(root: Path, meta: dict) -> str:
    path = root / meta["file"]
    if not path.exists():
        return ""
    text = path.read_text(encoding="utf-8")
    marker = "\n[LOG_ENTRY "
    idx = text.find(marker)
    if idx == -1:
        return ""
    return text[idx + 1 :]


def write_session(root: Path, meta: dict, body: str) -> None:
    path = root / meta["file"]
    path.parent.mkdir(parents=True, exist_ok=True)
    content = session_header(meta)
    if body:
        content += body
        if not content.endswith("\n"):
            content += "\n"
    path.write_text(content, encoding="utf-8")


def safe_filename(session_id: str, ts: str) -> str:
    date = ts[:10]
    clock = ts[11:19].replace(":", "-")
    raw = f"{date}_{clock}_{session_id}.md"
    return "".join(ch if ch.isalnum() or ch in "-_." else "-" for ch in raw)


def ensure_session(root: Path, payload: dict, state: dict) -> dict:
    session_id = str(
        payload.get("conversation_id") or payload.get("session_id") or "unknown-session"
    )
    sessions = state.setdefault("sessions", {})
    existing = sessions.get(session_id)
    if isinstance(existing, dict):
        return existing

    ts = utc_now()
    meta = {
        "session_id": session_id,
        "date": ts[:10],
        "model": model_name(payload),
        "total_exchanges": 0,
        "first_prompt_time": "",
        "last_prompt_time": "",
        "file": f".agent-logs/{safe_filename(session_id, ts)}",
        "open_num": 0,
        "open_generation": None,
        "response_logged": False,
        "response_start": None,
    }
    sessions[session_id] = meta
    write_session(root, meta, "")
    return meta


def entry(kind: str, num: int, short: str, ts: str, model: str, text: str) -> str:
    return (
        f"[LOG_ENTRY type={kind} num={num} session={short}]\n"
        f"timestamp: {ts}\n"
        f"model: {model}\n"
        "\n"
        f"{text.rstrip()}\n"
        "\n"
    )


def on_prompt(root: Path, payload: dict, state: dict) -> None:
    meta = ensure_session(root, payload, state)
    ts = utc_now()
    model = model_name(payload)
    num = int(meta.get("total_exchanges") or 0) + 1
    meta["total_exchanges"] = num
    if not meta.get("first_prompt_time"):
        meta["first_prompt_time"] = ts
        meta["model"] = model
    meta["last_prompt_time"] = ts
    meta["open_num"] = num
    meta["open_generation"] = payload.get("generation_id")
    meta["response_logged"] = False
    meta["response_start"] = None

    body = read_body(root, meta)
    body += entry(
        "PROMPT",
        num,
        short_id(meta["session_id"]),
        ts,
        model,
        str(payload.get("prompt") or ""),
    )
    write_session(root, meta, body)


def on_response(root: Path, payload: dict, state: dict) -> None:
    meta = ensure_session(root, payload, state)
    text = str(payload.get("text") or "")
    ts = utc_now()
    model = model_name(payload)
    generation = payload.get("generation_id")
    num = int(meta.get("open_num") or 0)
    if num <= 0:
        num = int(meta.get("total_exchanges") or 0) + 1
        meta["total_exchanges"] = num
        meta["open_num"] = num

    block = entry("RESPONSE", num, short_id(meta["session_id"]), ts, model, text)
    body = read_body(root, meta)
    same_generation = bool(generation) and generation == meta.get("open_generation")
    start = meta.get("response_start")
    if meta.get("response_logged") and same_generation and isinstance(start, int):
        body = body[:start] + block
    else:
        meta["response_start"] = len(body)
        body += block
        meta["response_logged"] = True
        if generation:
            meta["open_generation"] = generation
    write_session(root, meta, body)


def emit(event: str) -> None:
    if event == "beforeSubmitPrompt":
        sys.stdout.write(json.dumps({"continue": True}))
    else:
        sys.stdout.write("{}")


def main() -> None:
    raw = sys.stdin.read()
    try:
        payload = json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        payload = {}
    if not isinstance(payload, dict):
        payload = {}

    event = str(payload.get("hook_event_name") or "")
    if not event and len(sys.argv) > 1:
        event = sys.argv[1]
        payload["hook_event_name"] = event

    try:
        root = repo_root(payload)
        state = load_state(root)
        if event == "beforeSubmitPrompt":
            on_prompt(root, payload, state)
            save_state(root, state)
        elif event == "afterAgentResponse":
            on_response(root, payload, state)
            save_state(root, state)
    except Exception as exc:  # fail open: never block a prompt because logging failed
        sys.stderr.write(f"agent-capture hook error: {exc}\n")

    emit(event)


if __name__ == "__main__":
    main()
