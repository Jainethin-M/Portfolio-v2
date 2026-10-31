"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import { AdditiveBlending, Group, Mesh } from "three";
import { StationRoot } from "@/components/world/StationRoot";
import { FOCUS, type Vec3 } from "@/config/cameraPaths";
import { SKILL_CATEGORIES, skills } from "@/data/skills";
import type { Skill, SkillCategory } from "@/types/portfolio";
import { toggleItem } from "@/lib/interaction";
import { accentMaterial, accentSoft, geo, materials } from "@/lib/materials";
import { useNexusStore } from "@/stores/nexusStore";

const CENTER_Y = 3.5;

function SkillNode({ skill, position, accent, dimmed }: { skill: Skill; position: Vec3; accent: "cyan" | "violet"; dimmed: boolean }) {
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const selected = useNexusStore((s) => s.selection.skill === skill.id);
  useCursor(hovered && !dimmed);

  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const s = selected ? 0.26 : hovered ? 0.22 : 0.15;
    m.scale.setScalar(m.scale.x + (s - m.scale.x) * 0.15);
  });

  const material = selected || hovered ? materials.whiteBasic : dimmed ? accentSoft(accent) : accentMaterial(accent);
  return (
    <group position={position}>
      <mesh
        ref={ref}
        geometry={geo.sphereLow}
        material={material}
        scale={0.15}
        onClick={(e) => {
          e.stopPropagation();
          if (!dimmed) toggleItem("skill", skill.id, "skills", FOCUS.reactor);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      />
      {(hovered || selected) && (
        <Html position={[0, 0.4, 0]} center distanceFactor={8} zIndexRange={[20, 10]} style={{ pointerEvents: "none" }}>
          <div className="marker-tag">{skill.name}</div>
        </Html>
      )}
    </group>
  );
}

function SkillRing({ category, index, radius, tilt }: { category: SkillCategory; index: number; radius: number; tilt: Vec3 }) {
  const spin = useRef<Group>(null);
  const filter = useNexusStore((s) => s.skillCategory);
  const reduced = useNexusStore((s) => s.reducedMotion);
  const list = useMemo(() => skills.filter((s) => s.category === category), [category]);
  const accent = index % 2 === 0 ? "cyan" : "violet";
  const dimmed = filter !== "All" && filter !== category;
  const speed = (index % 2 === 0 ? 1 : -1) * (0.16 / (1 + index * 0.15));

  useFrame((_, delta) => {
    if (spin.current && !reduced) spin.current.rotation.y += delta * speed;
  });

  return (
    <group rotation={tilt}>
      <group ref={spin}>
        <mesh
          geometry={geo.ring}
          material={dimmed ? accentSoft(accent) : accentMaterial(accent)}
          rotation-x={Math.PI / 2}
          scale={radius}
        />
        {list.map((skill, i) => {
          const a = (i / list.length) * Math.PI * 2 + index * 0.6;
          return (
            <SkillNode
              key={skill.id}
              skill={skill}
              accent={accent}
              dimmed={dimmed}
              position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}
            />
          );
        })}
      </group>
    </group>
  );
}

export function Skills3D() {
  const core = useRef<Mesh>(null);
  const wire = useRef<Mesh>(null);
  const reduced = useNexusStore((s) => s.reducedMotion);

  const rings = useMemo(
    () =>
      SKILL_CATEGORIES.map((category, i) => ({
        category,
        radius: 1.7 + i * 0.36,
        tilt: [
          (i % 2 ? 0.28 : -0.28) * (0.4 + (i % 3) * 0.3),
          0,
          (i % 2 ? -0.22 : 0.22) * (0.4 + ((i + 1) % 3) * 0.3),
        ] as Vec3,
      })),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (reduced) return;
    if (wire.current) wire.current.rotation.y += delta * 0.3;
    if (core.current) core.current.scale.setScalar(0.45 + Math.sin(clock.elapsedTime * 2.2) * 0.03);
  });

  return (
    <StationRoot id="skills">
      <mesh geometry={geo.cylinder} material={materials.hull} position-y={0.7} scale={[1.6, 0.9, 1.6]} />
      <mesh geometry={geo.ringThick} material={materials.violetBasic} position-y={1.16} rotation-x={Math.PI / 2} scale={1.6} />
      <mesh geometry={geo.cylinderLow} material={materials.violetSoft} position-y={2.3} scale={[0.04, 2.3, 0.04]} />
      <group position-y={CENTER_Y}>
        <mesh ref={core} geometry={geo.sphere} material={materials.whiteBasic} scale={0.45} />
        <mesh geometry={geo.sphere} material={materials.violetSoft} scale={0.8} />
        <mesh ref={wire} geometry={geo.ico} material={materials.cyanWire} scale={1.15} />
        {rings.map((r, i) => (
          <SkillRing key={r.category} category={r.category} index={i} radius={r.radius} tilt={r.tilt} />
        ))}
        <mesh position-y={3.2}>
          <cylinderGeometry args={[0.12, 0.3, 6.4, 16, 1, true]} />
          <meshBasicMaterial color="#8C6BFF" transparent opacity={0.08} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
        </mesh>
      </group>
    </StationRoot>
  );
}
