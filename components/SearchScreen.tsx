"use client";

import { formatClock } from "@/lib/format";
import { searchMoments } from "@/lib/search";
import { meetings } from "@/lib/seed";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export function SearchScreen() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const hits = useMemo(() => searchMoments(meetings, query), [query]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="font-serif text-3xl tracking-tight">Search</h1>
      <p className="mt-1 text-sm text-muted">Every hit is a moment in a transcript, summary, or action item.</p>
      <form
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          const next = new URLSearchParams(query ? { q: query } : {});
          window.history.replaceState(null, "", `/search${next.size ? `?${next}` : ""}`);
        }}
      >
        <label className="sr-only" htmlFor="search-q">
          Search across meetings
        </label>
        <input
          id="search-q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try liability cap, 14 days, take-home"
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base outline-none"
        />
      </form>

      {query.trim().length > 1 && hits.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No moments match that.</p>
      ) : null}

      <ul className="mt-6 space-y-2">
        {hits.map((hit) => (
          <li key={`${hit.meetingId}-${hit.kind}-${hit.at}-${hit.text}`}>
            <Link
              href={`/meetings/${hit.meetingId}?t=${Math.floor(hit.at)}`}
              className="block rounded-xl border border-line bg-white px-4 py-3 hover:border-accent"
            >
              <span className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted">
                <span className="font-medium text-ink">{hit.meetingTitle}</span>
                <span>{hit.kind}</span>
                <span className="tabular-nums">{formatClock(hit.at)}</span>
                <span>{hit.speaker}</span>
              </span>
              <span className="mt-1 block text-sm leading-relaxed">{hit.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
