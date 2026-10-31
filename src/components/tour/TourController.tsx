"use client";

import { useEffect, useRef } from "react";
import { SCROLL_VH, tour } from "@/lib/tour/tourEngine";
import { useNexusStore } from "@/stores/nexusStore";

/**
 * Owns the master timeline lifecycle and renders the scroll spacer that
 * ScrollTrigger measures. Scrolling only has an effect in "scroll" mode.
 */
export function TourController() {
  const spacer = useRef<HTMLDivElement>(null);
  const reduced = useNexusStore((s) => s.reducedMotion);

  useEffect(() => {
    if (!spacer.current) return;
    tour.init(spacer.current, reduced);
    return () => tour.destroy();
  }, [reduced]);

  return <div ref={spacer} aria-hidden="true" className="pointer-events-none relative" style={{ height: `${SCROLL_VH(reduced)}vh` }} />;
}
