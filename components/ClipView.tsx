"use client";

import { Avatar } from "@/components/Avatar";
import { formatClock } from "@/lib/format";
import { peopleById } from "@/lib/seed";
import type { Cue } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ClipView({
  meetingTitle,
  title,
  start,
  end,
  cues,
  sharedBy,
  platform,
}: {
  meetingTitle: string;
  title: string;
  start: number;
  end: number;
  cues: Cue[];
  sharedBy: string;
  platform: string;
}) {
  const [time, setTime] = useState(start);
  const [playing, setPlaying] = useState(false);
  const span = Math.max(1, end - start);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setTime((current) => {
        const next = current + 0.1;
        if (next >= end) {
          setPlaying(false);
          return end;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [playing, end]);

  const spoken = cues.find((cue) => cue.start <= time && cue.end >= time) ?? cues[0];
  const speaker = spoken ? peopleById[spoken.speakerId] : undefined;

  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-sm font-semibold">
            Fathom
          </Link>
          <p className="text-xs text-muted">Shared clip · you were not on this call</p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-8">
        <p className="text-sm text-muted">{sharedBy} shared a clip from {meetingTitle}</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted">
          {formatClock(start)}–{formatClock(end)} · {platform}
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl bg-stage p-4 text-white">
          <div className="flex min-h-36 items-end justify-between gap-4">
            <div>
              <p className="text-xs text-white/60">Speaking</p>
              <p className="mt-1 text-lg font-medium">{speaker?.name ?? "The room"}</p>
            </div>
            <p className="tabular-nums text-sm text-white/70">
              {formatClock(time)} / {formatClock(end)}
            </p>
          </div>
          <div className="mt-4">
            <input
              aria-label="Clip position"
              type="range"
              min={start}
              max={end}
              step={1}
              value={time}
              onChange={(event) => setTime(Number(event.target.value))}
              className="w-full accent-white"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (time >= end) setTime(start);
              setPlaying((value) => !value);
            }}
            className="mt-3 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-ink"
          >
            {playing ? "Pause" : "Play clip"}
          </button>
          <p className="mt-3 text-xs text-white/50">Playback follows the transcript. Camera capture is stubbed.</p>
        </div>

        <h2 className="mt-8 text-sm font-medium">What was said</h2>
        <ol className="mt-3 space-y-3">
          {cues.map((cue) => {
            const person = peopleById[cue.speakerId];
            const on = spoken?.id === cue.id;
            return (
              <li key={cue.id} className={`flex gap-3 rounded-xl border px-3 py-3 ${on ? "border-accent bg-white" : "border-line bg-white/60"}`}>
                {person ? <Avatar person={person} /> : null}
                <div>
                  <p className="text-xs text-muted">
                    {person?.name} · <span className="tabular-nums">{formatClock(cue.start)}</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{cue.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 text-xs text-muted">This page is only the shared range, {Math.round(span / 60)} min of the call.</p>
      </main>
    </div>
  );
}
