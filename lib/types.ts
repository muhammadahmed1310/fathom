export type Person = {
  id: string;
  name: string;
  email: string;
  title: string;
  company: string;
  initials: string;
  hue: string;
};

export type TemplateId =
  | "general"
  | "chronological"
  | "sales"
  | "spiced"
  | "meddpicc"
  | "bant"
  | "customer"
  | "recruiting"
  | "oneOnOne"
  | "standup";

export type Bullet = {
  text: string;
  at: number;
};

export type Section = {
  heading: string;
  bullets: Bullet[];
};

export type Cue = {
  id: string;
  start: number;
  end: number;
  speakerId: string;
  text: string;
};

export type ActionItem = {
  id: string;
  text: string;
  ownerId: string;
  due: string;
  at: number;
};

export type Clip = {
  id: string;
  title: string;
  start: number;
  end: number;
};

export type MeetingState = "ready" | "processing" | "scheduled";

export type Meeting = {
  id: string;
  title: string;
  startsAt: string;
  whenLabel: string;
  durationSec: number;
  platform: "Zoom" | "Google Meet" | "Teams";
  state: MeetingState;
  hostId: string;
  attendeeIds: string[];
  topics: string[];
  cues: Cue[];
  summaries: Partial<Record<TemplateId, Section[]>>;
  defaultTemplate: TemplateId;
  actions: ActionItem[];
  clips: Clip[];
  followUp?: string;
};

export const templateOrder: TemplateId[] = [
  "general",
  "chronological",
  "sales",
  "spiced",
  "meddpicc",
  "bant",
  "customer",
  "recruiting",
  "oneOnOne",
  "standup",
];

export const templateLabel: Record<TemplateId, string> = {
  general: "General",
  chronological: "Chronological",
  sales: "Sales",
  spiced: "Sales — SPICED",
  meddpicc: "Sales — MEDDPICC",
  bant: "Sales — BANT",
  customer: "Customer success",
  recruiting: "Recruiting",
  oneOnOne: "1:1",
  standup: "Standup",
};
