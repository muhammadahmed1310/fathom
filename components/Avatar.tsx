import type { Person } from "@/lib/types";

export function Avatar({
  person,
  size = 28,
  ring = false,
}: {
  person: Person;
  size?: number;
  ring?: boolean;
}) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full font-medium text-white ${ring ? "ring-2 ring-white" : ""}`}
      style={{ background: person.hue, width: size, height: size, fontSize: size < 24 ? 9 : 11 }}
      title={person.name}
    >
      {person.initials}
    </span>
  );
}

export function AvatarStack({ people, max = 4 }: { people: Person[]; max?: number }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span className="flex items-center -space-x-1.5">
      {shown.map((person) => (
        <Avatar key={person.id} person={person} size={22} ring />
      ))}
      {extra > 0 ? (
        <span className="inline-grid h-[22px] min-w-[22px] place-items-center rounded-full bg-ink px-1 text-[10px] font-medium text-white ring-2 ring-white">
          +{extra}
        </span>
      ) : null}
    </span>
  );
}
