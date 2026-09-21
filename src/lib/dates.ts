// Date helpers for the search bar. The URL and form state hold dates as
// "YYYY-MM-DD" strings; the calendar works with Date objects. Everything here
// uses the visitor's local calendar day, never UTC, so a date can't slip by one
// day depending on timezone.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (value: number): string => String(value).padStart(2, "0");

export const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const fromIsoDate = (iso: string): Date | undefined => {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? undefined : date;
};

// "2026-09-24" → "24 Sep 2026" (unambiguous, unlike 09/24 vs 24/09).
export const formatIsoDate = (iso: string): string | null => {
  const date = fromIsoDate(iso);
  return date ? `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}` : null;
};

export const startOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
