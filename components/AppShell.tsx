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
    <div className="workspace flex h-dvh min-h-0 text-ink">
      <aside className="panel hidden w-60 shrink-0 flex-col border-r border-white/60 md:flex">
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
            className="w-full rounded-lg border border-white/80 bg-white/70 px-3 py-2 text-sm outline-none placeholder:text-muted"
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
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${active ? "bg-white font-medium text-accent shadow-sm" : "text-ink hover:bg-white/60"}`}
              >
                <Icon size={16} strokeWidth={1.75} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-white/70 px-4 py-4">
          <p className="text-sm font-medium">{viewer.name}</p>
          <p className="text-xs text-muted">Northwind · open workspace</p>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-white/50 bg-white/70 px-4 py-3 backdrop-blur md:hidden">
          <Mark />
          <span className="font-semibold">Fathom</span>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        <nav className="grid shrink-0 grid-cols-3 border-t border-white/70 bg-white/85 backdrop-blur md:hidden">
          {links.map((link) => {
            const active = link.match(path);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${active ? "font-medium text-accent" : "text-muted"}`}
              >
                <Icon size={18} strokeWidth={1.75} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
