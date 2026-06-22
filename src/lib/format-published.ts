const weekdayFormatter = new Intl.DateTimeFormat("ko-KR", { weekday: "long" });
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function parsePublishedAt(iso?: string | null) {
  if (!iso) {
    return null;
  }

  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 예: 일요일 */
export function formatPublishedWeekday(iso?: string | null) {
  const date = parsePublishedAt(iso);
  return date ? weekdayFormatter.format(date) : null;
}

/** 예: 일요일 · 2026년 6월 20일 */
export function formatPublishedLabel(iso?: string | null) {
  const date = parsePublishedAt(iso);
  if (!date) {
    return null;
  }

  return `${weekdayFormatter.format(date)} · ${dateFormatter.format(date)}`;
}
