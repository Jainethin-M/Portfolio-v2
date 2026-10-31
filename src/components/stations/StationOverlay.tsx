"use client";

import type { ComponentType } from "react";
import type { StationId } from "@/types/portfolio";
import { STATIONS } from "@/config/stations";
import { tour } from "@/lib/tour/tourEngine";
import { useNexusStore } from "@/stores/nexusStore";
import { AchievementsPanel } from "./AchievementsPanel";
import { CertificatesPanel } from "./CertificatesPanel";
import { ContactPanel } from "./ContactPanel";
import { EducationPanel } from "./EducationPanel";
import { ExperiencePanel } from "./ExperiencePanel";
import { ProfilePanel } from "./ProfilePanel";
import { ProjectsPanel } from "./ProjectsPanel";
import { SkillsPanel } from "./SkillsPanel";

const PANELS: Record<StationId, ComponentType> = {
  profile: ProfilePanel,
  education: EducationPanel,
  experience: ExperiencePanel,
  skills: SkillsPanel,
  projects: ProjectsPanel,
  certificates: CertificatesPanel,
  achievements: AchievementsPanel,
  contact: ContactPanel,
};

/** Accessible HTML content for the station the camera is resting at. */
export function StationOverlay() {
  const shot = useNexusStore((s) => s.activeShot);
  const docked = useNexusStore((s) => s.docked);
  const phase = useNexusStore((s) => s.phase);

  const station = shot >= 1 && shot <= STATIONS.length ? STATIONS[shot - 1].id : null;
  if (!station || !docked || phase !== "live") return null;
  const Panel = PANELS[station];

  return (
    <div
      className="pointer-events-none fixed z-20 flex flex-col justify-center max-lg:inset-x-3 max-lg:bottom-[7.75rem] lg:bottom-28 lg:right-5 lg:top-20 lg:w-[min(30rem,38vw)]"
      // Interacting with the content pauses an auto tour so it never moves away mid-read.
      onPointerDownCapture={() => tour.interact()}
      onFocusCapture={() => tour.interact()}
    >
      <Panel key={station} />
    </div>
  );
}
