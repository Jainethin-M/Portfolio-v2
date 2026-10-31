"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { FinalOverlay } from "@/components/tour/FinalOverlay";
import { Boot } from "@/components/tour/Boot";
import { HUD } from "@/components/tour/HUD";
import { LandingOverlay } from "@/components/tour/LandingOverlay";
import { TourController } from "@/components/tour/TourController";
import { StationOverlay } from "@/components/stations/StationOverlay";
import { releaseFocus, rigState } from "@/lib/camera/rigState";
import { useNexusStore } from "@/stores/nexusStore";

const WorldCanvas = dynamic(() => import("@/components/world/WorldCanvas"), { ssr: false });

/** Everything that only exists in the 3D experience. Unmounting resets all tour state. */
export function Immersive() {
  useEffect(() => {
    document.documentElement.classList.add("nexus-home");
    return () => {
      document.documentElement.classList.remove("nexus-home");
      const s = useNexusStore.getState();
      s.setPhase("boot");
      s.setSceneReady(false);
      s.setMode("idle");
      s.setActive(0, false);
      s.clearSelection();
      releaseFocus(0.01);
      rigState.intro = 1;
      rigState.focusWeight = 0;
    };
  }, []);

  return (
    <>
      <WorldCanvas />
      <TourController />
      <main id="nexus-content" tabIndex={-1} className="outline-none">
        <LandingOverlay />
        <StationOverlay />
        <FinalOverlay />
      </main>
      <HUD />
      <Boot enabled />
    </>
  );
}
