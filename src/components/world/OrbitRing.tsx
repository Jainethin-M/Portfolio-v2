"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { accentMaterial, geo, materials } from "@/lib/materials";
import { useNexusStore } from "@/stores/nexusStore";

interface Props {
  radius: number;
  tilt?: [number, number, number];
  speed?: number;
  accent?: "cyan" | "violet";
  satellites?: number;
  size?: number;
}

export function OrbitRing({ radius, tilt = [0, 0, 0], speed = 0.4, accent = "cyan", satellites = 1, size = 0.09 }: Props) {
  const spin = useRef<Group>(null);
  const reduced = useNexusStore((s) => s.reducedMotion);
  useFrame((_, delta) => {
    if (spin.current && !reduced) spin.current.rotation.y += delta * speed;
  });
  return (
    <group rotation={tilt}>
      <group ref={spin}>
        <mesh geometry={geo.ring} material={accentMaterial(accent)} rotation-x={Math.PI / 2} scale={radius} />
        {Array.from({ length: satellites }, (_, i) => {
          const a = (i / satellites) * Math.PI * 2;
          return (
            <mesh
              key={i}
              geometry={geo.sphereLow}
              material={materials.whiteBasic}
              position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}
              scale={size}
            />
          );
        })}
      </group>
    </group>
  );
}
