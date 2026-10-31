"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, PointLight, ShaderMaterial, Vector3 } from "three";
import { STATIONS } from "@/config/stations";
import { stationToWorld } from "@/config/cameraPaths";
import { COLORS } from "@/config/theme";
import { baseColor } from "@/lib/materials";
import { floorFragment, floorVertex } from "@/lib/shaders";
import { useNexusStore } from "@/stores/nexusStore";

const HUB_LIGHT = new Vector3(0, 6, 4);
const stationLights = STATIONS.map((s) => new Vector3(...stationToWorld(s.id, [0, 6.5, 5])));

/** One roaming light follows the active station; cheaper than a light per station. */
function RoamingLight() {
  const ref = useRef<PointLight>(null);
  const color = useMemo(() => new Color(), []);
  useFrame((_, delta) => {
    const light = ref.current;
    if (!light) return;
    const { activeShot } = useNexusStore.getState();
    const station = activeShot >= 1 && activeShot <= 8 ? STATIONS[activeShot - 1] : null;
    const target = station ? stationLights[activeShot - 1] : HUB_LIGHT;
    const k = 1 - Math.exp(-delta * 2.5);
    light.position.lerp(target, k);
    color.copy(station?.accent === "violet" ? baseColor.violet : baseColor.cyan);
    light.color.lerp(color, k);
  });
  return <pointLight ref={ref} position={[0, 6, 4]} intensity={160} distance={34} decay={2} color={COLORS.cyan} />;
}

export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} color="#8fa8d6" />
      <hemisphereLight args={["#5b7cff", COLORS.bg, 0.7]} />
      <pointLight position={[0, 7, 0]} intensity={220} distance={36} decay={2} color={COLORS.cyan} />
      <pointLight position={[0, 5, 14]} intensity={90} distance={30} decay={2} color={COLORS.violet} />
      <RoamingLight />
    </>
  );
}

export function Floor() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: floorVertex,
        fragmentShader: floorFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uCyan: { value: baseColor.cyan.clone() },
          uViolet: { value: baseColor.violet.clone() },
          uTime: { value: 0 },
          uOpacity: { value: 1 },
        },
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.02} renderOrder={-1}>
      <circleGeometry args={[110, 96]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
