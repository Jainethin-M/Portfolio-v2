"use client";

import { ArrowDown, Compass, Play } from "lucide-react";
import { profile } from "@/data/profile";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { tour } from "@/lib/tour/tourEngine";
import { useNexusStore } from "@/stores/nexusStore";

/** HTML landing content shown while the camera rests at the hub. */
export function LandingOverlay() {
  const shot = useNexusStore((s) => s.activeShot);
  const docked = useNexusStore((s) => s.docked);
  const phase = useNexusStore((s) => s.phase);
  const mode = useNexusStore((s) => s.mode);

  if (phase === "boot" || shot !== 0 || !docked) return null;
  const live = phase === "live";

  return (
    <section
      aria-label="Introduction"
      className="pointer-events-none fixed z-20 max-lg:inset-x-0 max-lg:top-16 max-lg:px-5 lg:left-14 lg:top-1/2 lg:max-w-xl lg:-translate-y-1/2"
    >
      <p className="eyebrow reveal-1">NEXUS · Interactive Command Center</p>
      <h1 className="reveal-2 mt-3 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{profile.name}</h1>
      <p className="reveal-3 mt-2 text-lg text-nexus-cyan sm:text-xl">{profile.title}</p>
      <p className="reveal-3 mt-4 max-w-md text-sm leading-relaxed text-nexus-muted sm:text-base">{profile.shortIntro}</p>

      <div className="reveal-4 pointer-events-auto mt-6 flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={() => tour.startAuto()} disabled={!live}>
          <Play size={14} aria-hidden="true" />
          Start Tour
        </button>
        <button type="button" className="btn" onClick={() => tour.startScroll()} disabled={!live}>
          <Compass size={14} aria-hidden="true" />
          Explore Freely
        </button>
        <ResumeButton />
      </div>

      {live && mode === "scroll" && (
        <p className="mt-5 flex items-center gap-2 font-mono text-xs text-nexus-muted" aria-live="polite">
          <ArrowDown size={14} aria-hidden="true" />
          Scroll to travel through the command center
        </p>
      )}
      <p className="reveal-4 mt-5 hidden max-w-sm font-mono text-[11px] uppercase tracking-widest text-nexus-muted/80 lg:block">
        {profile.tagline}
      </p>
    </section>
  );
}
