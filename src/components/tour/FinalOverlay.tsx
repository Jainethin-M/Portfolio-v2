"use client";

import { Mail, RotateCcw, Home } from "lucide-react";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { shotIndexOf } from "@/lib/stationFocus";
import { tour } from "@/lib/tour/tourEngine";
import { useNexusStore } from "@/stores/nexusStore";

/** Closing call to action once the tour returns to the central hub. */
export function FinalOverlay() {
  const shot = useNexusStore((s) => s.activeShot);
  const docked = useNexusStore((s) => s.docked);
  const phase = useNexusStore((s) => s.phase);
  if (phase !== "live" || shot !== 9 || !docked) return null;

  return (
    <section
      aria-labelledby="final-title"
      className="glass pointer-events-auto fixed inset-x-4 bottom-32 z-20 mx-auto max-w-2xl p-6 text-center animate-fade-up max-lg:bottom-[8rem]"
    >
      <p className="eyebrow">Tour complete</p>
      <h2 id="final-title" className="mt-2 text-2xl font-semibold md:text-3xl">
        Let&apos;s build something together.
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-nexus-muted">
        You have visited every station. Get in touch, replay the journey or keep exploring on your own.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button type="button" className="btn btn-primary" onClick={() => tour.goTo(shotIndexOf("contact"))}>
          <Mail size={14} aria-hidden="true" />
          Contact me
        </button>
        <button type="button" className="btn" onClick={() => tour.replay()}>
          <RotateCcw size={14} aria-hidden="true" />
          Replay tour
        </button>
        <button type="button" className="btn" onClick={() => tour.reset()}>
          <Home size={14} aria-hidden="true" />
          Back to start
        </button>
        <ResumeButton />
      </div>
    </section>
  );
}
