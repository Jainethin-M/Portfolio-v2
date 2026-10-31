export const SITE = {
  /** Set NEXT_PUBLIC_SITE_URL in production (see .env.example). */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  name: "NEXUS — Interactive Command Center",
  shortName: "NEXUS",
  locale: "en_US",
} as const;
