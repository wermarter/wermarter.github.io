import type { CalendarPeriod, Month } from "../data/personal";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export const formatMonth = (month: Month) => monthNames[month - 1];

export const toYearMonth = (month: Month, year: number) => `${year}-${String(month).padStart(2, "0")}`;

export const formatMonthYear = (month: Month, year: number) => `${formatMonth(month)} ${year}`;

export const formatPeriod = ({ startMonth, startYear, endMonth, endYear }: CalendarPeriod) => {
  const start = formatMonthYear(startMonth, startYear);
  const end = endMonth && endYear ? formatMonthYear(endMonth, endYear) : "Present";
  return `${start} — ${end}`;
};

export const getDuration = ({ startMonth, startYear, endMonth, endYear }: CalendarPeriod) => {
  const today = new Date();
  const resolvedEndMonth = endMonth ?? (today.getMonth() + 1);
  const resolvedEndYear = endYear ?? today.getFullYear();
  const months = Math.max(1, (resolvedEndYear - startYear) * 12 + resolvedEndMonth - startMonth + 1);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const parts: string[] = [];

  if (years) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  if (remainingMonths) parts.push(`${remainingMonths} ${remainingMonths === 1 ? "mo" : "mos"}`);

  return parts.join(" ");
};
