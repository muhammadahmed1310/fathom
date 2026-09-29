"use client";

import { formatClock } from "@/lib/format";
import { searchMoments } from "@/lib/search";
import { meetings } from "@/lib/seed";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export function SearchScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const hits = useMemo(() => searchMoments(meetings, query), [query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">Search</h1>
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
          className="panel w-full rounded-2xl px-4 py-3 text-base outline-none"
        />
      </form>

      {query.trim().length > 1 && hits.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No moments match that.</p>
      ) : null}

      {hits.length > 0 ? (
        <div className="panel table-wrap mt-6 rounded-2xl">
          <table className="data">
            <thead>
              <tr>
                <th className="sticky-col">Meeting</th>
                <th>Kind</th>
                <th>Time</th>
                <th>Who</th>
                <th>Moment</th>
              </tr>
            </thead>
            <tbody>
              {hits.map((hit) => {
                const href = `/meetings/${hit.meetingId}?t=${Math.floor(hit.at)}`;
                return (
                  <tr key={`${hit.meetingId}-${hit.kind}-${hit.at}-${hit.text}`} className="cursor-pointer" onClick={() => router.push(href)}>
                    <td className="sticky-col whitespace-nowrap font-medium">
                      <Link href={href}>{hit.meetingTitle}</Link>
                    </td>
                    <td className="whitespace-nowrap text-muted">{hit.kind}</td>
                    <td className="tabular-nums whitespace-nowrap">{formatClock(hit.at)}</td>
                    <td className="whitespace-nowrap">{hit.speaker}</td>
                    <td className="max-w-xl">
                      <span className="line-clamp-2 leading-relaxed">{hit.text}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
      {hits.length > 0 ? <p className="mt-2 text-xs text-muted sm:hidden">Swipe the table to read the moment.</p> : null}
    </div>
  );
}
