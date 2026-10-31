"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import { Group } from "three";
import { StationRoot } from "@/components/world/StationRoot";
import { TrailTube } from "@/components/world/TrailTube";
import { experience } from "@/data/experience";
import type { Vec3 } from "@/config/cameraPaths";
import { EXP_LINE, itemFocus, lineLayout } from "@/lib/stationLayouts";
import { toggleItem } from "@/lib/interaction";
import { geo, materials } from "@/lib/materials";
import { formatRange } from "@/lib/utils";
import { useNexusStore } from "@/stores/nexusStore";

function Radar() {
  const sweep = useRef<Group>(null);
  const reduced = useNexusStore((s) => s.reducedMotion);
  useFrame((_, delta) => {
    if (sweep.current && !reduced) sweep.current.rotation.z -= delta * 0.6;
  });
  return (
    <group position={[0, 4.4, -3.4]}>
      <mesh geometry={geo.ring} material={materials.cyanBasic} scale={3.3} />
      <mesh geometry={geo.ring} material={materials.cyanSoft} scale={2.2} />
      <mesh geometry={geo.ring} material={materials.cyanSoft} scale={1.1} />
      <mesh geometry={geo.box} material={materials.cyanSoft} scale={[6.6, 0.015, 0.015]} />
      <mesh geometry={geo.box} material={materials.cyanSoft} scale={[0.015, 6.6, 0.015]} />
      <group ref={sweep}>
        <mesh geometry={geo.box} material={materials.cyanBasic} position={[1.65, 0, 0]} scale={[3.3, 0.03, 0.03]} />
      </group>
    </group>
  );
}

function Pod({ index, position, selected }: { index: number; position: Vec3; selected: boolean }) {
  const item = experience[index];
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const reduced = useNexusStore((s) => s.reducedMotion);
  useCursor(hovered);

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    if (!reduced) g.position.y = Math.sin(clock.elapsedTime * 0.9 + index * 1.3) * 0.08;
    const s = selected ? 1.18 : hovered ? 1.08 : 1;
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * 0.12);
  });

  const ring = selected || hovered ? materials.whiteBasic : materials.cyanBasic;
  return (
    <group position={position}>
      <group ref={ref}>
        <mesh
          geometry={geo.hex}
          material={materials.hull}
          rotation-x={Math.PI / 2}
          rotation-y={Math.PI / 6}
          scale={[1.05, 0.14, 1.05]}
          onClick={(e) => {
            e.stopPropagation();
            toggleItem("experience", item.id, "experience", itemFocus(position, [0, 0, 1], 5.4));
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        />
        <mesh geometry={geo.hex} material={materials.cyanSoft} rotation-x={Math.PI / 2} rotation-y={Math.PI / 6} position-z={0.09} scale={[0.82, 0.02, 0.82]} />
        <mesh geometry={geo.ringThick} material={ring} scale={1.12} />
        <mesh geometry={geo.sphereLow} material={materials.whiteBasic} position-z={0.14} scale={0.08} />
      </group>
      <Html position={[0, -1.55, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
        <div className={`node-tag ${selected || hovered ? "node-tag--active" : ""}`}>
          <b>{item.company}</b>
          <span>{formatRange(item.startDate, item.endDate)}</span>
        </div>
      </Html>
    </group>
  );
}

export function Experience3D() {
  const selected = useNexusStore((s) => s.selection.experience);
  const positions = useMemo(() => lineLayout(experience.length, EXP_LINE.spacing, EXP_LINE.y, EXP_LINE.wave), []);
  const connectors = useMemo(
    () =>
      positions.slice(0, -1).map((p, i) => [
        [p[0] + 1.2, p[1], p[2]] as Vec3,
        [positions[i + 1][0] - 1.2, positions[i + 1][1], positions[i + 1][2]] as Vec3,
      ]),
    [positions],
  );

  return (
    <StationRoot id="experience">
      <Radar />
      {connectors.map((pts, i) => (
        <TrailTube key={i} points={pts} accent="cyan" radius={0.035} speed={0.35} offset={i * 0.3} segments={8} />
      ))}
      {experience.map((e, i) => (
        <Pod key={e.id} index={i} position={positions[i]} selected={selected === e.id} />
      ))}
      <mesh geometry={geo.box} material={materials.cyanSoft} position={[0, 0.34, 0.5]} scale={[13, 0.04, 0.04]} />
    </StationRoot>
  );
}
