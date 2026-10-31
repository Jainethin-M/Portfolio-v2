"use client";

import { DataBars } from "@/components/world/StationRoot";
import { OrbitRing } from "@/components/world/OrbitRing";
import { PortraitHologram } from "@/components/world/PortraitHologram";
import { StationRoot } from "@/components/world/StationRoot";
import { FOCUS } from "@/config/cameraPaths";
import { geo, materials } from "@/lib/materials";
import { toggleItem } from "@/lib/interaction";
import { useNexusStore } from "@/stores/nexusStore";

export function Profile3D() {
  const open = useNexusStore((s) => s.selection.profile === "details");
  return (
    <StationRoot id="profile">
      <PortraitHologram
        position={[0, 3.2, 0]}
        width={2.7}
        active={open}
        onClick={() => toggleItem("profile", "details", "profile", FOCUS.profile)}
      />
      <group position={[0, 3.2, 0]}>
        <OrbitRing radius={2.9} tilt={[0.4, 0, 0.15]} speed={0.35} satellites={2} />
        <OrbitRing radius={3.4} tilt={[-0.25, 0, -0.3]} speed={-0.22} accent="violet" satellites={1} size={0.12} />
      </group>
      <DataBars position={[-4.6, 0.3, 0.5]} accent="cyan" count={9} height={3.2} />
      <DataBars position={[4.6, 0.3, 0.5]} accent="violet" count={9} height={3.2} />
      <mesh geometry={geo.box} material={materials.cyanSoft} position={[-4.6, 0.32, 0.5]} scale={[1.7, 0.03, 0.03]} />
      <mesh geometry={geo.box} material={materials.violetSoft} position={[4.6, 0.32, 0.5]} scale={[1.7, 0.03, 0.03]} />
    </StationRoot>
  );
}
