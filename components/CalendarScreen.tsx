"use client";

import { meetings } from "@/lib/seed";
import { CALENDAR_KEY, readJson, writeJson } from "@/lib/storage";
import Link from "next/link";
import { useEffect, useState } from "react";

type Provider = "google" | "outlook";

export function CalendarScreen() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [pending, setPending] = useState<Provider | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readJson<Provider | null>(CALENDAR_KEY, null);
    setProvider(saved);
    setReady(true);
  }, []);

  const upcoming = meetings
    .filter((meeting) => meeting.state === "scheduled")
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));

  function allow() {
    if (!pending) return;
    writeJson(CALENDAR_KEY, pending);
    setProvider(pending);
    setPending(null);
  }

  function disconnect() {
    writeJson(CALENDAR_KEY, null);
    setProvider(null);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="font-serif text-3xl tracking-tight">Calendar</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Fathom joins a call when the invite has a Zoom, Meet, or Teams link. Connecting is simulated in this
        rebuild: nothing is sent to Google or Microsoft. Allowing access only marks the calendar as linked in
        this browser.
      </p>

      {!ready ? <p className="mt-8 text-sm text-muted">Checking calendar…</p> : null}

      {ready && !provider ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setPending("google")}
            className="rounded-xl border border-line bg-white px-4 py-4 text-left hover:border-accent"
          >
            <span className="block font-medium">Google Calendar</span>
            <span className="mt-1 block text-sm text-muted">maya@northwind.io</span>
          </button>
          <button
            type="button"
            onClick={() => setPending("outlook")}
            className="rounded-xl border border-line bg-white px-4 py-4 text-left hover:border-accent"
          >
            <span className="block font-medium">Outlook</span>
            <span className="mt-1 block text-sm text-muted">maya@northwind.io</span>
          </button>
        </div>
      ) : null}

      {ready && provider ? (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm">
              <span className="font-medium">{provider === "outlook" ? "Outlook" : "Google Calendar"} connected</span>
              <span className="text-muted"> as maya@northwind.io</span>
            </p>
            <button type="button" onClick={disconnect} className="text-sm text-muted underline">
              Disconnect
            </button>
          </div>
          <ul className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
            {upcoming.map((meeting) => (
              <li key={meeting.id} className="border-b border-line last:border-b-0">
                <Link href={`/meetings/${meeting.id}`} className="block px-4 py-3 hover:bg-paper">
                  <span className="font-medium">{meeting.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {meeting.whenLabel} · {meeting.platform} · Fathom Notetaker will be added as a guest
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {pending ? (
        <div className="fixed inset-0 z-30 grid place-items-center bg-ink/30 px-4">
          <div role="dialog" aria-modal="true" aria-labelledby="cal-title" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {pending === "outlook" ? "Microsoft" : "Google"}
            </p>
            <h2 id="cal-title" className="mt-1 font-serif text-2xl">
              Fathom wants calendar access
            </h2>
            <p className="mt-2 text-sm text-muted">Signed in as maya@northwind.io</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>See events on this calendar</li>
              <li>Add Fathom Notetaker as a guest when a video link is present</li>
            </ul>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setPending(null)} className="rounded-lg px-3 py-1.5 text-sm">
                Cancel
              </button>
              <button type="button" onClick={allow} className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white">
                Allow
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
