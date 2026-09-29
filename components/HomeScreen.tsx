"use client";

import { AvatarStack } from "@/components/Avatar";
import { formatDuration } from "@/lib/format";
import { externalMeeting, meetings, peopleById } from "@/lib/seed";
import { CALENDAR_KEY, readJson } from "@/lib/storage";
import type { Meeting } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Filter = "all" | "customers" | "internal";

function peopleFor(meeting: Meeting) {
  return meeting.attendeeIds.map((id) => peopleById[id]).filter(Boolean);
}

export function HomeScreen() {
  const router = useRouter();
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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">Meetings</h1>
          <p className="mt-1 text-sm text-muted">Northwind’s calls, with notes Fathom already wrote.</p>
        </div>
        <p className="text-sm text-muted">{recorded.length} recordings</p>
      </div>

      <section className="panel mt-6 overflow-hidden rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          {ready && calendar ? (
            <p className="text-sm">
              <span className="font-medium">{calendar === "outlook" ? "Outlook" : "Google Calendar"} connected.</span>{" "}
              <span className="text-muted">Fathom will join {upcoming.length} upcoming calls.</span>
            </p>
          ) : (
            <>
              <p className="text-sm text-muted">
                Connect a calendar so Fathom can join the {upcoming.length} calls already on it.
              </p>
              <Link href="/calendar" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white">
                Connect calendar
              </Link>
            </>
          )}
        </div>
        {ready && calendar ? (
          <div className="table-wrap border-t border-line">
            <table className="data">
              <thead>
                <tr>
                  <th className="sticky-col">Upcoming</th>
                  <th>When</th>
                  <th>Platform</th>
                  <th>Notetaker</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((meeting) => (
                  <tr
                    key={meeting.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/meetings/${meeting.id}`)}
                  >
                    <td className="sticky-col font-medium">
                      <Link href={`/meetings/${meeting.id}`}>{meeting.title}</Link>
                    </td>
                    <td className="whitespace-nowrap text-muted">{meeting.whenLabel}</td>
                    <td>{meeting.platform}</td>
                    <td className="text-accent">Will join</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
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
            className={`shrink-0 rounded-full px-3 py-1 text-sm ${filter === id ? "bg-ink text-white" : "bg-white/80 text-muted ring-1 ring-white"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="panel table-wrap mt-3 rounded-2xl">
        <table className="data">
          <thead>
            <tr>
              <th className="sticky-col">Meeting</th>
              <th>When</th>
              <th>Length</th>
              <th>Platform</th>
              <th>People</th>
              <th>Clips</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recorded.map((meeting) => {
              const attendees = peopleFor(meeting);
              return (
                <tr
                  key={meeting.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/meetings/${meeting.id}`)}
                >
                  <td className="sticky-col max-w-64">
                    <Link href={`/meetings/${meeting.id}`} className="font-medium">
                      {meeting.title}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap text-muted">{meeting.whenLabel}</td>
                  <td className="tabular-nums">{meeting.state === "ready" ? formatDuration(meeting.durationSec) : "—"}</td>
                  <td className="whitespace-nowrap">{meeting.platform}</td>
                  <td>
                    <span className="flex items-center gap-2">
                      <AvatarStack people={attendees} max={3} />
                      <span className="tabular-nums text-muted">{attendees.length}</span>
                    </span>
                  </td>
                  <td className="tabular-nums">{meeting.clips.length || "—"}</td>
                  <td>
                    {meeting.state === "processing" ? (
                      <span className="whitespace-nowrap rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                        Writing notes
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                        Ready
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted sm:hidden">Swipe the table to see every column.</p>
    </div>
  );
}
