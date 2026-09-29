import type { Cue, Meeting, Person, TemplateId } from "@/lib/types";

export const people: Person[] = [
  { id: "maya", name: "Maya Chen", email: "maya@northwind.io", title: "VP Sales", company: "Northwind", initials: "MC", hue: "#3c3ad8" },
  { id: "andre", name: "Andre Walsh", email: "andre@northwind.io", title: "CRO", company: "Northwind", initials: "AW", hue: "#0f6e56" },
  { id: "priya", name: "Priya Shah", email: "priya@northwind.io", title: "Account Executive", company: "Northwind", initials: "PS", hue: "#b45309" },
  { id: "luis", name: "Luis Ortega", email: "luis@northwind.io", title: "Account Executive", company: "Northwind", initials: "LO", hue: "#be123c" },
  { id: "samira", name: "Samira Haddad", email: "samira@northwind.io", title: "Sales Engineer", company: "Northwind", initials: "SH", hue: "#0369a1" },
  { id: "jonah", name: "Jonah Blake", email: "jonah@northwind.io", title: "RevOps", company: "Northwind", initials: "JB", hue: "#6d28d9" },
  { id: "helen", name: "Helen Cho", email: "helen@northwind.io", title: "Customer Success", company: "Northwind", initials: "HC", hue: "#0f766e" },
  { id: "chris", name: "Chris Dalton", email: "chris@northwind.io", title: "FP&A", company: "Northwind", initials: "CD", hue: "#44403c" },
  { id: "nina", name: "Nina Alvarez", email: "nina@brightline.com", title: "Director of Operations", company: "Brightline", initials: "NA", hue: "#9a3412" },
  { id: "owen", name: "Owen Park", email: "owen@brightline.com", title: "IT Lead", company: "Brightline", initials: "OP", hue: "#1d4ed8" },
  { id: "ruth", name: "Ruth Keller", email: "ruth@northwind.io", title: "Recruiter", company: "Northwind", initials: "RK", hue: "#a21caf" },
  { id: "sam", name: "Sam Okonkwo", email: "sam.okonkwo@gmail.com", title: "Senior engineer", company: "Candidate", initials: "SO", hue: "#047857" },
  { id: "leo", name: "Leo Martins", email: "leo@northwind.io", title: "Product Design", company: "Northwind", initials: "LM", hue: "#7c3aed" },
  { id: "ava", name: "Ava Singh", email: "ava@northwind.io", title: "Product Manager", company: "Northwind", initials: "AS", hue: "#c2410c" },
];

export const peopleById: Record<string, Person> = Object.fromEntries(
  people.map((person) => [person.id, person]),
);

export const viewer = peopleById.maya;

let cueSerial = 0;

function cues(rows: [number, number, string, string][]): Cue[] {
  return rows.map(([start, end, speakerId, text]) => ({
    id: `c${cueSerial++}`,
    start,
    end,
    speakerId,
    text,
  }));
}

const forecastSummaries: Meeting["summaries"] = {
  general: [
    {
      heading: "The number",
      bullets: [
        { text: "Commit is $4.2M against a $4.8M plan. Upside is $900k and must stay in its own column on the board slide.", at: 95 },
        { text: "If Kestrel slips, commit falls to about $3.6M, which is the line that keeps the hiring plan open.", at: 1900 },
      ],
    },
    {
      heading: "Deals that move the quarter",
      bullets: [
        { text: "Kestrel Insurance is $620k. Procurement accepted price. Legal rejected the liability cap. The team will walk before a 25% discount.", at: 560 },
        { text: "Helios Health slipped to Oct 28 after the champion left. Security review is the blocker, not price.", at: 1100 },
        { text: "Brightline’s $280k renewal is soft. Usage is down 22% and the exec sponsor has gone quiet.", at: 1630 },
      ],
    },
    {
      heading: "How the team will run it",
      bullets: [
        { text: "Discount cap is 18%. Andre is the only exception path, through Friday deal desk, not hallway asks.", at: 860 },
        { text: "Jonah publishes one forecast sheet tomorrow at 10:00 with commit and upside separated.", at: 2400 },
      ],
    },
  ],
  chronological: [
    {
      heading: "Open and the gap",
      bullets: [
        { text: "Maya frames the hour: three deals, one board number, no blended story.", at: 8 },
        { text: "Jonah puts commit at $4.2M, upside at $900k, best case at $5.1M.", at: 95 },
        { text: "Andre stops the room from blending commit and upside on the board slide.", at: 400 },
      ],
    },
    {
      heading: "Kestrel, then the discount rule",
      bullets: [
        { text: "Priya: Kestrel procurement said yes, legal said the liability cap is a no.", at: 560 },
        { text: "Andre sets the cap at 18% and asks if the team will walk at 25%. Maya says yes.", at: 860 },
      ],
    },
    {
      heading: "Helios and Brightline",
      bullets: [
        { text: "Luis: Helios champion is gone, close date is Oct 28, value is $410k.", at: 1100 },
        { text: "Samira can run the Helios security workshop on Thursday.", at: 1360 },
        { text: "Helen: Brightline usage is down 22%. Maya pulls the save plan into this week.", at: 1630 },
      ],
    },
    {
      heading: "The math and the close",
      bullets: [
        { text: "Chris: a Kestrel slip drops commit to $3.6M and reopens the hiring plan.", at: 1900 },
        { text: "Jonah owns the single sheet. Priya owns redlines today. Deal desk is Friday.", at: 2400 },
      ],
    },
  ],
  sales: [
    {
      heading: "Pipeline",
      bullets: [
        { text: "Kestrel, $620k, late stage. Price is agreed. Legal is the only open item.", at: 560 },
        { text: "Helios, $410k, slipped. New economic buyer is not confirmed until Friday.", at: 1100 },
        { text: "Brightline, $280k renewal, at risk on usage and sponsor silence.", at: 1630 },
      ],
    },
    {
      heading: "Deal strategy",
      bullets: [
        { text: "Do not trade the liability cap for a deeper discount. Walk if Kestrel needs 25% off.", at: 860 },
        { text: "Helios needs a security workshop before another pricing conversation.", at: 1360 },
      ],
    },
    {
      heading: "Forecast hygiene",
      bullets: [
        { text: "Board sees commit only. Upside is labeled upside.", at: 400 },
        { text: "One sheet, tomorrow 10:00, owned by RevOps.", at: 2400 },
      ],
    },
  ],
  spiced: [
    {
      heading: "Situation",
      bullets: [
        { text: "Quarter plan is $4.8M. The honest commit is $4.2M, and three deals decide the gap.", at: 95 },
      ],
    },
    {
      heading: "Pain",
      bullets: [
        { text: "Kestrel legal will not sign the current liability cap.", at: 560 },
        { text: "Helios lost the champion and has not finished security review.", at: 1100 },
        { text: "Brightline is using Harbor less, and the sponsor is quiet.", at: 1630 },
      ],
    },
    {
      heading: "Impact",
      bullets: [
        { text: "A Kestrel slip is about $400k under the line that keeps hiring open.", at: 1900 },
      ],
    },
    {
      heading: "Critical event",
      bullets: [
        { text: "Board meeting Friday. The number they hear is the commit, not the best case.", at: 3380 },
        { text: "Kestrel wants an answer on redlines before Thursday.", at: 2670 },
      ],
    },
    {
      heading: "Decision",
      bullets: [
        { text: "Discount cap 18%. Liability stays at 12 months. Walk at 25%.", at: 860 },
        { text: "Deal desk Friday is the only path for an exception.", at: 2900 },
      ],
    },
  ],
  meddpicc: [
    {
      heading: "Metrics",
      bullets: [
        { text: "Kestrel $620k, Helios $410k, Brightline renewal $280k. Plan $4.8M, commit $4.2M.", at: 95 },
      ],
    },
    {
      heading: "Economic buyer",
      bullets: [
        { text: "Kestrel’s buyer already accepted price. Helios’s buyer left; Luis has an intro Friday.", at: 3160 },
        { text: "Brightline’s exec sponsor has stopped replying.", at: 1630 },
      ],
    },
    {
      heading: "Decision criteria",
      bullets: [
        { text: "Kestrel is deciding on the liability cap, not on features or price.", at: 560 },
        { text: "Helios is deciding on security review.", at: 1360 },
      ],
    },
    {
      heading: "Decision process",
      bullets: [
        { text: "Priya sends redlines today. Kestrel legal responds before Thursday.", at: 2670 },
        { text: "Exceptions go through Andre at Friday deal desk.", at: 2900 },
      ],
    },
    {
      heading: "Paper process",
      bullets: [
        { text: "Liability cap is the paper blocker on Kestrel. Discount language is not the concession to offer.", at: 860 },
      ],
    },
    {
      heading: "Identify pain",
      bullets: [
        { text: "Brightline pain is adoption, down 22%, not a contract term.", at: 1630 },
      ],
    },
    {
      heading: "Champion",
      bullets: [
        { text: "Helios champion is gone. The Friday intro is the replacement, not a close.", at: 1100 },
      ],
    },
    {
      heading: "Competition",
      bullets: [
        { text: "No competitor was named. The risk is delay and a renewal going quiet, not a bake-off.", at: 1900 },
      ],
    },
  ],
  bant: [
    {
      heading: "Budget",
      bullets: [
        { text: "Kestrel accepted the price. The open fight is terms, so budget is not the objection.", at: 560 },
        { text: "Discount authority stops at 18%.", at: 860 },
      ],
    },
    {
      heading: "Authority",
      bullets: [
        { text: "Andre owns exceptions. Maya owns the number the board hears.", at: 400 },
        { text: "Helios economic buyer is unconfirmed until Friday.", at: 3160 },
      ],
    },
    {
      heading: "Need",
      bullets: [
        { text: "Helios need is blocked on security. Brightline need is weakening because usage fell.", at: 1360 },
      ],
    },
    {
      heading: "Timing",
      bullets: [
        { text: "Kestrel can still land this quarter if redlines move today. Helios is October. Board is Friday.", at: 2670 },
      ],
    },
  ],
};

const forecastFollowUp = `Team —

Board number stays the commit: $4.2M against a $4.8M plan. Upside ($900k) stays in its own column.

Kestrel ($620k) is waiting on the liability cap. We will not discount past 18%, and we will walk if they need 25%. Priya is sending redlines to legal today.

Helios ($410k) slipped to Oct 28. Samira is running the security workshop Thursday. Luis is introducing the new buyer Friday.

Brightline renewal ($280k) is soft — usage is down 22%. Helen is pulling the save plan into this week.

Jonah is publishing the single forecast sheet tomorrow at 10:00. Deal desk is Friday. No hallway discounts.

Maya`;

export const meetings: Meeting[] = [
  {
    id: "q4-forecast",
    title: "Q4 forecast review",
    startsAt: "2026-09-29T09:00:00+05:00",
    whenLabel: "Tue, Sep 29 · 9:00 AM",
    durationSec: 58 * 60 + 12,
    platform: "Zoom",
    state: "ready",
    hostId: "maya",
    attendeeIds: ["maya", "andre", "priya", "luis", "samira", "jonah", "helen", "chris"],
    topics: ["Forecast", "Kestrel", "Discount cap", "Brightline"],
    defaultTemplate: "general",
    followUp: forecastFollowUp,
    clips: [
      { id: "commit-upside", title: "Keep commit and upside apart", start: 400, end: 520 },
      { id: "discount-cap", title: "Walk away above 18%", start: 860, end: 990 },
      { id: "quarter-math", title: "What a Kestrel slip does to hiring", start: 1900, end: 2060 },
    ],
    actions: [
      { id: "a-sheet", text: "Publish one forecast sheet with commit and upside in separate columns.", ownerId: "jonah", due: "Tomorrow · 10:00 AM", at: 2400 },
      { id: "a-redlines", text: "Send the Kestrel liability redlines to legal.", ownerId: "priya", due: "Today", at: 2670 },
      { id: "a-workshop", text: "Run the Helios security workshop.", ownerId: "samira", due: "Thursday", at: 1360 },
      { id: "a-save", text: "Bring the Brightline save plan forward to this week.", ownerId: "helen", due: "Wednesday", at: 2180 },
      { id: "a-buyer", text: "Introduce the new economic buyer at Helios.", ownerId: "luis", due: "Friday", at: 3160 },
      { id: "a-desk", text: "Hold deal desk on Kestrel, Helios, and Brightline. No hallway discounts.", ownerId: "andre", due: "Friday", at: 2900 },
      { id: "a-board", text: "Use the commit, not the best case, in the board update.", ownerId: "maya", due: "Friday", at: 3380 },
      { id: "a-hiring", text: "Restate the hiring plan if Kestrel slips out of the quarter.", ownerId: "chris", due: "Thursday", at: 1900 },
    ],
    summaries: forecastSummaries,
    cues: cues([
      [8, 70, "maya", "Thanks for the hour. I want three deals and one number. If a story needs both commit and upside to sound fine, it is not fine. Andre has the board on Friday."],
      [95, 180, "jonah", "Commit is $4.2 million against the $4.8 million plan. Upside is $900 thousand if Kestrel and Helios both land. Best case is $5.1 million. I do not want best case in the same cell as commit."],
      [400, 490, "andre", "Then stop blending them. The board slide last month had a single bar. I spent the meeting explaining which part of the bar was hope. Commit in one column. Upside in another. I will not present a blend."],
      [500, 545, "maya", "Agreed. Jonah owns that sheet. The rest of this call is whether the commit is even real."],
      [560, 690, "priya", "Kestrel Insurance is $620 thousand. Procurement accepted the price on Monday. Legal rejected the liability cap this morning. They want uncapped, or they want a much bigger discount to live with a cap. Those are not the same conversation."],
      [700, 760, "andre", "Which conversation are they actually in?"],
      [770, 850, "priya", "Their counsel wrote that the cap is the issue. The discount showed up in the same paragraph, almost as a consolation. I think if we hold the line on terms, price stays where it is."],
      [860, 980, "andre", "Then the rule is simple. Discount cap is 18 percent. I am the only exception, and it comes through deal desk on Friday, not a Slack message at 6. Are we willing to walk if they need 25 percent?"],
      [990, 1040, "maya", "Yes. We walk at 25. I would rather explain a slipped deal than a bad one."],
      [1100, 1240, "luis", "Helios Health moved. The champion left on the 18th. My new contact says the close date is October 28, not this month. It is $410 thousand. I had it in commit. I am taking it out."],
      [1250, 1320, "andre", "Good. Leaving it in would have been the blend I just killed."],
      [1360, 1500, "samira", "Their security team sent a questionnaire, not a no. It is a standard review, about forty questions, and two of them need a solutions engineer on a call. I can do Thursday. If we try to close Helios on price before that workshop, we will waste the week."],
      [1510, 1580, "luis", "Thursday works. I also have an intro to the person who replaced the champion. Friday, not before."],
      [1630, 1780, "helen", "Brightline is the one I am worried about. Renewal is $280 thousand, up for signature in October. Usage is down 22 percent since July. Nina is still responsive. The exec sponsor has not answered in three weeks."],
      [1790, 1860, "maya", "Is this a save, or are we pretending a renewal is healthy because the contract has not expired?"],
      [1870, 1895, "helen", "It is a save. I do not have a plan I would show you yet."],
      [1900, 2060, "chris", "Then let me put the quarter in one sentence. If Kestrel slips, commit falls from $4.2 million to about $3.6 million. That is roughly $400 thousand under the line we told the board keeps the hiring plan open. Helios was never going to save that, once it is out of commit."],
      [2070, 2140, "andre", "So Kestrel is the quarter. Brightline is next quarter’s churn. Helios is October. Say it that plainly."],
      [2180, 2300, "maya", "Helen, pull the Brightline save plan into this week, not the week after the renewal scare. I want the sponsor problem named, and one offer that is not a discount. Usage is down. A discount does not fix usage."],
      [2310, 2380, "helen", "I will have it Wednesday. I will ask Nina for the sponsor meeting before I write the offer."],
      [2400, 2540, "jonah", "I will publish a single forecast sheet tomorrow at 10:00. Commit and upside in separate columns. Kestrel stays in commit until Priya says legal slipped. Helios moves to upside, dated October 28. Brightline stays in renewal, flagged at risk."],
      [2550, 2620, "chris", "Send me the sheet before you send the room. I want the hiring line on it in the footnote, not in the headline."],
      [2670, 2800, "priya", "I will send Kestrel’s redlines to our counsel today. I am not offering the 25 percent, and I am not offering to lift the cap. I should know by Thursday if they will sign. If they go quiet, I will tell Jonah the same day so commit can move."],
      [2810, 2880, "samira", "Copy me. If their counsel asks a security question dressed up as a legal one, I would rather answer it than have it become another week."],
      [2900, 3040, "andre", "Deal desk is Friday, fifteen minutes a deal, Kestrel then Helios then Brightline. If you need an exception to the 18 percent cap, that is the meeting. A hallway yes is a no. I will say that again in the note."],
      [3050, 3120, "maya", "And the board update uses Jonah’s commit column. I will not narrate upside as if it were signed."],
      [3160, 3280, "luis", "I need Samira on Thursday, and I will confirm the new Helios buyer intro for Friday. I am not asking to put Helios back in commit. I am asking for the workshop so October is real."],
      [3290, 3360, "samira", "Thursday is held. Send me the questionnaire answers you already have so I am not starting from a blank page."],
      [3380, 3485, "maya", "Then we are done. Commit is $4.2 million. Kestrel is the swing. We walk before 25 percent. Helios is October. Brightline gets a save plan this week. Jonah’s sheet is the source of truth tomorrow morning. I will see the three deals at deal desk, not in side threads."],
    ]),
  },
  {
    id: "harbor-roadmap",
    title: "Harbor roadmap sync",
    startsAt: "2026-09-29T13:10:00+05:00",
    whenLabel: "Tue, Sep 29 · 1:10 PM",
    durationSec: 42 * 60,
    platform: "Google Meet",
    state: "processing",
    hostId: "ava",
    attendeeIds: ["ava", "leo", "maya", "jonah"],
    topics: ["Roadmap"],
    defaultTemplate: "general",
    summaries: {},
    cues: [],
    actions: [],
    clips: [],
  },
  {
    id: "share-design",
    title: "Design crit: customer share links",
    startsAt: "2026-09-28T15:00:00+05:00",
    whenLabel: "Mon, Sep 28 · 3:00 PM",
    durationSec: 25 * 60,
    platform: "Google Meet",
    state: "ready",
    hostId: "leo",
    attendeeIds: ["leo", "ava", "maya"],
    topics: ["Sharing", "Guest access"],
    defaultTemplate: "general",
    clips: [
      { id: "expire", title: "Guest links expire in 14 days", start: 420, end: 560 },
    ],
    actions: [
      { id: "d-expire", text: "Ship 14-day expiry as the default on customer share links.", ownerId: "ava", due: "This sprint", at: 420 },
      { id: "d-copy", text: "Rewrite the share dialog so the expiry is visible before you copy the link.", ownerId: "leo", due: "Wednesday", at: 700 },
    ],
    summaries: {
      general: [
        {
          heading: "Decision",
          bullets: [
            { text: "Guest links expire after 14 days, and they are not indexed. A customer should not need a Harbor account to open one.", at: 420 },
            { text: "The person who creates the link sees the expiry before the copy button, not in a settings page they will never open.", at: 700 },
          ],
        },
        {
          heading: "Left open",
          bullets: [
            { text: "Ava still wants a way to revoke a link early. Leo will sketch it, not build it, this week.", at: 1100 },
          ],
        },
      ],
      chronological: [
        {
          heading: "In order",
          bullets: [
            { text: "Leo shows the current dialog. Maya says she has sent links and then had no idea who still had them.", at: 40 },
            { text: "The room picks 14 days over 7. A week is too short for a legal review.", at: 420 },
            { text: "Ava asks for revoke. It is sketched, not scheduled.", at: 1100 },
          ],
        },
      ],
    },
    cues: cues([
      [40, 130, "leo", "This is the share dialog a customer sees when someone at Northwind sends a Harbor view. Today the link lives forever. Maya, you asked for this crit because a prospect forwarded one."],
      [140, 230, "maya", "I sent a pricing view to Kestrel in June. Their counsel still had it last week. I had no way to know, and no way to kill it. I do not want a login wall. I want the link to die."],
      [250, 360, "ava", "A login wall will stall procurement. They already hate our SSO. The link can be a secret URL with an expiry. The question is the number of days, and whether we tell the sender."],
      [420, 560, "leo", "Proposal: guest links expire after 14 days, and they are not indexed. Seven days fails when counsel is slow, which is every deal Priya runs. Thirty days is how we got the June link still alive."],
      [570, 660, "maya", "Fourteen is the one I will actually use. Show it on the dialog. If I have to open settings to learn the link dies, I will assume it does not."],
      [700, 820, "ava", "Then the copy button sits under the expiry, not beside a vague lock icon. Default 14 days. A power user can pick 7 or 30. We do not offer never."],
      [840, 960, "leo", "Copy is one action. Under it, a line: anyone with the link can view until the date. No second checkbox for ‘public’. Public is how these get indexed."],
      [1100, 1240, "ava", "I still want revoke, for the link Maya already regrets. Not this sprint. Leo, sketch the revoked state so the viewer sees a dead page and not a spinner. I will not schedule the build until the sketch exists."],
      [1260, 1380, "maya", "That is enough. Fourteen days, visible before copy, no index, revoke as a sketch. I will use it on the next Kestrel view and tell you if counsel complains."],
    ]),
  },
  {
    id: "maya-jonah",
    title: "1:1 Maya / Jonah",
    startsAt: "2026-09-26T09:30:00+05:00",
    whenLabel: "Fri, Sep 26 · 9:30 AM",
    durationSec: 28 * 60,
    platform: "Zoom",
    state: "ready",
    hostId: "maya",
    attendeeIds: ["maya", "jonah"],
    topics: ["Forecast hygiene", "1:1"],
    defaultTemplate: "oneOnOne",
    clips: [],
    actions: [
      { id: "j-columns", text: "Split commit and upside before Tuesday’s forecast review.", ownerId: "jonah", due: "Tuesday", at: 480 },
      { id: "j-ask", text: "Tell Maya the same day a rep moves a deal between columns.", ownerId: "jonah", due: "Ongoing", at: 900 },
    ],
    summaries: {
      oneOnOne: [
        {
          heading: "How Jonah is",
          bullets: [
            { text: "He is spending nights rebuilding the forecast because reps edit a single number in Slack after the sheet is locked.", at: 80 },
          ],
        },
        {
          heading: "The work",
          bullets: [
            { text: "Tuesday’s review will show commit and upside as separate columns. Jonah owns the sheet. Reps do not get a side door.", at: 480 },
          ],
        },
        {
          heading: "Commitments",
          bullets: [
            { text: "Jonah tells Maya the day a deal changes column, even if the weekly meeting is tomorrow.", at: 900 },
          ],
        },
      ],
      general: [
        {
          heading: "Notes",
          bullets: [
            { text: "The forecast process is the topic, not a status round. Jonah needs the Tuesday meeting to back the sheet instead of relitigating it.", at: 80 },
            { text: "Maya agrees the board slide failed because commit and upside were one bar.", at: 300 },
          ],
        },
      ],
      chronological: [
        {
          heading: "In order",
          bullets: [
            { text: "Jonah describes the night edits.", at: 80 },
            { text: "They agree the Tuesday review is where the new columns get defended.", at: 480 },
            { text: "Maya asks for same-day notice when a number moves.", at: 900 },
          ],
        },
      ],
    },
    cues: cues([
      [20, 70, "maya", "No status round. I want to know what about the forecast job is actually breaking."],
      [80, 220, "jonah", "Reps lock the sheet on Thursday, then change a number in Slack on Sunday. I rebuild the board slide by hand. Last month Andre presented a blend because I ran out of time to split it. I do not want another night of that before Tuesday."],
      [240, 360, "maya", "The blend was my miss too. I let a single bar go to the board. Tuesday’s review has Andre in it. If the sheet is two columns, he will defend it, and the reps will stop editing it in Slack because he will ask who moved the number."],
      [480, 640, "jonah", "Then I will split commit and upside before Tuesday. Kestrel stays in commit until Priya says otherwise. I will not let Helios sit in commit just because Luis is attached to the date."],
      [660, 780, "maya", "Good. If you are unsure, put it in upside and make them argue it back. Arguing a deal into commit is healthier than quietly leaving it there."],
      [900, 1080, "jonah", "If a rep moves a deal between columns, I will tell you the same day. Even if the weekly meeting is tomorrow. Especially then."],
      [1100, 1220, "maya", "That is the whole 1:1. Protect your evenings. The sheet is the job. The reconstruction is not."],
    ]),
  },
  {
    id: "hiring-sam",
    title: "Debrief: Sam Okonkwo",
    startsAt: "2026-09-25T11:00:00+05:00",
    whenLabel: "Thu, Sep 25 · 11:00 AM",
    durationSec: 46 * 60,
    platform: "Zoom",
    state: "ready",
    hostId: "ruth",
    attendeeIds: ["ruth", "maya", "ava", "sam"],
    topics: ["Hiring", "Senior engineer"],
    defaultTemplate: "recruiting",
    followUp: `Ruth —

Recommendation is hire. Sam debugs in the open, names what he does not know, and has shipped a billing system through an audit.

Do not send a take-home. The onsite already showed the work. The open concern is on-call: he wants a rotation with a human, not a hero week. Ava can speak to that in the offer conversation.

Hold the offer until Maya sends the written yes. She will do it today.

Maya`,
    clips: [
      { id: "no-takehome", title: "No take-home", start: 980, end: 1120 },
    ],
    actions: [
      { id: "h-yes", text: "Send Ruth a written hire recommendation for Sam Okonkwo.", ownerId: "maya", due: "Today", at: 2100 },
      { id: "h-oncall", text: "Describe the on-call rotation in the offer conversation, before Sam has to ask.", ownerId: "ava", due: "With the offer", at: 1500 },
    ],
    summaries: {
      recruiting: [
        {
          heading: "Signal",
          bullets: [
            { text: "Sam walked a production billing incident on the whiteboard and separated what he knew from what he would measure first.", at: 240 },
            { text: "He has taken a payments system through an external audit without a war room.", at: 700 },
          ],
        },
        {
          heading: "Concern",
          bullets: [
            { text: "He asked how on-call works and went quiet when Ava described a hero week. He wants a rotation.", at: 1500 },
          ],
        },
        {
          heading: "Recommendation",
          bullets: [
            { text: "Hire. Do not send a take-home. The onsite already showed how he debugs.", at: 980 },
          ],
        },
      ],
      general: [
        {
          heading: "Debrief",
          bullets: [
            { text: "The panel’s recommendation is hire, with the on-call shape made explicit in the offer.", at: 2100 },
            { text: "A take-home would repeat the onsite and slow a candidate who already has another process moving.", at: 980 },
          ],
        },
      ],
      chronological: [
        {
          heading: "In order",
          bullets: [
            { text: "Ava recounts the debugging exercise.", at: 240 },
            { text: "Maya argues against a take-home.", at: 980 },
            { text: "The on-call question is the only soft spot. They still vote hire.", at: 1500 },
          ],
        },
      ],
    },
    cues: cues([
      [30, 120, "ruth", "Debrief for Sam Okonkwo, senior engineer. He is still in the waiting room from his last round, so keep specifics off Slack. I need a hire, a no, or a hold today. He has a competing process."],
      [240, 420, "ava", "The onsite was a billing incident. He did not perform certainty. He listed three hypotheses, said which log would kill two of them, and he was right about the idempotency key. I would let him on the payments code."],
      [440, 560, "maya", "I was in the hiring manager slot. He answered the audit question without a hero story. He said the audit passed because they had the evidence already, not because they assembled it that week."],
      [700, 860, "sam", "I can stay for five minutes. The audit work was mostly boring evidence. The incident you used in the exercise is the interesting part. I would want to know how often that idempotency bug class shows up here before I talk compensation."],
      [870, 960, "ruth", "Thank you, Sam. We will take the rest without you."],
      [980, 1140, "maya", "We should not send a take-home. The onsite already showed how he debugs. A weekend project tells us who has a free Sunday, and he told Ruth he is in another final round. I am a yes."],
      [1160, 1320, "ava", "Yes from me. I want him on the billing service, not on a greenfield rewrite. He is careful in a way our last hire was not."],
      [1500, 1680, "ruth", "The soft spot: when I described on-call he asked who gets Sunday, and he went quiet when I said it depends on the incident. He later told me he left a team that ran a hero week. If we cannot offer a rotation, we should say so before the offer."],
      [1700, 1860, "ava", "We can offer a rotation. I have been saying the hero week is a bug. I will say that in the offer conversation so he does not have to extract it."],
      [2100, 2280, "maya", "Then the recommendation is hire. Ruth, I will send you the written yes today. Do not send a take-home. Ava owns the on-call sentence in the offer."],
    ]),
  },
  {
    id: "brightline-kickoff",
    title: "Brightline onboarding kickoff",
    startsAt: "2026-09-23T14:00:00+05:00",
    whenLabel: "Tue, Sep 23 · 2:00 PM",
    durationSec: 36 * 60,
    platform: "Teams",
    state: "ready",
    hostId: "helen",
    attendeeIds: ["helen", "maya", "nina", "owen"],
    topics: ["Onboarding", "SSO", "Brightline"],
    defaultTemplate: "customer",
    followUp: `Nina, Owen —

Thank you for the kickoff. Here is what we agreed.

Harbor goes live for the ops team first, not the whole company. Owen will send the SSO metadata this week. We are aiming to turn SSO on by October 10.

Nina wants a weekly office hour for the first month, thirty minutes, so questions do not sit in email. Helen will host it.

The exec sponsor still needs to name a backup for the weeks she is out. Nina is confirming that name.

Helen`,
    clips: [
      { id: "sso-date", title: "SSO by October 10", start: 640, end: 780 },
    ],
    actions: [
      { id: "b-sso", text: "Send Harbor the SSO metadata.", ownerId: "owen", due: "This week", at: 640 },
      { id: "b-hours", text: "Host a weekly 30-minute office hour for the first month.", ownerId: "helen", due: "Starting next week", at: 1100 },
      { id: "b-sponsor", text: "Confirm a backup for the exec sponsor.", ownerId: "nina", due: "Friday", at: 1400 },
    ],
    summaries: {
      customer: [
        {
          heading: "Outcome they want",
          bullets: [
            { text: "Ops adopts Harbor first. A company-wide launch is explicitly out of the first month.", at: 120 },
          ],
        },
        {
          heading: "Stakeholders",
          bullets: [
            { text: "Nina owns the rollout. Owen owns identity. The exec sponsor was not on the call and needs a named backup.", at: 1400 },
          ],
        },
        {
          heading: "Risks",
          bullets: [
            { text: "SSO metadata is the critical path. Without it, October 10 slips and the ops team keeps the old sheet.", at: 640 },
          ],
        },
        {
          heading: "Next steps",
          bullets: [
            { text: "Owen sends metadata this week. Helen runs a weekly office hour so questions do not sit in email.", at: 1100 },
          ],
        },
      ],
      general: [
        {
          heading: "Kickoff",
          bullets: [
            { text: "Brightline will start with the ops team, turn SSO on by October 10, and use a weekly office hour instead of a ticket pile.", at: 120 },
          ],
        },
      ],
      chronological: [
        {
          heading: "In order",
          bullets: [
            { text: "Nina limits the first launch to ops.", at: 120 },
            { text: "Owen commits to SSO metadata this week for an October 10 turn-on.", at: 640 },
            { text: "They add a weekly office hour and a sponsor backup.", at: 1100 },
          ],
        },
      ],
    },
    cues: cues([
      [20, 100, "helen", "Welcome. This kickoff is to leave with a first month we can both run. Maya is here because Brightline is the renewal we most want to deserve."],
      [120, 280, "nina", "Do not launch Harbor to the whole company. Ops first, about forty people. They live in a sheet today. If those forty still open the sheet in week three, the rollout failed, regardless of what IT provisioned."],
      [300, 420, "maya", "That is a clearer success test than a license count. We will use it."],
      [440, 600, "owen", "Identity is the gate. I will not have the ops team on passwords they will write down. I can send SSO metadata this week if your side can take a standard SAML app. I need a named engineer, not a queue."],
      [640, 800, "helen", "You have me, and Samira if a claim mapping gets weird. If metadata arrives this week, we turn SSO on by October 10. If it slips, tell me the day it slips. A quiet slip is how October becomes November."],
      [820, 980, "nina", "October 10 is the date I will tell the sponsor. She is traveling the week after. If we miss it, she will hear about it in a hallway, and I will be the one in the hallway."],
      [1100, 1280, "helen", "Then we also need a place for questions that is not email. I will host a weekly office hour for the first month, thirty minutes. Nina, you do not have to attend all of them. Owen, I want you at the first two."],
      [1300, 1380, "owen", "First two, yes. After that, only if SSO is still the topic."],
      [1400, 1560, "nina", "The sponsor needs a backup for the weeks she is out. I do not have the name yet. I will confirm it by Friday. Please do not email her directly before I do. She will experience that as alarm."],
      [1580, 1700, "maya", "We will wait for your note. Helen owns the office hour. Owen owns metadata. The date we are all willing to say out loud is October 10."],
    ]),
  },
  {
    id: "monday-standup",
    title: "Sales standup",
    startsAt: "2026-09-22T09:15:00+05:00",
    whenLabel: "Mon, Sep 22 · 9:15 AM",
    durationSec: 14 * 60,
    platform: "Zoom",
    state: "ready",
    hostId: "maya",
    attendeeIds: ["maya", "priya", "luis", "helen"],
    topics: ["Standup"],
    defaultTemplate: "standup",
    clips: [],
    actions: [
      { id: "s-kestrel", text: "Confirm Kestrel procurement has the updated order form.", ownerId: "priya", due: "Monday", at: 180 },
    ],
    summaries: {
      standup: [
        {
          heading: "Yesterday",
          bullets: [
            { text: "Priya sent Kestrel the revised order form. Luis lost the Helios champion over the weekend and had not yet moved the date.", at: 80 },
          ],
        },
        {
          heading: "Today",
          bullets: [
            { text: "Priya confirms procurement received the form. Helen sits with Brightline’s usage drop before the renewal conversation.", at: 180 },
          ],
        },
        {
          heading: "Blockers",
          bullets: [
            { text: "Luis is blocked on a new buyer at Helios. Maya tells him to take it out of commit if the buyer is not real by the forecast review.", at: 400 },
          ],
        },
      ],
      general: [
        {
          heading: "Standup",
          bullets: [
            { text: "Kestrel paperwork is in motion. Helios is already wobbling a week before the forecast review. Brightline usage is the renewal risk.", at: 80 },
          ],
        },
      ],
    },
    cues: cues([
      [10, 60, "maya", "Fourteen minutes. Yesterday, today, blocker. No demos."],
      [80, 170, "priya", "Yesterday I sent Kestrel the revised order form. Today I confirm procurement actually opened it. No blocker unless their counsel replies before I do."],
      [180, 300, "luis", "Yesterday the Helios champion told me she is leaving. Today I am trying to get the intro to her replacement. Blocker is that intro. The close date in the sheet is still this month, which I no longer believe."],
      [320, 390, "maya", "Do not leave a date you do not believe. If the new buyer is not real by the forecast review, it comes out of commit."],
      [400, 520, "helen", "Yesterday I pulled Brightline’s usage. It is down hard since July. Today I will sit with that before anyone writes them a cheerful renewal note. Blocker is the sponsor, who has been quiet."],
      [540, 640, "maya", "Bring the quiet sponsor to the forecast review as a risk, not as a color. We are done."],
    ]),
  },
  {
    id: "kestrel-legal",
    title: "Kestrel legal review",
    startsAt: "2026-09-30T10:00:00+05:00",
    whenLabel: "Wed, Sep 30 · 10:00 AM",
    durationSec: 45 * 60,
    platform: "Zoom",
    state: "scheduled",
    hostId: "priya",
    attendeeIds: ["priya", "maya", "samira"],
    topics: ["Kestrel", "Legal"],
    defaultTemplate: "sales",
    summaries: {},
    cues: [],
    actions: [],
    clips: [],
  },
  {
    id: "helios-security",
    title: "Helios security workshop",
    startsAt: "2026-10-01T13:00:00+05:00",
    whenLabel: "Thu, Oct 1 · 1:00 PM",
    durationSec: 60 * 60,
    platform: "Google Meet",
    state: "scheduled",
    hostId: "samira",
    attendeeIds: ["samira", "luis"],
    topics: ["Helios", "Security"],
    defaultTemplate: "sales",
    summaries: {},
    cues: [],
    actions: [],
    clips: [],
  },
  {
    id: "maya-jonah-weekly",
    title: "Maya / Jonah weekly",
    startsAt: "2026-10-02T09:30:00+05:00",
    whenLabel: "Fri, Oct 2 · 9:30 AM",
    durationSec: 30 * 60,
    platform: "Zoom",
    state: "scheduled",
    hostId: "maya",
    attendeeIds: ["maya", "jonah"],
    topics: ["1:1"],
    defaultTemplate: "oneOnOne",
    summaries: {},
    cues: [],
    actions: [],
    clips: [],
  },
];

const templateRank: TemplateId[] = [
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

export function getMeeting(id: string): Meeting | undefined {
  return meetings.find((meeting) => meeting.id === id);
}

export function templatesFor(meeting: Meeting): TemplateId[] {
  return templateRank.filter((template) => meeting.summaries[template]);
}

export function externalMeeting(meeting: Meeting): boolean {
  return meeting.attendeeIds.some((id) => {
    const company = peopleById[id]?.company;
    return company && company !== "Northwind";
  });
}
