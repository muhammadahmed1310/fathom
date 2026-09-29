# Capture test

Capture is working. Two separate Cursor agent sessions each recorded the canary prompt and the final response on their own.

## Tool and model

- Tool: Cursor
- Model: Grok 4.7
- This agent both plans and executes. There is no separate planner model. Each log entry stores the model Cursor sends on that hook, so a later switch stays visible.

Cursor has project hooks that run a command automatically. Confirmed from the Cursor hooks documentation before installing anything: https://cursor.com/docs/hooks

## Mechanism

Project hooks in `.cursor/hooks.json`.

| Event | What it captures |
| --- | --- |
| `beforeSubmitPrompt` | The user prompt, verbatim |
| `afterAgentResponse` | The final assistant text for that turn |

The script is `.cursor/hooks/capture-agent-log.py`. It appends to `.agent-logs/YYYY-MM-DD_HH-MM-SS_<session-id>.md`. `afterAgentThought` is not hooked, so thinking stays out. A second `afterAgentResponse` for the same generation replaces the response text, so the log keeps the final reply.

`.agent-logs/` is not in `.gitignore`.

## Log files

- This session: `.agent-logs/2026-09-29_09-38-47_950783f5-6bda-402d-8541-34b2a96bad28.md`
- Second session: `.agent-logs/2026-09-29_09-40-58_16e4f9b1-5b3a-4b9d-98b3-02c16eaca1b9.md`

## Canary, this session

```
[LOG_ENTRY type=PROMPT num=2 session=950783f5]
timestamp: 2026-09-29T09:39:55.271Z
model: grok-4.7

CAPTURE TEST — 8x assignment, Muhammad Ahmed

[LOG_ENTRY type=RESPONSE num=2 session=950783f5]
timestamp: 2026-09-29T09:40:32.862Z
model: grok-4.7

The canary prompt is in the log, verbatim.

It landed in `.agent-logs/2026-09-29_09-38-47_950783f5-6bda-402d-8541-34b2a96bad28.md` as prompt 2, at `2026-09-29T09:39:55.271Z`, model `grok-4.7`, author `muhammadahmed1310`:

`CAPTURE TEST — 8x assignment, Muhammad Ahmed`

This reply is the matching response. The hook writes it when the turn ends, so it will show up as response 2 in that same file. The earlier setup reply is already in the file as response 1. That one has no prompt above it, because the hook was installed at the end of that turn, after the prompt had already been sent.

Two things are still open before any product work:

1. After this message finishes, check that response 2 is in that file.
2. Open a second new agent chat in this project and send `CAPTURE TEST — 8x assignment, Muhammad Ahmed` once.

When that second session’s prompt and response are both in `.agent-logs/`, I will write `CAPTURE-TEST.md`.
```

## Canary, second session

```
[LOG_ENTRY type=PROMPT num=1 session=16e4f9b1]
timestamp: 2026-09-29T09:40:58.637Z
model: grok-4.7

CAPTURE TEST — 8x assignment, Muhammad Ahmed

[LOG_ENTRY type=RESPONSE num=1 session=16e4f9b1]
timestamp: 2026-09-29T09:41:25.761Z
model: grok-4.7

The second canary is in the log, verbatim.

It landed in `.agent-logs/2026-09-29_09-40-58_16e4f9b1-5b3a-4b9d-98b3-02c16eaca1b9.md` as prompt 1, at `2026-09-29T09:40:58.637Z`, model `grok-4.7`, author `muhammadahmed1310`:

`CAPTURE TEST — 8x assignment, Muhammad Ahmed`

This reply is the matching response for that session. The hook writes it when the turn ends, so it will show up as response 1 in that same file. The other session, `950783f5`, already has the same line as prompt 2 with its own response.
```

## What did not work at first

The hook was installed during the first session, after the opening prompts had already been sent. `beforeSubmitPrompt` cannot see a prompt that was submitted before the hook existed. `afterAgentResponse` did fire at the end of the setup turn, so that reply is in the first log as response 1 with no prompt above it. The canary itself is prompt 2 and response 2 in that file. The second session was started after the hook was in place, and its canary is prompt 1 and response 1.

A local dry-run of the script wrote the same format into a temporary directory, then that directory was deleted. It was not a canary and it is not in `.agent-logs/`.
