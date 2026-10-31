"use client";

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Color, ShaderMaterial, TubeGeometry, Vector3 } from "three";
import type { Vec3 } from "@/config/cameraPaths";
import { baseColor } from "@/lib/materials";
import { trailFragment, trailVertex } from "@/lib/shaders";

interface TrailTubeProps {
  points: Vec3[];
  accent?: "cyan" | "violet";
  radius?: number;
  speed?: number;
  offset?: number;
  segments?: number;
}

/** Thin tube with a travelling light pulse (shader driven). */
export function TrailTube({ points, accent = "cyan", radius = 0.05, speed = 0.25, offset = 0, segments = 24 }: TrailTubeProps) {
  const geometry = useMemo(() => {
    const curve = new CatmullRomCurve3(points.map((p) => new Vector3(...p)));
    return new TubeGeometry(curve, segments, radius, 5, false);
  }, [points, radius, segments]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: trailVertex,
        fragmentShader: trailFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new Color().copy(accent === "cyan" ? baseColor.cyan : baseColor.violet) },
          uTime: { value: 0 },
          uSpeed: { value: speed },
          uOffset: { value: offset },
        },
      }),
    [accent, speed, offset],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
  });

  return <mesh geometry={geometry} material={material} />;
}
