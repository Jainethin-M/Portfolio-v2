"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { QUALITY } from "@/lib/quality";
import { useNexusStore } from "@/stores/nexusStore";
import { Scene } from "./Scene";

export default function WorldCanvas() {
  const tier = useNexusStore((s) => s.quality);
  const setQuality = useNexusStore((s) => s.setQuality);
  const setWebgl = useNexusStore((s) => s.setWebgl);
  const q = QUALITY[tier];
  const [dpr, setDpr] = useState(q.maxDpr);

  return (
    <Canvas
      className="nexus-canvas"
      aria-label="Interactive 3D command center. All content is also available as regular text."
      role="img"
      dpr={Math.min(dpr, q.maxDpr)}
      flat
      gl={{ antialias: q.antialias, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 55, near: 0.1, far: 300, position: [0, 3.6, 17] }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          setWebgl("no");
        });
      }}
    >
      <PerformanceMonitor
        flipflops={3}
        onChange={({ factor }) => setDpr(Math.max(1, Math.round((0.6 + 0.4 * factor) * q.maxDpr * 10) / 10))}
        onFallback={() => setQuality(tier === "high" ? "medium" : "low")}
      />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
