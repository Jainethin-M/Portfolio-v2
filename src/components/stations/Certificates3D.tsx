"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import { AdditiveBlending, Group } from "three";
import { StationRoot } from "@/components/world/StationRoot";
import { COLORS } from "@/config/theme";
import { useAsset } from "@/components/ui/AssetsContext";
import { certificates } from "@/data/certificates";
import type { Certificate } from "@/types/portfolio";
import { toggleItem } from "@/lib/interaction";
import { geo, materials } from "@/lib/materials";
import { certificatePlacements, itemFocus, type Placement } from "@/lib/stationLayouts";
import { applyCover, useImageTexture, type CardOptions } from "@/lib/textures";
import { useNexusStore } from "@/stores/nexusStore";

const W = 2.5;
const H = 1.8;

function Frame({ cert, placement, index }: { cert: Certificate; placement: Placement; index: number }) {
  const exists = useAsset(cert.previewImage);
  const fallback = useMemo<CardOptions>(
    () => ({ title: cert.title, subtitle: cert.issuer, tag: "Certificate", accent: index % 2 ? COLORS.cyan : COLORS.violet }),
    [cert, index],
  );
  const texture = useImageTexture(cert.previewImage, exists, fallback);
  useEffect(() => {
    if (texture) applyCover(texture, W / H);
  }, [texture]);

  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const selected = useNexusStore((s) => s.selection.certificate === cert.id);
  useCursor(hovered);

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    g.position.y = Math.sin(clock.elapsedTime * 0.7 + index * 1.4) * 0.08;
    const s = selected ? 1.12 : hovered ? 1.05 : 1;
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * 0.12);
  });

  const border = selected || hovered ? materials.whiteBasic : index % 2 ? materials.cyanBasic : materials.violetBasic;
  const [x, y, z] = placement.position;
  const t = 0.05;

  return (
    <group position={[x, y, z]} rotation-y={placement.yaw}>
      <group ref={ref}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            toggleItem("certificate", cert.id, "certificates", itemFocus(placement.position, placement.normal, 4.6));
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial map={texture} color={texture ? "#ffffff" : "#0b1426"} toneMapped={false} />
        </mesh>
        <mesh geometry={geo.box} material={materials.hull} position-z={-0.06} scale={[W + 0.4, H + 0.4, 0.08]} />
        <mesh geometry={geo.box} material={border} position={[0, H / 2 + 0.14, 0.01]} scale={[W + 0.4, t, t]} />
        <mesh geometry={geo.box} material={border} position={[0, -H / 2 - 0.14, 0.01]} scale={[W + 0.4, t, t]} />
        <mesh geometry={geo.box} material={border} position={[-W / 2 - 0.14, 0, 0.01]} scale={[t, H + 0.3, t]} />
        <mesh geometry={geo.box} material={border} position={[W / 2 + 0.14, 0, 0.01]} scale={[t, H + 0.3, t]} />
        <mesh position={[0, H / 2 + 1.6, -0.1]}>
          <cylinderGeometry args={[0.05, 1.3, 3.2, 20, 1, true]} />
          <meshBasicMaterial color={COLORS.cyan} transparent opacity={selected || hovered ? 0.12 : 0.045} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
        </mesh>
      </group>
      <mesh geometry={geo.ring} material={materials.violetSoft} position={[0, -y + 0.3, 0]} rotation-x={Math.PI / 2} scale={1.1} />
    </group>
  );
}

export function Certificates3D() {
  const placements = useMemo(() => certificatePlacements(certificates.length), []);
  return (
    <StationRoot id="certificates">
      {certificates.map((c, i) => (
        <Frame key={c.id} cert={c} placement={placements[i]} index={i} />
      ))}
    </StationRoot>
  );
}
