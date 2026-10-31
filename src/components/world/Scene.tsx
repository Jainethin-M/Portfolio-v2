"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { COLORS } from "@/config/theme";
import { WORLD } from "@/config/cameraPaths";
import { QUALITY } from "@/lib/quality";
import { useNexusStore } from "@/stores/nexusStore";
import { CameraRig } from "./CameraRig";
import { Floor, Lighting } from "./Environment";
import { Hub } from "./Hub";
import { ParticleField } from "./ParticleField";
import { StationsLayer } from "@/components/stations/StationsLayer";

/** Marks the scene ready once shaders are compiled and a few frames have rendered. */
function SceneReadyProbe() {
  const { gl, scene, camera } = useThree();
  const frames = useRef(0);
  const compiled = useRef(false);

  useEffect(() => {
    let cancelled = false;
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) compiled.current = true;
      });
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera]);

  useFrame(() => {
    if (!compiled.current) return;
    frames.current += 1;
    if (frames.current === 3) useNexusStore.getState().setSceneReady(true);
  });
  return null;
}

export function Scene() {
  const tier = useNexusStore((s) => s.quality);
  const q = QUALITY[tier];

  return (
    <>
      <color attach="background" args={[COLORS.bg]} />
      <fog attach="fog" args={[COLORS.bg, WORLD.fogNear, WORLD.fogFar]} />
      <Lighting />
      <CameraRig />
      <Floor />
      <Hub />
      <StationsLayer />
      <ParticleField count={q.particles} />
      {q.bloom && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.4} luminanceSmoothing={0.25} mipmapBlur radius={0.65} />
        </EffectComposer>
      )}
      <SceneReadyProbe />
    </>
  );
}
