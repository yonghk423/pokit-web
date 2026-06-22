import Link from "next/link";

type Props = {
  kicker?: string;
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function SectionHeading({
  kicker,
  title,
  viewAllHref = "/articles",
  viewAllLabel = "더보기",
}: Props) {
  return (
    <header className="section-heading">
      <div className="section-heading__titles">
        {kicker && <p>{kicker}</p>}
        <h2>{title}</h2>
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="section-heading__view-all">
          {viewAllLabel} →
        </Link>
      )}
    </header>
  );
}
