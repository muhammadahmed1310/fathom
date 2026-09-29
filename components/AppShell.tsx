"use client";

import { viewer } from "@/lib/seed";
import { CalendarDays, Search, Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Mark() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white">
      <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
        <path d="M8 21V13M13 23V9M18 19V13M23 22V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

const links = [
  { href: "/", label: "Meetings", icon: Video, match: (path: string) => path === "/" || path.startsWith("/meetings") },
  { href: "/search", label: "Search", icon: Search, match: (path: string) => path.startsWith("/search") },
  { href: "/calendar", label: "Calendar", icon: CalendarDays, match: (path: string) => path.startsWith("/calendar") },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="flex h-dvh min-h-0 bg-paper text-ink">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-white md:flex">
        <Link href="/" className="flex items-center gap-2.5 px-4 py-4">
          <Mark />
          <span className="text-[15px] font-semibold tracking-tight">Fathom</span>
        </Link>
        <form action="/search" className="px-3 pb-3">
          <label className="sr-only" htmlFor="nav-search">
            Search meetings
          </label>
          <input
            id="nav-search"
            name="q"
            placeholder="Search meetings"
            className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none placeholder:text-muted"
          />
        </form>
        <nav className="flex flex-col gap-0.5 px-2">
          {links.map((link) => {
            const active = link.match(path);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${active ? "bg-accent-soft font-medium text-accent" : "text-ink hover:bg-paper"}`}
              >
                <Icon size={16} strokeWidth={1.75} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-line px-4 py-4">
          <p className="text-sm font-medium">{viewer.name}</p>
          <p className="text-xs text-muted">Northwind · open workspace</p>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 md:hidden">
          <Mark />
          <span className="font-semibold">Fathom</span>
          <nav className="ml-auto flex gap-3 text-sm">
            <Link href="/">Meetings</Link>
            <Link href="/search">Search</Link>
            <Link href="/calendar">Calendar</Link>
          </nav>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
