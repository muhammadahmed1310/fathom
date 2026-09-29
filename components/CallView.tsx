"use client";

import { Avatar, AvatarStack } from "@/components/Avatar";
import {
  activeCue,
  clipPath,
  formatClock,
  formatDuration,
  summaryMarkdown,
} from "@/lib/format";
import { peopleById, templatesFor } from "@/lib/seed";
import { CLIPS_KEY, DONE_KEY, TEMPLATE_KEY, readJson, writeJson } from "@/lib/storage";
import type { Clip, Meeting, TemplateId } from "@/lib/types";
import { templateLabel } from "@/lib/types";
import { ArrowLeft, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const speeds = [1, 1.25, 1.5, 2];

export function CallView({ meeting, initialTime }: { meeting: Meeting; initialTime: number }) {
  if (meeting.state !== "ready") return <WaitingCall meeting={meeting} />;
  return <ReadyCall meeting={meeting} initialTime={initialTime} />;
}

function WaitingCall({ meeting }: { meeting: Meeting }) {
  const attendees = meeting.attendeeIds.map((id) => peopleById[id]).filter(Boolean);
  const scheduled = meeting.state === "scheduled";
  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted">
        <ArrowLeft size={16} /> Meetings
      </Link>
      <h1 className="mt-4 font-serif text-3xl tracking-tight">{meeting.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {meeting.whenLabel} · {formatDuration(meeting.durationSec)} · {meeting.platform}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <AvatarStack people={attendees} />
        <span className="text-sm text-muted">{attendees.map((person) => person.name).join(", ")}</span>
      </div>
      <div className="mt-8 rounded-2xl border border-line bg-white px-5 py-6">
        <p className="font-medium">{scheduled ? "Fathom will join this call" : "Fathom is writing the notes"}</p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          {scheduled
            ? `When ${meeting.whenLabel} arrives, Fathom Notetaker joins the ${meeting.platform} invite, records, and leaves this page with a transcript, a summary, and action items.`
            : "The notetaker was in the room. Notes usually land a few minutes after the call ends. Camera capture is stubbed in this rebuild, so this one stays in the writing state."}
        </p>
      </div>
    </div>
  );
}

function ReadyCall({ meeting, initialTime }: { meeting: Meeting; initialTime: number }) {
  const attendees = meeting.attendeeIds.map((id) => peopleById[id]).filter(Boolean);
  const templates = templatesFor(meeting);
  const [time, setTime] = useState(() => Math.min(Math.max(0, initialTime), meeting.durationSec));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [pinned, setPinned] = useState(true);
  const [template, setTemplate] = useState<TemplateId>(meeting.defaultTemplate);
  const [writing, setWriting] = useState<TemplateId | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [extraClips, setExtraClips] = useState<Clip[]>([]);
  const [draft, setDraft] = useState<{ start: number; end: number; title: string } | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [followOpen, setFollowOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);

  useEffect(() => {
    const savedTemplate = readJson<Record<string, TemplateId>>(TEMPLATE_KEY, {})[meeting.id];
    if (savedTemplate && meeting.summaries[savedTemplate]) setTemplate(savedTemplate);
    setDone(readJson<string[]>(DONE_KEY, []));
    const extras = readJson<Record<string, Clip[]>>(CLIPS_KEY, {})[meeting.id] ?? [];
    setExtraClips(extras);
  }, [meeting.id, meeting.summaries]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setTime((current) => {
        const next = current + 0.1 * speed;
        if (next >= meeting.durationSec) {
          setPlaying(false);
          return meeting.durationSec;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [playing, speed, meeting.durationSec]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;
      if (event.code === "Space") {
        event.preventDefault();
        setPlaying((value) => !value);
      }
      if (event.key === "ArrowRight") setTime((value) => Math.min(meeting.durationSec, value + 5));
      if (event.key === "ArrowLeft") setTime((value) => Math.max(0, value - 5));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [meeting.durationSec]);

  const current = activeCue(meeting.cues, time);
  const speaker = current ? peopleById[current.speakerId] : undefined;
  const sections = meeting.summaries[template] ?? [];
  const clips = [...meeting.clips, ...extraClips];
  const questions = useMemo(
    () => meeting.cues.filter((cue) => cue.text.includes("?")),
    [meeting.cues],
  );

  useEffect(() => {
    if (!pinned || !current || !scrollRef.current) return;
    const row = document.getElementById(`cue-${current.id}`);
    const parent = scrollRef.current;
    if (!row) return;
    const rowRect = row.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    if (rowRect.top < parentRect.top + 8 || rowRect.bottom > parentRect.bottom - 8) {
      programmatic.current = true;
      parent.scrollTop += rowRect.top - parentRect.top - parentRect.height * 0.35;
      window.requestAnimationFrame(() => {
        programmatic.current = false;
      });
    }
  }, [current, pinned]);

  function seek(next: number) {
    setTime(Math.min(meeting.durationSec, Math.max(0, next)));
    setPinned(true);
  }

  function copy(text: string, label: string) {
    void navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  }

  function chooseTemplate(next: TemplateId) {
    if (next === template) return;
    setWriting(next);
    window.setTimeout(() => {
      setTemplate(next);
      setWriting(null);
      const saved = readJson<Record<string, TemplateId>>(TEMPLATE_KEY, {});
      saved[meeting.id] = next;
      writeJson(TEMPLATE_KEY, saved);
    }, 380);
  }

  function toggleAction(id: string) {
    setDone((currentDone) => {
      const next = currentDone.includes(id) ? currentDone.filter((item) => item !== id) : [...currentDone, id];
      writeJson(DONE_KEY, next);
      return next;
    });
  }

  function saveDraft() {
    if (!draft || !draft.title.trim()) return;
    const clip: Clip = {
      id: `local-${Date.now()}`,
      title: draft.title.trim(),
      start: draft.start,
      end: draft.end,
    };
    const all = readJson<Record<string, Clip[]>>(CLIPS_KEY, {});
    const next = [...(all[meeting.id] ?? []), clip];
    all[meeting.id] = next;
    writeJson(CLIPS_KEY, all);
    setExtraClips(next);
    setDraft(null);
    const path = clipPath(meeting.id, clip.start, clip.end, clip.title);
    copy(`${window.location.origin}${path}`, "Clip link copied");
    setShareOpen(true);
  }

  const openActions = meeting.actions.filter((action) => !done.includes(action.id)).length;

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="border-b border-line bg-white px-4 py-3 lg:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted">
                <ArrowLeft size={15} /> Meetings
              </Link>
              <h1 className="mt-1 truncate font-serif text-2xl tracking-tight">{meeting.title}</h1>
              <p className="mt-1 text-sm text-muted">
                {meeting.whenLabel} · {formatDuration(meeting.durationSec)} · {meeting.platform}
              </p>
            </div>
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShareOpen((open) => !open)}
                className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white"
              >
                Share
              </button>
              {shareOpen ? (
                <>
                  <button type="button" aria-label="Close share menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setShareOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-line bg-white p-3 shadow-lg">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">Clips</p>
                    <ul className="mt-2 space-y-2">
                      {clips.map((clip) => (
                        <li key={clip.id} className="flex items-start justify-between gap-2 text-sm">
                          <span>
                            <span className="block font-medium">{clip.title}</span>
                            <span className="text-xs text-muted tabular-nums">
                              {formatClock(clip.start)}–{formatClock(clip.end)}
                            </span>
                          </span>
                          <button
                            type="button"
                            className="shrink-0 text-accent"
                            onClick={() =>
                              copy(
                                `${window.location.origin}${clipPath(meeting.id, clip.start, clip.end, clip.title)}`,
                                "Clip link copied",
                              )
                            }
                          >
                            Copy link
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="mt-3 text-sm text-accent"
                      onClick={() =>
                        copy(summaryMarkdown(meeting.title, sections), "Summary copied")
                      }
                    >
                      Copy summary
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <AvatarStack people={attendees} max={5} />
            <span className="text-xs text-muted">
              {attendees.length <= 2
                ? attendees.map((person) => person.name).join(" and ")
                : `${attendees[0]?.name} and ${attendees.length - 1} others`}
            </span>
          </div>
        </div>

        <div className="px-4 py-4 lg:px-6">
          <div className="rounded-2xl bg-stage p-3 text-white sm:p-4">
            <div className={`grid gap-2 ${attendees.length > 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
              {attendees.map((person) => {
                const speaking = speaker?.id === person.id && playing;
                return (
                  <div
                    key={person.id}
                    className="flex min-h-20 flex-col justify-between rounded-xl px-3 py-2"
                    style={{
                      background: speaking ? "#232838" : "#1b1e28",
                      boxShadow: speaking ? `inset 0 0 0 2px ${person.hue}` : undefined,
                    }}
                  >
                    <span className="text-[11px] text-white/50">{person.title}</span>
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{person.name.split(" ")[0]}</span>
                      {speaking ? <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: person.hue }} /> : null}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3">
              <Scrubber
                time={time}
                duration={meeting.durationSec}
                clips={clips}
                onSeek={seek}
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPlaying((value) => !value)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-ink"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause size={14} /> : <Play size={14} />}
                  {playing ? "Pause" : "Play"}
                </button>
                <span className="tabular-nums text-xs text-white/70">
                  {formatClock(time)} / {formatClock(meeting.durationSec)}
                </span>
                <span className="text-xs text-white/70">{speaker ? speaker.name : "Waiting"}</span>
                <button
                  type="button"
                  onClick={() => setSpeed((value) => speeds[(speeds.indexOf(value) + 1) % speeds.length])}
                  className="rounded-md px-2 py-1 text-xs text-white/80 ring-1 ring-white/20"
                >
                  {speed}×
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    const start = Math.max(0, time - 20);
                    const end = Math.min(meeting.durationSec, time + 25);
                    const words = current?.text.split(" ").slice(0, 6).join(" ") ?? "Highlight";
                    setDraft({ start, end, title: words });
                  }}
                  className="ml-auto rounded-lg bg-amber-300 px-3 py-1.5 text-sm font-medium text-ink"
                >
                  Highlight
                </button>
              </div>
              <p className="mt-2 text-[11px] text-white/45">
                Playback follows the transcript. Camera capture is stubbed. Space plays, arrows skip 5 seconds.
              </p>
            </div>
          </div>

          {draft ? (
            <form
              className="mt-3 flex flex-wrap items-end gap-2 rounded-xl border border-line bg-white p-3"
              onSubmit={(event) => {
                event.preventDefault();
                saveDraft();
              }}
            >
              <label className="min-w-48 flex-1 text-sm">
                <span className="text-xs text-muted">
                  Highlight {formatClock(draft.start)}–{formatClock(draft.end)}
                </span>
                <input
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-line px-2 py-1.5"
                  autoFocus
                />
              </label>
              <button type="submit" className="rounded-lg bg-ink px-3 py-1.5 text-sm text-white">
                Save and copy link
              </button>
              <button type="button" onClick={() => setDraft(null)} className="rounded-lg px-3 py-1.5 text-sm text-muted">
                Cancel
              </button>
            </form>
          ) : null}
          <p role="status" className="mt-2 h-4 text-xs text-accent">
            {copied}
          </p>
        </div>

        <div className="relative min-h-0 flex-1 px-4 pb-6 lg:px-6">
          {!pinned ? (
            <button
              type="button"
              onClick={() => setPinned(true)}
              className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-xs text-white"
            >
              Jump to current line
            </button>
          ) : null}
          <div
            id="transcript-scroll"
            ref={scrollRef}
            onScroll={() => {
              if (!programmatic.current) setPinned(false);
            }}
            className="h-full max-h-[50vh] space-y-1 overflow-y-auto rounded-xl border border-line bg-white p-2 lg:max-h-none"
          >
            {meeting.cues.map((cue) => {
              const person = peopleById[cue.speakerId];
              const on = current?.id === cue.id;
              return (
                <button
                  key={cue.id}
                  id={`cue-${cue.id}`}
                  type="button"
                  onClick={() => seek(cue.start)}
                  className={`flex w-full gap-3 rounded-lg px-2 py-2 text-left ${on ? "bg-accent-soft" : "hover:bg-paper"}`}
                >
                  <span className="w-12 shrink-0 pt-0.5 text-xs tabular-nums text-accent">{formatClock(cue.start)}</span>
                  {person ? <Avatar person={person} size={26} /> : null}
                  <span>
                    <span className="block text-xs text-muted">{person?.name}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed">{cue.text}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="min-h-0 w-full overflow-y-auto border-t border-line bg-white lg:w-[400px] lg:border-l lg:border-t-0">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium">Summary</h2>
            <label className="sr-only" htmlFor="template">
              Summary template
            </label>
            <select
              id="template"
              value={writing ?? template}
              onChange={(event) => chooseTemplate(event.target.value as TemplateId)}
              className="max-w-[220px] rounded-lg border border-line bg-white px-2 py-1 text-sm"
            >
              {templates.map((item) => (
                <option key={item} value={item}>
                  {templateLabel[item]}
                </option>
              ))}
            </select>
          </div>
          {writing ? (
            <p className="mt-6 text-sm text-muted">Writing the {templateLabel[writing]} summary…</p>
          ) : (
            <div className="mt-4 space-y-5">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted">{section.heading}</h3>
                  <ul className="mt-2 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet.text}>
                        <button type="button" onClick={() => seek(bullet.at)} className="text-left text-sm leading-relaxed hover:text-accent">
                          {bullet.text}
                          <span className="ml-2 tabular-nums text-xs text-muted">{formatClock(bullet.at)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}

          <h2 className="mt-8 text-sm font-medium">Action items</h2>
          <p className="mt-1 text-xs text-muted">{openActions} open</p>
          <ul className="mt-3 space-y-3">
            {meeting.actions.map((action) => {
              const owner = peopleById[action.ownerId];
              const checked = done.includes(action.id);
              return (
                <li key={action.id} className="flex gap-2">
                  <button
                    type="button"
                    aria-pressed={checked}
                    onClick={() => toggleAction(action.id)}
                    className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${checked ? "border-accent bg-accent text-white" : "border-line"}`}
                    aria-label={checked ? "Mark action open" : "Mark action done"}
                  >
                    {checked ? "✓" : ""}
                  </button>
                  <div>
                    <p className={`text-sm leading-relaxed ${checked ? "text-muted line-through" : ""}`}>{action.text}</p>
                    <button type="button" onClick={() => seek(action.at)} className="mt-0.5 text-xs text-muted">
                      {owner?.name} · {action.due} · {formatClock(action.at)}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {meeting.followUp ? (
            <div className="mt-8">
              <button type="button" onClick={() => setFollowOpen((open) => !open)} className="text-sm font-medium">
                Follow-up email {followOpen ? "▾" : "▸"}
              </button>
              {followOpen ? (
                <div className="mt-2">
                  <pre className="whitespace-pre-wrap rounded-xl bg-paper p-3 font-sans text-sm leading-relaxed">{meeting.followUp}</pre>
                  <button
                    type="button"
                    className="mt-2 text-sm text-accent"
                    onClick={() => copy(meeting.followUp ?? "", "Email copied")}
                  >
                    Copy email
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8">
            <h2 className="text-sm font-medium">Questions asked</h2>
            <ul className="mt-2 space-y-2">
              {questions.map((cue) => (
                <li key={cue.id}>
                  <button type="button" onClick={() => seek(cue.start)} className="text-left text-sm leading-relaxed hover:text-accent">
                    <span className="text-xs text-muted">{peopleById[cue.speakerId]?.name} · {formatClock(cue.start)}</span>
                    <span className="mt-0.5 block">{cue.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Scrubber({
  time,
  duration,
  clips,
  onSeek,
}: {
  time: number;
  duration: number;
  clips: Clip[];
  onSeek: (time: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function seekFrom(clientX: number) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  }

  return (
    <div
      ref={ref}
      className="relative h-8 cursor-pointer"
      onPointerDown={(event) => {
        (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
        seekFrom(event.clientX);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) seekFrom(event.clientX);
      }}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={Math.floor(duration)}
      aria-valuenow={Math.floor(time)}
      aria-label="Meeting position"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") onSeek(Math.min(duration, time + 5));
        if (event.key === "ArrowLeft") onSeek(Math.max(0, time - 5));
      }}
    >
      <div className="absolute left-0 right-0 top-3 h-1.5 rounded-full bg-white/15">
        <div className="h-full rounded-full bg-white" style={{ width: `${(time / duration) * 100}%` }} />
      </div>
      {clips.map((clip) => (
        <span
          key={clip.id}
          title={clip.title}
          className="absolute top-2.5 h-2.5 w-1 rounded-sm bg-amber-300"
          style={{ left: `${(clip.start / duration) * 100}%` }}
        />
      ))}
    </div>
  );
}
