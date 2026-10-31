"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import { Group } from "three";
import { StationRoot } from "@/components/world/StationRoot";
import { achievements } from "@/data/achievements";
import type { Vec3 } from "@/config/cameraPaths";
import { ACH_LINE, itemFocus, lineLayout } from "@/lib/stationLayouts";
import { toggleItem } from "@/lib/interaction";
import { accentMaterial, geo, materials } from "@/lib/materials";
import { useNexusStore } from "@/stores/nexusStore";

const ARTIFACTS: ((mat: typeof materials.cyanBasic) => ReactNode)[] = [
  (m) => <mesh geometry={geo.octa} material={m} scale={[0.55, 0.8, 0.55]} />,
  (m) => (
    <mesh material={m}>
      <torusKnotGeometry args={[0.38, 0.12, 80, 10]} />
    </mesh>
  ),
  (m) => <mesh geometry={geo.icoWire} material={m} scale={0.6} />,
  (m) => (
    <mesh material={m}>
      <dodecahedronGeometry args={[0.55, 0]} />
    </mesh>
  ),
];

function Artifact({ index, position, selected }: { index: number; position: Vec3; selected: boolean }) {
  const item = achievements[index];
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const reduced = useNexusStore((s) => s.reducedMotion);
  useCursor(hovered);

  useFrame(({ clock }, delta) => {
    const g = ref.current;
    if (!g) return;
    if (!reduced) {
      g.rotation.y += delta * 0.6;
      g.position.y = Math.sin(clock.elapsedTime + index) * 0.1;
    }
    const s = selected ? 1.3 : hovered ? 1.15 : 1;
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * 0.12);
  });

  const mat = selected || hovered ? materials.whiteBasic : accentMaterial(index % 2 ? "violet" : "cyan");
  const [x, y, z] = position;
  return (
    <group position={[x, 0, z]}>
      <mesh geometry={geo.cylinder} material={materials.hull} position-y={0.24 + (y - 1.14) / 2} scale={[0.75, y - 1.14, 0.75]} />
      <mesh geometry={geo.ringThick} material={accentMaterial(index % 2 ? "violet" : "cyan")} position-y={y - 0.9} rotation-x={Math.PI / 2} scale={0.78} />
      <group position-y={y}>
        <group
          ref={ref}
          onClick={(e) => {
            e.stopPropagation();
            toggleItem("achievement", item.id, "achievements", itemFocus(position, [0, 0, 1], 4.4));
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          {ARTIFACTS[index % ARTIFACTS.length](mat)}
        </group>
        <Html position={[0, 1.1, 0.4]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
          <div className={`node-tag ${selected || hovered ? "node-tag--active" : ""}`}>
            <b>{item.category}</b>
          </div>
        </Html>
      </group>
    </group>
  );
}

export function Achievements3D() {
  const selected = useNexusStore((s) => s.selection.achievement);
  const positions = useMemo(() => lineLayout(achievements.length, ACH_LINE.spacing, ACH_LINE.y, ACH_LINE.wave), []);
  return (
    <StationRoot id="achievements">
      <mesh geometry={geo.box} material={materials.cyanSoft} position={[0, 0.3, 0]} scale={[13, 0.04, 0.04]} />
      {achievements.map((a, i) => (
        <Artifact key={a.id} index={i} position={positions[i]} selected={selected === a.id} />
      ))}
    </StationRoot>
  );
}
