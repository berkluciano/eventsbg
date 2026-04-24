import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
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

function dateFnsLocale(locale?: Locale) {
  return locale === "bg" ? bg : undefined;
}

export function formatDate(date: Date | string, locale?: Locale): string {
  return format(new Date(date), "EEE, d MMM yyyy", { locale: dateFnsLocale(locale) });
}

export function formatDateTime(date: Date | string, locale?: Locale): string {
  const pattern = locale === "bg" ? "EEE, d MMM yyyy 'в' HH:mm" : "EEE, d MMM yyyy 'at' HH:mm";
  return format(new Date(date), pattern, { locale: dateFnsLocale(locale) });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
