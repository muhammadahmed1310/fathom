"use client";

import { AvatarStack } from "@/components/Avatar";
import { formatDuration } from "@/lib/format";
import { externalMeeting, meetings, peopleById } from "@/lib/seed";
import { CALENDAR_KEY, readJson } from "@/lib/storage";
import type { Meeting } from "@/lib/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Filter = "all" | "customers" | "internal";

function peopleFor(meeting: Meeting) {
  return meeting.attendeeIds.map((id) => peopleById[id]).filter(Boolean);
}

export function HomeScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [calendar, setCalendar] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCalendar(readJson<string | null>(CALENDAR_KEY, null));
    setReady(true);
  }, []);

  const recorded = useMemo(() => {
    return meetings
      .filter((meeting) => meeting.state !== "scheduled")
      .filter((meeting) => {
        if (filter === "customers") return externalMeeting(meeting);
        if (filter === "internal") return !externalMeeting(meeting);
        return true;
      })
      .sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt));
  }, [filter]);

  const upcoming = meetings
    .filter((meeting) => meeting.state === "scheduled")
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Meetings</h1>
          <p className="mt-1 text-sm text-muted">Northwind’s calls, with notes Fathom already wrote.</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-white px-4 py-3">
        {ready && calendar ? (
          <p className="text-sm">
            <span className="font-medium">{calendar === "outlook" ? "Outlook" : "Google Calendar"} connected.</span>{" "}
            <span className="text-muted">Fathom will join {upcoming.length} upcoming calls.</span>
          </p>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Connect a calendar so Fathom can join the {upcoming.length} calls already on it.
            </p>
            <Link href="/calendar" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white">
              Connect calendar
            </Link>
          </div>
        )}
        {ready && calendar ? (
          <ul className="mt-3 divide-y divide-line border-t border-line">
            {upcoming.map((meeting) => (
              <li key={meeting.id}>
                <Link href={`/meetings/${meeting.id}`} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span>
                    <span className="font-medium">{meeting.title}</span>
                    <span className="mt-0.5 block text-muted">{meeting.whenLabel} · {meeting.platform}</span>
                  </span>
                  <span className="shrink-0 text-xs text-accent">Fathom will join</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-6 flex gap-2">
        {(
          [
            ["all", "All"],
            ["customers", "With customers"],
            ["internal", "Internal"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`rounded-full px-3 py-1 text-sm ${filter === id ? "bg-ink text-white" : "bg-white text-muted ring-1 ring-line"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        {recorded.map((meeting) => {
          const attendees = peopleFor(meeting);
          return (
            <li key={meeting.id} className="border-b border-line last:border-b-0">
              <Link href={`/meetings/${meeting.id}`} className="flex items-center gap-4 px-4 py-3.5 hover:bg-paper">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{meeting.title}</p>
                    {meeting.state === "processing" ? (
                      <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                        Writing notes
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    {meeting.whenLabel}
                    {meeting.state === "ready" ? ` · ${formatDuration(meeting.durationSec)}` : ""} · {meeting.platform}
                    {meeting.clips.length > 0
                      ? ` · ${meeting.clips.length} ${meeting.clips.length === 1 ? "clip" : "clips"}`
                      : ""}
                  </p>
                </div>
                <span className="hidden items-center gap-2 sm:flex">
                  <AvatarStack people={attendees} />
                  <span className="w-16 text-right text-xs text-muted">{attendees.length} people</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
