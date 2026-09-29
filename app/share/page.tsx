import { ClipView } from "@/components/ClipView";
import { cuesInRange } from "@/lib/format";
import { getMeeting, peopleById } from "@/lib/seed";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ m?: string; start?: string; end?: string; title?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  return { title: params.title || "Shared clip" };
}

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams;
  const meeting = params.m ? getMeeting(params.m) : undefined;
  const start = Number(params.start ?? 0);
  const end = Number(params.end ?? 0);
  const title = params.title?.trim() || "Shared clip";

  if (!meeting || meeting.state !== "ready" || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6">
        <p className="text-sm text-muted">Fathom</p>
        <h1 className="mt-2 font-serif text-3xl">This clip link does not open.</h1>
        <p className="mt-2 text-sm text-muted">Ask the person who shared it for a new link.</p>
      </main>
    );
  }

  const cues = cuesInRange(meeting.cues, start, end);
  const sharedBy = peopleById[meeting.hostId]?.name ?? "Someone";

  return (
    <ClipView
      meetingTitle={meeting.title}
      title={title}
      start={start}
      end={end}
      cues={cues}
      sharedBy={sharedBy}
      platform={meeting.platform}
    />
  );
}
