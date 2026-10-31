"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { InstancedMesh, Mesh, Object3D } from "three";
import type { StationId } from "@/types/portfolio";
import { STATIONS, STATION_BY_ID } from "@/config/stations";
import { stationTransform } from "@/config/cameraPaths";
import { accentMaterial, accentSoft, geo, materials } from "@/lib/materials";
import { useNexusStore } from "@/stores/nexusStore";

interface DataBarsProps {
  position?: [number, number, number];
  count?: number;
  accent?: "cyan" | "violet";
  height?: number;
  spacing?: number;
}

/** Animated equaliser-style bars (one instanced draw call). */
export function DataBars({ position = [0, 0, 0], count = 10, accent = "cyan", height = 2.2, spacing = 0.17 }: DataBarsProps) {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const phases = useMemo(() => Array.from({ length: count }, (_, i) => i * 0.83 + (i % 3) * 0.4), [count]);
  const reduced = useNexusStore((s) => s.reducedMotion);
  const lastRef = useRef(-1);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    if (reduced && lastRef.current >= 0) return;
    const t = reduced ? 0 : clock.elapsedTime;
    lastRef.current = t;
    for (let i = 0; i < count; i++) {
      const h = 0.2 + (0.5 + 0.5 * Math.sin(t * 1.3 + phases[i])) * height * 0.8;
      dummy.position.set((i - (count - 1) / 2) * spacing, h / 2, 0);
      dummy.scale.set(0.07, h, 0.07);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[geo.box, accentMaterial(accent), count]} position={position} frustumCulled={false} />;
}

/** Slowly rotating partial ring on the platform. */
function ArcSweep({ radius, accent }: { radius: number; accent: "cyan" | "violet" }) {
  const ref = useRef<Mesh>(null);
  const reduced = useNexusStore((s) => s.reducedMotion);
  useFrame((_, delta) => {
    if (ref.current && !reduced) ref.current.rotation.z += delta * 0.4;
  });
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position-y={0.3} material={accentMaterial(accent)}>
      <ringGeometry args={[radius, radius + 0.1, 64, 1, 0, 1.2]} />
    </mesh>
  );
}

export function StationRoot({ id, children }: { id: StationId; children: ReactNode }) {
  const def = STATION_BY_ID[id];
  const { position, yaw } = stationTransform(id);
  const index = STATIONS.findIndex((s) => s.id === id) + 1;
  const accent = def.accent;
  const labels = useNexusStore((s) => s.quality) !== "low";
  const strip = accentMaterial(accent);

  return (
    <group position={position} rotation-y={yaw}>
      <mesh geometry={geo.cylinder} material={materials.hull} position-y={0.12} scale={[7.2, 0.24, 7.2]} />
      <mesh geometry={geo.ringThick} material={strip} position-y={0.26} rotation-x={Math.PI / 2} scale={7} />
      <mesh geometry={geo.ring} material={accentSoft(accent)} position-y={0.26} rotation-x={Math.PI / 2} scale={5.3} />
      <ArcSweep radius={6.1} accent={accent} />

      {[-1, 1].map((s) => (
        <group key={s} position={[s * 7.6, 0, -2]}>
          <mesh geometry={geo.box} material={materials.hull} position-y={4} scale={[0.55, 8, 0.55]} />
          <mesh geometry={geo.box} material={strip} position={[-s * 0.29, 4, 0.1]} scale={[0.05, 7, 0.1]} />
        </group>
      ))}
      <mesh geometry={geo.box} material={materials.hull} position={[0, 8, -2]} scale={[15.7, 0.3, 0.4]} />
      <mesh geometry={geo.box} material={strip} position={[0, 7.8, -1.8]} scale={[14.6, 0.05, 0.08]} />

      {labels && (
        <Html position={[0, 7.2, -1]} center distanceFactor={16} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
          <div className="station-tag" aria-hidden="true">
            <span>{String(index).padStart(2, "0")}</span>
            {def.codename}
          </div>
        </Html>
      )}
      {children}
    </group>
  );
}
