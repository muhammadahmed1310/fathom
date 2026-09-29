import { peopleById } from "@/lib/seed";
import type { Meeting } from "@/lib/types";

export type MomentHit = {
  meetingId: string;
  meetingTitle: string;
  at: number;
  speaker: string;
  text: string;
  kind: "Transcript" | "Summary" | "Action";
};

function termsOf(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 1);
}

function score(haystack: string, terms: string[]): number {
  const text = haystack.toLowerCase();
  return terms.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0);
}

export function searchMoments(meetings: Meeting[], query: string): MomentHit[] {
  const terms = termsOf(query);
  if (terms.length === 0) return [];

  const hits: (MomentHit & { score: number })[] = [];

  for (const meeting of meetings) {
    if (meeting.state !== "ready") continue;

    for (const cue of meeting.cues) {
      const cueScore = score(cue.text, terms);
      if (cueScore === 0) continue;
      hits.push({
        meetingId: meeting.id,
        meetingTitle: meeting.title,
        at: cue.start,
        speaker: peopleById[cue.speakerId]?.name ?? "Speaker",
        text: cue.text,
        kind: "Transcript",
        score: cueScore,
      });
    }

    for (const section of meeting.summaries[meeting.defaultTemplate] ?? []) {
      for (const bullet of section.bullets) {
        const bulletScore = score(`${section.heading} ${bullet.text}`, terms);
        if (bulletScore === 0) continue;
        hits.push({
          meetingId: meeting.id,
          meetingTitle: meeting.title,
          at: bullet.at,
          speaker: section.heading,
          text: bullet.text,
          kind: "Summary",
          score: bulletScore,
        });
      }
    }

    for (const action of meeting.actions) {
      const actionScore = score(action.text, terms);
      if (actionScore === 0) continue;
      hits.push({
        meetingId: meeting.id,
        meetingTitle: meeting.title,
        at: action.at,
        speaker: peopleById[action.ownerId]?.name ?? "Owner",
        text: action.text,
        kind: "Action",
        score: actionScore,
      });
    }
  }

  const best = new Map<string, MomentHit & { score: number }>();
  for (const hit of hits) {
    const key = `${hit.meetingId}:${hit.kind}:${hit.at}:${hit.text}`;
    const existing = best.get(key);
    if (!existing || existing.score < hit.score) best.set(key, hit);
  }

  return [...best.values()]
    .sort((a, b) => b.score - a.score || a.at - b.at)
    .slice(0, 30)
    .map(({ score: _score, ...hit }) => hit);
}
