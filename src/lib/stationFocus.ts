import type { StationId } from "@/types/portfolio";
import { STATIONS } from "@/config/stations";
import { achievements } from "@/data/achievements";
import { certificates } from "@/data/certificates";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import {
  ACH_LINE,
  EDU_LINE,
  EXP_LINE,
  certificatePlacements,
  itemFocus,
  lineLayout,
  projectPlacements,
} from "@/lib/stationLayouts";
import type { LocalFocus } from "@/lib/interaction";

/** Camera shot index (1-based) of a station in the tour. 0 is the hub. */
export const shotIndexOf = (id: StationId) => STATIONS.findIndex((s) => s.id === id) + 1;

export const educationFocus = (i: number): LocalFocus =>
  itemFocus(lineLayout(education.length, EDU_LINE.spacing, EDU_LINE.y, EDU_LINE.wave)[i]);

export const experienceFocus = (i: number): LocalFocus =>
  itemFocus(lineLayout(experience.length, EXP_LINE.spacing, EXP_LINE.y, EXP_LINE.wave)[i], [0, 0, 1], 5.4);

export const projectFocus = (i: number): LocalFocus => {
  const p = projectPlacements(projects.length)[i];
  return itemFocus(p.position, p.normal, 5.2);
};

export const certificateFocus = (i: number): LocalFocus => {
  const p = certificatePlacements(certificates.length)[i];
  return itemFocus(p.position, p.normal, 4.6);
};

export const achievementFocus = (i: number): LocalFocus =>
  itemFocus(lineLayout(achievements.length, ACH_LINE.spacing, ACH_LINE.y, ACH_LINE.wave)[i], [0, 0, 1], 4.4);
