import type { StationId } from "@/types/portfolio";

export interface StationDef {
  id: StationId;
  label: string;
  codename: string;
  blurb: string;
  /** Angle in degrees around the hub. 0 = straight ahead (-Z), increasing clockwise (+X is 90). */
  angle: number;
  accent: "cyan" | "violet";
}

/** Order here is the tour order. */
export const STATIONS: readonly StationDef[] = [
  { id: "profile", label: "Profile", codename: "Identity Terminal", blurb: "Who I am and what drives me.", angle: 90, accent: "cyan" },
  { id: "education", label: "Education", codename: "Academic Archive", blurb: "Learning milestones and credentials.", angle: 135, accent: "violet" },
  { id: "experience", label: "Experience", codename: "Career Operations", blurb: "Missions across my professional career.", angle: 180, accent: "cyan" },
  { id: "skills", label: "Skills", codename: "Technology Reactor", blurb: "The tools and technologies I work with.", angle: 225, accent: "violet" },
  { id: "projects", label: "Projects", codename: "Mission Control", blurb: "Selected builds and case studies.", angle: 270, accent: "cyan" },
  { id: "certificates", label: "Certificates", codename: "Credential Vault", blurb: "Verified certifications.", angle: 315, accent: "violet" },
  { id: "achievements", label: "Achievements", codename: "Hall of Recognition", blurb: "Awards and milestones.", angle: 0, accent: "cyan" },
  { id: "contact", label: "Contact", codename: "Communication Terminal", blurb: "Start a conversation.", angle: 45, accent: "violet" },
] as const;

export const STATION_BY_ID: Record<StationId, StationDef> = Object.fromEntries(
  STATIONS.map((s) => [s.id, s]),
) as Record<StationId, StationDef>;
