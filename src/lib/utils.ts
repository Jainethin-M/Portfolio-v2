import clsx, { type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** "2024-02" -> "Feb 2024". Anything else is returned unchanged. */
export function formatMonth(value: string): string {
  if (!/^\d{4}-\d{2}$/.test(value)) return value;
  const [y, m] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-");
