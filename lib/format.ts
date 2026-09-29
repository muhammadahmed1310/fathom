import type { Cue } from "@/lib/types";

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const rs = String(r).padStart(2, "0");
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${rs}`;
  return `${m}:${rs}`;
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.max(1, Math.round(totalSeconds / 60));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

export function clipPath(
  meetingId: string,
  start: number,
  end: number,
  title: string,
): string {
  const params = new URLSearchParams({
    m: meetingId,
    start: String(Math.max(0, Math.floor(start))),
    end: String(Math.max(0, Math.floor(end))),
    title,
  });
  return `/share?${params.toString()}`;
}

export function cuesInRange(cues: Cue[], start: number, end: number): Cue[] {
  return cues.filter((cue) => cue.end > start && cue.start < end);
}

export function activeCue(cues: Cue[], time: number): Cue | null {
  if (cues.length === 0 || time < cues[0].start) return cues[0] ?? null;
  let current = cues[0];
  for (const cue of cues) {
    if (cue.start <= time) current = cue;
    else break;
  }
  return current;
}

export function summaryMarkdown(
  title: string,
  sections: { heading: string; bullets: { text: string }[] }[],
): string {
  const lines = [`# ${title}`, ""];
  for (const section of sections) {
    lines.push(`## ${section.heading}`);
    for (const bullet of section.bullets) lines.push(`- ${bullet.text}`);
    lines.push("");
  }
  return lines.join("\n").trim();
}
