import { CallView } from "@/components/CallView";
import { getMeeting } from "@/lib/seed";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
};

export function generateStaticParams() {
  return [{ id: "q4-forecast" }, { id: "harbor-roadmap" }, { id: "share-design" }, { id: "maya-jonah" }, { id: "hiring-sam" }, { id: "brightline-kickoff" }, { id: "monday-standup" }, { id: "kestrel-legal" }, { id: "helios-security" }, { id: "maya-jonah-weekly" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const meeting = getMeeting(id);
  return { title: meeting?.title ?? "Meeting" };
}

export default async function MeetingPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { t } = await searchParams;
  const meeting = getMeeting(id);
  if (!meeting) notFound();
  const initialTime = Number(t ?? 0);
  return <CallView meeting={meeting} initialTime={Number.isFinite(initialTime) ? initialTime : 0} />;
}
