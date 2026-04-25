import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/lib/translations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

const TZ = "Europe/Sofia";

/** Full date + time in Sofia timezone, e.g. "Сря, 12 юни 2024 в 20:00" */
export function formatDateTime(date: Date | string, locale?: Locale): string {
  const d = new Date(date);
  const lang = locale === "bg" ? "bg-BG" : "en-GB";
  const datePart = new Intl.DateTimeFormat(lang, {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
  const timePart = new Intl.DateTimeFormat(lang, {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  const sep = locale === "bg" ? " в " : " at ";
  return `${datePart}${sep}${timePart}`;
}

/** Date only in Sofia timezone, e.g. "Сря, 12 юни 2024" */
export function formatDate(date: Date | string, locale?: Locale): string {
  const d = new Date(date);
  const lang = locale === "bg" ? "bg-BG" : "en-GB";
  return new Intl.DateTimeFormat(lang, {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Converts a UTC Date to a "YYYY-MM-DDTHH:MM" string in Sofia local time,
 * suitable as the value/defaultValue of a <input type="datetime-local">.
 */
export function toSofiaDatetimeLocal(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  // Get the date/time parts in Sofia timezone
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/**
 * Parses a "YYYY-MM-DDTHH:MM" string entered in Sofia local time
 * and returns the equivalent UTC Date. Use this in server actions
 * instead of plain new Date(str).
 */
export function fromSofiaDatetimeLocal(str: string): Date {
  // Append Sofia offset so the browser/Node treats it as Sofia time
  // We calculate the offset dynamically so it works for both EET (+02:00) and EEST (+03:00)
  const naive = new Date(str); // treated as UTC by Node when no offset
  // Re-interpret as Sofia time: find offset at that moment
  const sofiaOffset = getSofiaOffsetMs(naive);
  return new Date(naive.getTime() - sofiaOffset);
}

/** Returns Sofia's UTC offset in milliseconds at a given UTC moment */
function getSofiaOffsetMs(utcDate: Date): number {
  // Format the date in Sofia TZ and in UTC, diff to get offset
  const utcStr = utcDate.toLocaleString("en-GB", { timeZone: "UTC" });
  const sofiaStr = utcDate.toLocaleString("en-GB", { timeZone: TZ });
  return new Date(sofiaStr).getTime() - new Date(utcStr).getTime();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
