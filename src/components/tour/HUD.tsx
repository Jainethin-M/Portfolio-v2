"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Award,
  Briefcase,
  Compass,
  Cpu,
  FolderKanban,
  GraduationCap,
  Home,
  Mail,
  Menu,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Trophy,
  User,
  X,
  type LucideIcon,
  Accessibility,
} from "lucide-react";
import type { StationId } from "@/types/portfolio";
import { STATIONS } from "@/config/stations";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { releaseFocus } from "@/lib/camera/rigState";
import { shotIndexOf } from "@/lib/stationFocus";
import { tour } from "@/lib/tour/tourEngine";
import { useNexusStore } from "@/stores/nexusStore";

const ICONS: Record<StationId, LucideIcon> = {
  profile: User,
  education: GraduationCap,
  experience: Briefcase,
  skills: Cpu,
  projects: FolderKanban,
  certificates: Award,
  achievements: Trophy,
  contact: Mail,
};

const MODE_LABEL = {
  idle: "Ready",
  auto: "Auto tour",
  paused: "Paused",
  scroll: "Free exploration",
} as const;

/** Updates the progress bar straight from the GSAP ticker: no React renders per frame. */
function ProgressBar() {
  const fill = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let last = -1;
    const tick = () => {
      const p = tour.getProgress();
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
      const pct = Math.round(p * 100);
      if (bar.current && pct !== last) {
        bar.current.setAttribute("aria-valuenow", String(pct));
        last = pct;
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return (
    <div
      ref={bar}
      role="progressbar"
      aria-label="Tour progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="h-1 w-full overflow-hidden rounded-full bg-white/10"
    >
      <div ref={fill} className="h-full origin-left bg-gradient-to-r from-nexus-cyan to-nexus-violet" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

function useKeyboardShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      const { mode, phase } = useNexusStore.getState();
      if (phase !== "live") return;

      if (e.key === "Escape") {
        useNexusStore.getState().clearSelection();
        releaseFocus();
      } else if (e.key === " " && !target?.closest("button, a, summary") && (mode === "auto" || mode === "paused")) {
        e.preventDefault();
        tour.togglePause();
      } else if (e.key === "ArrowRight" && mode !== "scroll") {
        tour.next();
      } else if (e.key === "ArrowLeft" && mode !== "scroll") {
        tour.prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

export function HUD() {
  const phase = useNexusStore((s) => s.phase);
  const mode = useNexusStore((s) => s.mode);
  const shot = useNexusStore((s) => s.activeShot);
  const setView = useNexusStore((s) => s.setView);
  const [menuOpen, setMenuOpen] = useState(false);
  useKeyboardShortcuts();

  if (phase !== "live") return null;

  const stationLabel = shot === 0 ? "Command Hub" : shot === 9 ? "Command Hub · Finale" : STATIONS[shot - 1].label;
  const playing = mode === "auto";
  const paused = mode === "paused";

  const goTo = (index: number) => {
    tour.goTo(index);
    setMenuOpen(false);
  };

  const toggleAuto = () => {
    if (playing) tour.pause();
    else if (paused) tour.resume();
    else tour.startAuto();
  };

  const AutoIcon = playing ? Pause : Play;
  const autoLabel = playing ? "Pause" : paused ? "Resume" : mode === "scroll" ? "Auto Tour" : "Start Tour";

  const switchToClassic = () => {
    try {
      localStorage.setItem("nexus:view", "classic");
    } catch {
      /* storage unavailable */
    }
    setView("classic");
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 md:p-5">
        <div className="glass pointer-events-auto flex items-center gap-3 px-4 py-2">
          <span className="font-display text-lg font-bold tracking-[0.3em] text-nexus-cyan" aria-label="NEXUS">
            NEXUS
          </span>
          <span className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />
          <p className="text-xs leading-tight" aria-live="polite">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-nexus-muted">Current station</span>
            <span className="block font-semibold text-nexus-text">{stationLabel}</span>
          </p>
        </div>

        <nav aria-label="Tour controls" className="glass pointer-events-auto hidden items-center gap-1.5 p-1.5 md:flex">
          <button type="button" className="btn btn-primary !px-3 !py-2" onClick={toggleAuto}>
            <AutoIcon size={14} aria-hidden="true" />
            {autoLabel}
          </button>
          <button type="button" className="btn !px-3 !py-2" aria-pressed={mode === "scroll"} onClick={() => tour.startScroll()}>
            <Compass size={14} aria-hidden="true" />
            Explore Freely
          </button>
          <ResumeButton className="!px-3 !py-2" />
          <button type="button" className="btn !px-3 !py-2" onClick={() => goTo(shotIndexOf("contact"))}>
            <Mail size={14} aria-hidden="true" />
            Contact
          </button>
          <button type="button" className="btn-icon" onClick={switchToClassic} aria-label="Switch to accessible text view" title="Accessible text view">
            <Accessibility size={16} aria-hidden="true" />
          </button>
        </nav>

        <button
          type="button"
          className="btn-icon glass pointer-events-auto md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </header>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Stations and actions"
          className="glass fixed inset-x-3 top-16 z-40 max-h-[70vh] space-y-3 overflow-y-auto p-4 md:hidden"
        >
          <ul className="grid grid-cols-2 gap-2">
            <li>
              <button type="button" className="btn w-full !px-3" onClick={() => goTo(0)}>
                <Home size={14} aria-hidden="true" /> Hub
              </button>
            </li>
            {STATIONS.map((s, i) => {
              const Icon = ICONS[s.id];
              return (
                <li key={s.id}>
                  <button type="button" className="btn w-full !px-3" aria-current={shot === i + 1 ? "step" : undefined} onClick={() => goTo(i + 1)}>
                    <Icon size={14} aria-hidden="true" /> {s.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={() => { toggleAuto(); setMenuOpen(false); }}>
              <AutoIcon size={14} aria-hidden="true" />
              {autoLabel}
            </button>
            <button type="button" className="btn" onClick={() => { tour.startScroll(); setMenuOpen(false); }}>
              <Compass size={14} aria-hidden="true" />
              Explore Freely
            </button>
            <ResumeButton />
            <button type="button" className="btn" onClick={switchToClassic}>
              <Accessibility size={14} aria-hidden="true" />
              Text view
            </button>
          </div>
        </nav>
      )}

      <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-30 p-3 md:p-5">
        <div className="glass pointer-events-auto mx-auto max-w-3xl space-y-2 p-3">
          <ProgressBar />
          <div className="flex items-center justify-between gap-2">
            <nav aria-label="Stations" className="hidden flex-1 items-center gap-1 md:flex">
              <button
                type="button"
                className="btn-icon"
                aria-label="Command hub"
                title="Command hub"
                aria-current={shot === 0 ? "step" : undefined}
                onClick={() => goTo(0)}
              >
                <Home size={16} aria-hidden="true" />
              </button>
              {STATIONS.map((s, i) => {
                const Icon = ICONS[s.id];
                const active = shot === i + 1;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`btn-icon ${active ? "!border-nexus-cyan !bg-nexus-cyan/20" : ""}`}
                    aria-label={s.label}
                    title={`${s.label} — ${s.codename}`}
                    aria-current={active ? "step" : undefined}
                    onClick={() => goTo(i + 1)}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </button>
                );
              })}
            </nav>
            <p className="font-mono text-[11px] uppercase tracking-widest text-nexus-muted md:hidden" aria-live="polite">
              {MODE_LABEL[mode]}
            </p>
            <div className="flex items-center gap-1.5" role="group" aria-label="Playback">
              <span className="mr-2 hidden font-mono text-[11px] uppercase tracking-widest text-nexus-muted md:inline" aria-live="polite">
                {MODE_LABEL[mode]}
              </span>
              <button type="button" className="btn-icon" aria-label="Previous station" onClick={() => tour.prev()} disabled={shot === 0}>
                <SkipBack size={16} aria-hidden="true" />
              </button>
              <button type="button" className="btn-icon" aria-label={autoLabel} onClick={toggleAuto}>
                <AutoIcon size={16} aria-hidden="true" />
              </button>
              <button type="button" className="btn-icon" aria-label="Next station" onClick={() => tour.next()} disabled={shot === 9}>
                <SkipForward size={16} aria-hidden="true" />
              </button>
              <button type="button" className="btn-icon" aria-label="Replay tour" onClick={() => tour.replay()}>
                <RotateCcw size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
