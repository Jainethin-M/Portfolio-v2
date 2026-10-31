"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { INTRO } from "@/config/cameraPaths";
import { playIntro, skipIntro } from "@/lib/camera/rigState";
import { useNexusStore } from "@/stores/nexusStore";

/**
 * Initialisation screen + boot sequencing.
 * Progress is real: half from asset loading (three's loading manager),
 * half from the scene finishing shader compilation and first frames.
 * `enabled` is false until WebGL support has been confirmed.
 */
export function Boot({ enabled }: { enabled: boolean }) {
  const phase = useNexusStore((s) => s.phase);
  const sceneReady = useNexusStore((s) => s.sceneReady);
  const reduced = useNexusStore((s) => s.reducedMotion);
  const { progress, active, total } = useProgress();
  const [skipRequested, setSkipRequested] = useState(false);
  const [gone, setGone] = useState(false);
  const started = useRef(false);
  const timers = useRef<number[]>([]);

  const begin = useCallback((instant: boolean) => {
    if (started.current) return;
    started.current = true;
    useNexusStore.getState().setPhase("intro");
    playIntro(instant);
    const ms = instant ? 350 : (INTRO.duration + 0.9) * 1000;
    timers.current.push(window.setTimeout(() => useNexusStore.getState().setPhase("live"), ms));
  }, []);

  useEffect(() => {
    if (enabled && phase === "boot" && sceneReady && !active) begin(reduced || skipRequested);
  }, [enabled, phase, sceneReady, active, reduced, skipRequested, begin]);

  // Never leave a visitor stuck on the loader.
  useEffect(() => {
    if (!enabled) return;
    const t = window.setTimeout(() => {
      if (useNexusStore.getState().phase === "boot") begin(true);
    }, 20000);
    return () => window.clearTimeout(t);
  }, [enabled, begin]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (phase === "boot") return;
    const t = window.setTimeout(() => setGone(true), 900);
    return () => window.clearTimeout(t);
  }, [phase]);

  const skip = () => {
    if (phase === "boot") {
      setSkipRequested(true);
      return;
    }
    timers.current.forEach((t) => window.clearTimeout(t));
    skipIntro();
    useNexusStore.getState().setPhase("live");
  };

  const assets = total > 0 ? progress : sceneReady ? 100 : 0;
  const value = Math.round(assets * 0.5 + (sceneReady ? 50 : 0));
  const status = !enabled
    ? "Detecting graphics capabilities…"
    : !sceneReady
      ? "Building the command center…"
      : active
        ? "Loading textures…"
        : "Systems online";

  return (
    <>
      {!gone && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-nexus-bg px-6 text-center transition-opacity duration-700 ${
            phase === "boot" ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <p className="font-display text-4xl font-bold tracking-[0.45em] text-nexus-cyan sm:text-5xl">NEXUS</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-nexus-muted">Interactive Command Center</p>

          <div className="mt-10 w-full max-w-xs">
            <div
              role="progressbar"
              aria-label="Loading"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={value}
              className="h-1 w-full overflow-hidden rounded-full bg-white/10"
            >
              <div
                className="h-full bg-gradient-to-r from-nexus-cyan to-nexus-violet transition-[width] duration-300"
                style={{ width: `${value}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[11px] uppercase tracking-widest text-nexus-muted">
              <span>{status}</span>
              <span>{value}%</span>
            </div>
          </div>

          {enabled && (
            <button type="button" className="btn mt-10" onClick={skip} disabled={skipRequested}>
              {skipRequested ? "Skipping intro…" : "Skip intro"}
            </button>
          )}
          <noscript>
            <p className="mt-6 text-sm text-nexus-muted">JavaScript is required for the 3D experience.</p>
          </noscript>
        </div>
      )}
      {phase === "intro" && (
        <button type="button" className="btn fixed bottom-6 right-6 z-40" onClick={skip}>
          Skip intro
        </button>
      )}
    </>
  );
}
