// Japanese fiscal year (April to March), identified by its starting year.
// e.g. 2026-11-08 -> 2026; 2027-03-31 -> 2026; 2027-04-01 -> 2027.
// Evaluated in Japan time so the April rollover is not off by a timezone.
export function currentFiscalYear(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
  }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")!.value);
  const month = Number(parts.find((p) => p.type === "month")!.value);
  return month >= 4 ? year : year - 1;
}
