import { cn } from "@/lib/cn";

type Props = {
  line1: string;
  accent: string;
  rest?: string;
  as?: "h1" | "h2";
  className?: string;
  id?: string;
};

/**
 * Oimachi-style display heading: grotesk body + italic serif accent word.
 */
export function DisplayHeading({
  line1,
  accent,
  rest,
  as: Tag = "h1",
  className,
  id,
}: Props) {
  return (
    <Tag
      id={id}
      className={cn(
        "m-0 max-w-[44rem] font-sans font-medium text-ink",
        "text-[clamp(2.35rem,5.8vw,4.35rem)] leading-[1.08] tracking-[-0.035em]",
        className,
      )}
    >
      <span className="block">{line1}</span>
      <span className="block">
        <em className="display-serif-italic">{accent}</em>
        {rest ? <> {rest}</> : null}
      </span>
    </Tag>
  );
}
