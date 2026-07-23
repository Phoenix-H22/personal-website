const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Converts YYYY-MM to "Mar 2025" format.
 */
export function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = MONTH_NAMES[monthIndex] ?? month;
  return `${monthName} ${year}`;
}

/**
 * Formats a date range like "Mar 2024 – May 2025" or "Mar 2025 – Present".
 */
export function formatDateRange(
  startDate: string,
  endDate: string | null,
  isCurrent = false,
): string {
  const start = formatDate(startDate);
  const end = isCurrent || !endDate ? "Present" : formatDate(endDate);
  return `${start} – ${end}`;
}

/**
 * Extracts just the year from YYYY-MM format.
 */
export function formatYear(dateStr: string): string {
  return dateStr.split("-")[0];
}

/**
 * Formats a period string like "2024 – Present" from start/end dates.
 */
export function formatPeriod(
  startDate: string,
  endDate: string | null,
): string {
  const startYear = formatYear(startDate);
  const endYear = endDate ? formatYear(endDate) : "Present";
  return startYear === endYear ? startYear : `${startYear} – ${endYear}`;
}
