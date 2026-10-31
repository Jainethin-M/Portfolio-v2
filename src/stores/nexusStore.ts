import { create } from "zustand";
import type { SkillCategory } from "@/types/portfolio";
import type { QualityTier } from "@/lib/quality";

export type TourMode = "idle" | "auto" | "scroll" | "paused";
export type BootPhase = "boot" | "intro" | "live";
export type SelectionKey =
  | "profile"
  | "education"
  | "experience"
  | "skill"
  | "project"
  | "certificate"
  | "achievement"
  | "contact";

export type Selection = Partial<Record<SelectionKey, string>>;

interface NexusState {
  phase: BootPhase;
  mode: TourMode;
  /** Index into the camera shot list (0 = hub, 1-8 = stations, 9 = final hub). */
  activeShot: number;
  /** True while the camera is resting at the active shot (content overlay visible). */
  docked: boolean;
  selection: Selection;
  skillCategory: SkillCategory | "All";
  projectTech: string;
  projectCategory: string;
  quality: QualityTier;
  reducedMotion: boolean;
  webgl: "unknown" | "yes" | "no";
  view: "3d" | "classic";
  sceneReady: boolean;

  setPhase: (p: BootPhase) => void;
  setMode: (m: TourMode) => void;
  setActive: (shot: number, docked: boolean) => void;
  select: (key: SelectionKey, id: string | null) => void;
  clearSelection: () => void;
  setSkillCategory: (c: SkillCategory | "All") => void;
  setProjectTech: (t: string) => void;
  setProjectCategory: (c: string) => void;
  setQuality: (q: QualityTier) => void;
  setReducedMotion: (v: boolean) => void;
  setWebgl: (v: "yes" | "no") => void;
  setView: (v: "3d" | "classic") => void;
  setSceneReady: (v: boolean) => void;
}

export const useNexusStore = create<NexusState>((set, get) => ({
  phase: "boot",
  mode: "idle",
  activeShot: 0,
  docked: false,
  selection: {},
  skillCategory: "All",
  projectTech: "All",
  projectCategory: "All",
  quality: "medium",
  reducedMotion: false,
  webgl: "unknown",
  view: "3d",
  sceneReady: false,

  setPhase: (phase) => set({ phase }),
  setMode: (mode) => set({ mode }),
  setActive: (activeShot, docked) => {
    const s = get();
    if (s.activeShot === activeShot && s.docked === docked) return;
    set({ activeShot, docked });
  },
  select: (key, id) =>
    set((s) => {
      const next = { ...s.selection };
      if (id === null) delete next[key];
      else next[key] = id;
      return { selection: next };
    }),
  clearSelection: () => {
    if (Object.keys(get().selection).length === 0) return;
    set({ selection: {} });
  },
  setSkillCategory: (skillCategory) => set({ skillCategory }),
  setProjectTech: (projectTech) => set({ projectTech }),
  setProjectCategory: (projectCategory) => set({ projectCategory }),
  setQuality: (quality) => set({ quality }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setWebgl: (webgl) => set({ webgl }),
  setView: (view) => set({ view }),
  setSceneReady: (sceneReady) => set({ sceneReady }),
}));
