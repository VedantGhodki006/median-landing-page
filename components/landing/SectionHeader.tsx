import { Reveal } from "./Reveal";

/** Centered eyebrow + two-line H2, shared by the content sections. */
export function SectionHeader({
  id,
  eyebrow,
  titleLines,
}: {
  id: string;
  eyebrow: string;
  titleLines: string[];
}) {
  return (
    <Reveal className="text-center">
      <p className="text-[13px] text-faint">{eyebrow}</p>
      <h2 id={id} className="h2 mt-5">
        {titleLines.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </h2>
    </Reveal>
  );
}
