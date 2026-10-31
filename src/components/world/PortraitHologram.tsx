"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import gsap from "gsap";
import { Color, DoubleSide, Group, ShaderMaterial, Vector2 } from "three";
import { profile } from "@/data/profile";
import { COLORS } from "@/config/theme";
import { useAsset } from "@/components/ui/AssetsContext";
import { baseColor, geo, materials } from "@/lib/materials";
import { beamFragment, beamVertex, hologramFragment, hologramVertex } from "@/lib/shaders";
import { coverFit, useImageTexture, type CardOptions } from "@/lib/textures";
import { useNexusStore } from "@/stores/nexusStore";

const FALLBACK: CardOptions = {
  title: profile.name,
  variant: "avatar",
  initials: profile.initials,
  accent: COLORS.cyan,
};

interface Props {
  position?: [number, number, number];
  rotationY?: number;
  /** Portrait width in world units; height follows a 4:5 ratio. */
  width?: number;
  /** Play the scan-in reveal when the boot sequence finishes. */
  introReveal?: boolean;
  showBase?: boolean;
  onClick?: () => void;
  active?: boolean;
}

export function PortraitHologram({
  position = [0, 3, 0],
  rotationY = 0,
  width = 2.6,
  introReveal = false,
  showBase = true,
  onClick,
  active = false,
}: Props) {
  const height = width * 1.25;
  const exists = useAsset(profile.portrait);
  const texture = useImageTexture(profile.portrait, exists, FALLBACK);
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const phase = useNexusStore((s) => s.phase);
  const reduced = useNexusStore((s) => s.reducedMotion);
  useCursor(hovered && Boolean(onClick));

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: hologramVertex,
        fragmentShader: hologramFragment,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        uniforms: {
          uMap: { value: null },
          uScale: { value: new Vector2(1, 1) },
          uOffset: { value: new Vector2(0, 0) },
          uTint: { value: new Color().copy(baseColor.cyan) },
          uTime: { value: 0 },
          uReveal: { value: introReveal ? 0 : 1.1 },
          uOpacity: { value: 0 },
        },
      }),
    [introReveal],
  );
  const beam = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: beamVertex,
        fragmentShader: beamFragment,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        uniforms: { uColor: { value: new Color().copy(baseColor.cyan) }, uTime: { value: 0 } },
      }),
    [],
  );

  useEffect(
    () => () => {
      material.dispose();
      beam.dispose();
    },
    [material, beam],
  );

  useEffect(() => {
    if (!texture) return;
    const fit = coverFit(texture, 0.8);
    material.uniforms.uMap.value = texture;
    material.uniforms.uScale.value.set(fit.scale[0], fit.scale[1]);
    material.uniforms.uOffset.value.set(fit.offset[0], fit.offset[1]);
    material.uniforms.uOpacity.value = 1;
  }, [texture, material]);

  useEffect(() => {
    if (!introReveal) return;
    const reveal = material.uniforms.uReveal;
    if (phase === "boot") reveal.value = 0;
    if (phase === "intro") {
      gsap.to(reveal, { value: 1.1, duration: reduced ? 0.01 : 2.4, delay: reduced ? 0 : 0.9, ease: "power2.out" });
    }
    return undefined;
  }, [phase, introReveal, reduced, material]);

  useEffect(() => {
    const reveal = material.uniforms.uReveal;
    return () => {
      gsap.killTweensOf(reveal);
    };
  }, [material]);

  useFrame((state, delta) => {
    material.uniforms.uTime.value += delta;
    beam.uniforms.uTime.value += delta;
    const g = group.current;
    if (!g || reduced) return;
    const t = state.clock.elapsedTime;
    g.position.y = position[1] + Math.sin(t * 0.9) * 0.08;
    g.rotation.y = rotationY + Math.sin(t * 0.5) * 0.05;
    const target = hovered || active ? 1.04 : 1;
    g.scale.x += (target - g.scale.x) * 0.1;
    g.scale.y += (target - g.scale.y) * 0.1;
  });

  const border = hovered || active ? materials.whiteBasic : materials.cyanBasic;
  const t = 0.045;
  const beamHeight = Math.max(0.4, position[1] - height / 2 - 0.5);

  return (
    <group position={[position[0], 0, position[2]]}>
      <group ref={group} position-y={position[1]} rotation-y={rotationY}>
        <mesh
          onClick={(e) => {
            if (!onClick) return;
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[width, height]} />
          <primitive object={material} attach="material" />
        </mesh>
        <mesh geometry={geo.box} material={border} position={[0, height / 2 + 0.06, 0]} scale={[width + 0.2, t, t]} />
        <mesh geometry={geo.box} material={border} position={[0, -height / 2 - 0.06, 0]} scale={[width + 0.2, t, t]} />
        <mesh geometry={geo.box} material={border} position={[-width / 2 - 0.06, 0, 0]} scale={[t, height + 0.2, t]} />
        <mesh geometry={geo.box} material={border} position={[width / 2 + 0.06, 0, 0]} scale={[t, height + 0.2, t]} />
        <mesh position={[0, 0, -0.18]}>
          <planeGeometry args={[width * 1.08, height * 1.06]} />
          <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.06} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      {showBase && (
        <>
          <mesh geometry={geo.cylinder} material={materials.hull} position={[0, 0.5, 0]} scale={[width * 0.45, 0.2, width * 0.45]} />
          <mesh geometry={geo.ringThick} material={materials.cyanBasic} position={[0, 0.62, 0]} rotation-x={Math.PI / 2} scale={width * 0.45} />
          <mesh position={[0, 0.5 + beamHeight / 2, 0]}>
            <cylinderGeometry args={[width * 0.42, width * 0.2, beamHeight, 24, 1, true]} />
            <primitive object={beam} attach="material" />
          </mesh>
        </>
      )}
    </group>
  );
}
