"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import { Mesh, MeshBasicMaterial } from "three";
import { OrbitRing } from "@/components/world/OrbitRing";
import { DataBars, StationRoot } from "@/components/world/StationRoot";
import { FOCUS } from "@/config/cameraPaths";
import { COLORS } from "@/config/theme";
import { profile } from "@/data/profile";
import { toggleItem } from "@/lib/interaction";
import { geo, materials } from "@/lib/materials";
import { createCardTexture } from "@/lib/textures";
import { useNexusStore } from "@/stores/nexusStore";

function PulseRings() {
  const mats = useRef<(MeshBasicMaterial | null)[]>([]);
  const meshes = useRef<(Mesh | null)[]>([]);
  const reduced = useNexusStore((s) => s.reducedMotion);

  useFrame(({ clock }) => {
    for (let i = 0; i < 3; i++) {
      const m = meshes.current[i];
      const mat = mats.current[i];
      if (!m || !mat) continue;
      const phase = reduced ? 0.4 + i * 0.2 : (clock.elapsedTime / 3.2 + i / 3) % 1;
      m.scale.setScalar(0.3 + phase * 3.2);
      mat.opacity = (1 - phase) * 0.7;
    }
  });

  return (
    <group position={[4.4, 3.6, -0.6]} rotation-x={Math.PI / 2}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => void (meshes.current[i] = m)} geometry={geo.ring}>
          <meshBasicMaterial ref={(m) => void (mats.current[i] = m)} color={COLORS.violet} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export function Contact3D() {
  const open = useNexusStore((s) => s.selection.contact === "console");
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const screen = useMemo(
    () =>
      createCardTexture({
        title: "Open a channel",
        subtitle: profile.email,
        tag: "Communication terminal",
        accent: COLORS.violet,
        width: 1024,
        height: 512,
      }),
    [],
  );
  const border = hovered || open ? materials.whiteBasic : materials.violetBasic;
  const t = 0.05;

  return (
    <StationRoot id="contact">
      <group
        onClick={(e) => {
          e.stopPropagation();
          toggleItem("contact", "console", "contact", FOCUS.contactConsole);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh geometry={geo.box} material={materials.hull} position={[0, 0.75, 0.6]} scale={[5.4, 1, 2.2]} />
        <mesh geometry={geo.box} material={materials.violetBasic} position={[0, 1.27, 1.6]} scale={[5.4, 0.04, 0.04]} />
        <mesh geometry={geo.box} material={materials.hull} position={[0, 1.3, 0.6]} rotation-x={-0.12} scale={[5.0, 0.12, 1.8]} />
        <mesh position={[0, 3.0, -0.6]}>
          <planeGeometry args={[4.4, 2.2]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
        <mesh geometry={geo.box} material={materials.hull} position={[0, 3.0, -0.66]} scale={[4.7, 2.5, 0.08]} />
        <mesh geometry={geo.box} material={border} position={[0, 4.28, -0.58]} scale={[4.7, t, t]} />
        <mesh geometry={geo.box} material={border} position={[0, 1.72, -0.58]} scale={[4.7, t, t]} />
        <mesh geometry={geo.box} material={border} position={[-2.3, 3.0, -0.58]} scale={[t, 2.6, t]} />
        <mesh geometry={geo.box} material={border} position={[2.3, 3.0, -0.58]} scale={[t, 2.6, t]} />
      </group>
      <group position={[0, 3.0, -0.6]}>
        <OrbitRing radius={3.4} tilt={[0.25, 0, 0.1]} speed={0.3} satellites={Math.max(3, profile.socials.length)} accent="cyan" size={0.1} />
      </group>
      <DataBars position={[-4.5, 0.3, 0.8]} accent="violet" count={8} height={2.4} />
      <mesh geometry={geo.cylinderLow} material={materials.hull} position={[4.4, 1.6, -0.6]} scale={[0.08, 3.2, 0.08]} />
      <mesh geometry={geo.sphereLow} material={materials.violetBasic} position={[4.4, 3.3, -0.6]} scale={0.14} />
      <PulseRings />
    </StationRoot>
  );
}
