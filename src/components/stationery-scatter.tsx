import Image, { type StaticImageData } from "next/image";

import clip from "@/assets/app-promo/stationery/stationery-clip.png";
import highlighterCoral from "@/assets/app-promo/stationery/stationery-highlighter-coral.png";
import highlighterMint from "@/assets/app-promo/stationery/stationery-highlighter-mint.png";
import highlighterOrange from "@/assets/app-promo/stationery/stationery-highlighter-orange.png";
import highlighterPink from "@/assets/app-promo/stationery/stationery-highlighter-pink.png";
import highlighterYellow from "@/assets/app-promo/stationery/stationery-highlighter-yellow.png";
import penBlack from "@/assets/app-promo/stationery/stationery-pen-black.png";
import penNavy from "@/assets/app-promo/stationery/stationery-pen-navy.png";
import stickyBlue from "@/assets/app-promo/stationery/stationery-sticky-blue.png";
import stickyOrange from "@/assets/app-promo/stationery/stationery-sticky-orange.png";
import stickyPink from "@/assets/app-promo/stationery/stationery-sticky-pink.png";
import stickyYellow from "@/assets/app-promo/stationery/stationery-sticky-yellow.png";
import { cn } from "@/lib/cn";

type Props = {
  variant?: number;
  /** Tall empty column beside short copy (phone/visual side). */
  fillSide?: "left" | "right";
  className?: string;
};

type PieceSpec = {
  src: StaticImageData;
  width: number;
  className: string;
  /** Highlighters stay punchier than stickies. */
  vivid?: boolean;
};

const HIGHLIGHTERS = [
  highlighterPink,
  highlighterYellow,
  highlighterMint,
  highlighterOrange,
  highlighterCoral,
] as const;

function pickHighlighter(variant: number, offset: number) {
  return HIGHLIGHTERS[(variant + offset) % HIGHLIGHTERS.length];
}

function Piece({ spec }: { spec: PieceSpec }) {
  return (
    <Image
      src={spec.src}
      alt=""
      width={spec.width}
      sizes={`${spec.width}px`}
      loading="lazy"
      fetchPriority="low"
      className={cn(
        "pointer-events-none absolute h-auto select-none",
        spec.vivid
          ? "opacity-[0.95] drop-shadow-[0_16px_28px_rgba(24,26,46,0.22)]"
          : "opacity-[0.7] drop-shadow-[0_14px_24px_rgba(24,26,46,0.14)]",
        spec.className,
      )}
    />
  );
}

/** Dense fill for the tall empty column beside short copy (phone/visual side). */
function columnFill(side: "left" | "right", variant: number): PieceSpec[] {
  const shift = variant % 3;
  if (side === "left") {
    return [
      {
        src: [stickyYellow, stickyOrange, stickyPink][shift],
        width: 260,
        className: "top-[40%] left-[6%] rotate-[-12deg] max-nav:left-[3%] max-nav:w-28",
      },
      {
        src: [stickyBlue, stickyPink, stickyYellow][shift],
        width: 200,
        className: "top-[56%] left-[16%] rotate-[10deg] max-nav:hidden",
      },
      {
        src: [stickyOrange, stickyYellow, stickyBlue][shift],
        width: 180,
        className: "bottom-[6%] left-[8%] rotate-[-6deg] max-nav:w-24",
      },
      {
        src: pickHighlighter(variant, 0),
        width: 92,
        vivid: true,
        className: "top-[36%] left-[28%] rotate-[28deg] max-nav:hidden",
      },
      {
        src: pickHighlighter(variant, 2),
        width: 84,
        vivid: true,
        className: "top-[48%] left-[10%] rotate-[-22deg] max-nav:w-14",
      },
      {
        src: pickHighlighter(variant, 4),
        width: 78,
        vivid: true,
        className: "bottom-[20%] left-[30%] rotate-[16deg] max-nav:hidden",
      },
      {
        src: pickHighlighter(variant, 1),
        width: 70,
        vivid: true,
        className: "bottom-[10%] left-[18%] rotate-[-34deg] max-nav:hidden",
      },
      {
        src: penBlack,
        width: 80,
        className: "top-[64%] left-[22%] rotate-[-28deg] max-nav:w-11",
      },
      {
        src: clip,
        width: 110,
        className: "bottom-[2%] left-[32%] rotate-[16deg] max-nav:hidden",
      },
    ];
  }

  return [
    {
      src: [stickyPink, stickyYellow, stickyOrange][shift],
      width: 260,
      className: "top-[40%] right-[6%] rotate-[12deg] max-nav:right-[3%] max-nav:w-28",
    },
    {
      src: [stickyYellow, stickyBlue, stickyPink][shift],
      width: 200,
      className: "top-[56%] right-[16%] rotate-[-10deg] max-nav:hidden",
    },
    {
      src: [stickyBlue, stickyOrange, stickyYellow][shift],
      width: 180,
      className: "bottom-[6%] right-[8%] rotate-[6deg] max-nav:w-24",
    },
    {
      src: pickHighlighter(variant, 1),
      width: 92,
      vivid: true,
      className: "top-[36%] right-[28%] rotate-[-28deg] max-nav:hidden",
    },
    {
      src: pickHighlighter(variant, 3),
      width: 84,
      vivid: true,
      className: "top-[48%] right-[10%] rotate-[22deg] max-nav:w-14",
    },
    {
      src: pickHighlighter(variant, 5),
      width: 78,
      vivid: true,
      className: "bottom-[20%] right-[30%] rotate-[-16deg] max-nav:hidden",
    },
    {
      src: pickHighlighter(variant, 0),
      width: 70,
      vivid: true,
      className: "bottom-[10%] right-[18%] rotate-[34deg] max-nav:hidden",
    },
    {
      src: penNavy,
      width: 80,
      className: "top-[64%] right-[22%] rotate-[28deg] max-nav:w-11",
    },
    {
      src: clip,
      width: 110,
      className: "bottom-[2%] right-[32%] rotate-[-16deg] max-nav:hidden",
    },
  ];
}

const EDGE_LAYOUTS: PieceSpec[][] = [
  [
    { src: stickyYellow, width: 200, className: "top-2 left-[-1%] rotate-[-14deg] max-nav:w-24" },
    { src: stickyBlue, width: 140, className: "top-[18%] left-[2%] rotate-[8deg] max-nav:hidden" },
    {
      src: highlighterPink,
      width: 74,
      vivid: true,
      className: "top-[8%] left-[12%] rotate-[26deg] max-nav:hidden",
    },
    {
      src: highlighterYellow,
      width: 68,
      vivid: true,
      className: "top-[22%] left-[8%] rotate-[-18deg] max-nav:w-12",
    },
    { src: stickyPink, width: 210, className: "top-2 right-[-2%] rotate-[12deg] max-nav:w-24" },
    { src: stickyOrange, width: 150, className: "top-[20%] right-[3%] rotate-[-10deg] max-nav:hidden" },
    {
      src: highlighterMint,
      width: 72,
      vivid: true,
      className: "top-[10%] right-[14%] rotate-[-24deg] max-nav:hidden",
    },
    {
      src: highlighterOrange,
      width: 66,
      vivid: true,
      className: "top-[24%] right-[8%] rotate-[20deg] max-nav:w-12",
    },
    { src: penNavy, width: 64, className: "top-[14%] right-[40%] rotate-[18deg] max-nav:hidden" },
  ],
  [
    { src: stickyOrange, width: 210, className: "top-[-1%] left-[-2%] rotate-[10deg] max-nav:w-24" },
    { src: stickyPink, width: 140, className: "top-[16%] left-[3%] rotate-[-12deg] max-nav:hidden" },
    {
      src: highlighterCoral,
      width: 76,
      vivid: true,
      className: "top-[6%] left-[12%] rotate-[-28deg] max-nav:hidden",
    },
    {
      src: highlighterPink,
      width: 68,
      vivid: true,
      className: "top-[20%] left-[7%] rotate-[16deg] max-nav:w-12",
    },
    { src: stickyBlue, width: 200, className: "top-3 right-[-2%] rotate-[-8deg] max-nav:w-24" },
    { src: stickyYellow, width: 145, className: "top-[18%] right-[2%] rotate-[11deg] max-nav:hidden" },
    {
      src: highlighterYellow,
      width: 74,
      vivid: true,
      className: "top-[8%] right-[13%] rotate-[22deg] max-nav:hidden",
    },
    {
      src: highlighterPink,
      width: 64,
      vivid: true,
      className: "top-[22%] right-[7%] rotate-[-20deg] max-nav:w-12",
    },
    {
      src: highlighterMint,
      width: 58,
      vivid: true,
      className: "top-[5%] left-[28%] rotate-[36deg] max-nav:hidden",
    },
    { src: penBlack, width: 62, className: "top-[12%] left-[38%] rotate-[-22deg] max-nav:hidden" },
  ],
  [
    { src: stickyBlue, width: 190, className: "top-1 left-[-1%] rotate-[-8deg] max-nav:w-24" },
    { src: stickyOrange, width: 140, className: "top-[17%] left-[2%] rotate-[16deg] max-nav:hidden" },
    {
      src: highlighterOrange,
      width: 78,
      vivid: true,
      className: "top-[7%] left-[11%] rotate-[18deg] max-nav:hidden",
    },
    {
      src: highlighterMint,
      width: 70,
      vivid: true,
      className: "top-[21%] left-[6%] rotate-[-26deg] max-nav:w-12",
    },
    { src: stickyYellow, width: 220, className: "top-[-2%] right-[-2%] rotate-[9deg] max-nav:w-24" },
    { src: stickyPink, width: 140, className: "top-[19%] right-[1%] rotate-[-14deg] max-nav:hidden" },
    {
      src: highlighterPink,
      width: 76,
      vivid: true,
      className: "top-[9%] right-[12%] rotate-[-22deg] max-nav:hidden",
    },
    {
      src: highlighterCoral,
      width: 66,
      vivid: true,
      className: "top-[23%] right-[6%] rotate-[24deg] max-nav:w-12",
    },
    {
      src: highlighterYellow,
      width: 60,
      vivid: true,
      className: "top-[4%] right-[28%] rotate-[-34deg] max-nav:hidden",
    },
    { src: clip, width: 90, className: "top-[14%] right-[38%] rotate-[12deg] max-nav:hidden" },
  ],
];

/** Photorealistic desk stationery along edges + the tall empty visual column. */
export function StationeryScatter({
  variant = 0,
  fillSide = "left",
  className,
}: Props) {
  const edges = EDGE_LAYOUTS[variant % EDGE_LAYOUTS.length];
  const mid = columnFill(fillSide, variant);
  const pieces = [...edges, ...mid];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className,
      )}
    >
      {pieces.map((spec, index) => (
        <Piece key={`${spec.src.src}-${index}`} spec={spec} />
      ))}
    </div>
  );
}
