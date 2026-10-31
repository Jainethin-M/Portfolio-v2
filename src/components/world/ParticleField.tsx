"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color, Group } from "three";
import { baseColor } from "@/lib/materials";
import { useNexusStore } from "@/stores/nexusStore";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

export function ParticleField({ count }: { count: number }) {
  const group = useRef<Group>(null);
  const reduced = useNexusStore((s) => s.reducedMotion);
  const texture = useMemo(() => dotTexture(), []);

  const geometry = useMemo(() => {
    const rand = mulberry32(7);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new Color();
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.pow(rand(), 0.6) * 80;
      const a = rand() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = 0.4 + rand() * 28;
      positions[i * 3 + 2] = Math.sin(a) * r;
      c.copy(rand() > 0.5 ? baseColor.cyan : baseColor.violet).multiplyScalar(0.6 + rand() * 0.6);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(positions, 3));
    g.setAttribute("color", new BufferAttribute(colors, 3));
    return g;
  }, [count]);

  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, delta) => {
    if (group.current && !reduced) group.current.rotation.y += delta * 0.008;
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <pointsMaterial
          size={0.22}
          map={texture}
          vertexColors
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={AdditiveBlending}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
    </group>
  );
}
