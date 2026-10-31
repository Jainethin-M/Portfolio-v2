"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import { Group, Mesh } from "three";
import { StationRoot } from "@/components/world/StationRoot";
import { COLORS } from "@/config/theme";
import { useAsset } from "@/components/ui/AssetsContext";
import { projects } from "@/data/projects";
import type { Project } from "@/types/portfolio";
import { toggleItem } from "@/lib/interaction";
import { geo, materials } from "@/lib/materials";
import { matchesProjectFilter } from "@/lib/projects";
import { itemFocus, projectPlacements, type Placement } from "@/lib/stationLayouts";
import { applyCover, useImageTexture, type CardOptions } from "@/lib/textures";
import { useNexusStore } from "@/stores/nexusStore";

const W = 3.2;
const H = 1.9;

function Monitor({ project, placement, index }: { project: Project; placement: Placement; index: number }) {
  const first = project.images[0]?.src;
  const exists = useAsset(first);
  const fallback = useMemo<CardOptions>(
    () => ({
      title: project.title,
      subtitle: project.shortDescription,
      tag: project.category,
      accent: index % 2 === 0 ? COLORS.cyan : COLORS.violet,
    }),
    [project, index],
  );
  const texture = useImageTexture(first, exists, fallback);
  useEffect(() => {
    if (texture) applyCover(texture, W / H);
  }, [texture]);

  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const selected = useNexusStore((s) => s.selection.project === project.slug);
  const anySelected = useNexusStore((s) => Boolean(s.selection.project));
  const matches = useNexusStore((s) => matchesProjectFilter(project, s.projectTech, s.projectCategory));
  useCursor(hovered && matches);

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const s = selected ? 1.12 : hovered && matches ? 1.05 : 1;
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * 0.12);
    g.position.y = Math.sin(clock.elapsedTime * 0.8 + index) * 0.05;
  });

  const border = selected || (hovered && matches) ? materials.whiteBasic : index % 2 === 0 ? materials.cyanBasic : materials.violetBasic;
  const opacity = !matches ? 0.18 : anySelected && !selected ? 0.55 : 1;
  const [x, y, z] = placement.position;
  const t = 0.04;

  return (
    <group position={[x, y, z]} rotation-y={placement.yaw}>
      <group ref={ref}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            if (!matches) return;
            toggleItem("project", project.slug, "projects", itemFocus(placement.position, placement.normal, 5.2));
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial map={texture} color={texture ? "#ffffff" : "#0b1426"} transparent opacity={opacity} toneMapped={false} />
        </mesh>
        <mesh geometry={geo.box} material={materials.hull} position-z={-0.07} scale={[W + 0.3, H + 0.3, 0.08]} />
        <mesh geometry={geo.box} material={border} position={[0, H / 2 + 0.1, 0.01]} scale={[W + 0.3, t, t]} />
        <mesh geometry={geo.box} material={border} position={[0, -H / 2 - 0.1, 0.01]} scale={[W + 0.3, t, t]} />
        <mesh geometry={geo.box} material={border} position={[-W / 2 - 0.1, 0, 0.01]} scale={[t, H + 0.2, t]} />
        <mesh geometry={geo.box} material={border} position={[W / 2 + 0.1, 0, 0.01]} scale={[t, H + 0.2, t]} />
      </group>
      <mesh geometry={geo.ring} material={materials.cyanSoft} position={[0, -y + 0.3, 0]} rotation-x={Math.PI / 2} scale={0.9} />
      <mesh geometry={geo.cylinderLow} material={materials.cyanSoft} position={[0, (-y + 0.3 - 1.05) / 2, -0.1]} scale={[0.015, y - 1.35, 0.015]} />
    </group>
  );
}

function CommandGlobe() {
  const globe = useRef<Mesh>(null);
  const reduced = useNexusStore((s) => s.reducedMotion);
  useFrame((_, delta) => {
    if (globe.current && !reduced) globe.current.rotation.y += delta * 0.4;
  });
  return (
    <group position={[0, 0, 4.2]}>
      <mesh geometry={geo.cylinder} material={materials.hull} position-y={0.4} scale={[1.2, 0.3, 1.2]} />
      <mesh geometry={geo.ringThick} material={materials.cyanBasic} position-y={0.56} rotation-x={Math.PI / 2} scale={1.2} />
      <mesh ref={globe} geometry={geo.icoWire} material={materials.cyanWire} position-y={1.35} scale={0.7} />
    </group>
  );
}

export function Projects3D() {
  const placements = useMemo(() => projectPlacements(projects.length), []);
  return (
    <StationRoot id="projects">
      <CommandGlobe />
      {projects.map((p, i) => (
        <Monitor key={p.slug} project={p} placement={placements[i]} index={i} />
      ))}
    </StationRoot>
  );
}
