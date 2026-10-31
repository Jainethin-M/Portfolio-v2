"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import { InstancedMesh, Mesh, Object3D } from "three";
import { StationRoot } from "@/components/world/StationRoot";
import { education } from "@/data/education";
import type { Vec3 } from "@/config/cameraPaths";
import { EDU_LINE, itemFocus, lineLayout } from "@/lib/stationLayouts";
import { toggleItem } from "@/lib/interaction";
import { geo, materials } from "@/lib/materials";
import { useNexusStore } from "@/stores/nexusStore";

/** Wall of archive drawers behind the timeline. */
function Archive() {
  const cells = useRef<InstancedMesh>(null);
  const glow = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  useEffect(() => {
    const a = cells.current;
    const b = glow.current;
    if (!a || !b) return;
    let g = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 6; c++) {
        const i = r * 6 + c;
        const x = (c - 2.5) * 2.4;
        const y = 1.3 + r * 1.75;
        dummy.position.set(x, y, -3.4);
        dummy.scale.set(2.1, 1.5, 0.35);
        dummy.updateMatrix();
        a.setMatrixAt(i, dummy.matrix);
        if ((i * 7) % 5 === 0) {
          dummy.position.set(x, y - 0.55, -3.2);
          dummy.scale.set(1.5, 0.05, 0.02);
          dummy.updateMatrix();
          b.setMatrixAt(g++, dummy.matrix);
        }
      }
    }
    b.count = g;
    a.instanceMatrix.needsUpdate = true;
    b.instanceMatrix.needsUpdate = true;
  }, [dummy]);
  return (
    <>
      <instancedMesh ref={cells} args={[geo.box, materials.hull, 18]} frustumCulled={false} />
      <instancedMesh ref={glow} args={[geo.box, materials.violetBasic, 18]} frustumCulled={false} />
    </>
  );
}

function EduNode({ id, index, position, selected }: { id: string; index: number; position: Vec3; selected: boolean }) {
  const item = education[index];
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const reduced = useNexusStore((s) => s.reducedMotion);
  useCursor(hovered);

  useFrame(({ clock }, delta) => {
    const m = ref.current;
    if (!m) return;
    if (!reduced) {
      m.rotation.y += delta * 0.7;
      m.position.y = Math.sin(clock.elapsedTime * 1.1 + index) * 0.1;
    }
    const s = selected ? 0.72 : hovered ? 0.62 : 0.5;
    m.scale.setScalar(m.scale.x + (s - m.scale.x) * 0.15);
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        geometry={geo.octa}
        material={selected || hovered ? materials.whiteBasic : materials.violetBasic}
        scale={0.5}
        onClick={(e) => {
          e.stopPropagation();
          toggleItem("education", id, "education", itemFocus(position));
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      />
      <mesh geometry={geo.ringThick} material={materials.cyanBasic} scale={selected ? 1.1 : 0.85} rotation-x={Math.PI / 2.5} />
      <mesh geometry={geo.cylinderLow} material={materials.violetSoft} position-y={-position[1] / 2 + 0.2} scale={[0.02, position[1] - 0.4, 0.02]} />
      <Html position={[0, -0.95, 0]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
        <div className={`node-tag ${selected || hovered ? "node-tag--active" : ""}`}>
          <b>{item.endYear === "Present" ? "Now" : item.endYear}</b>
          {(selected || hovered) && <span>{item.institution}</span>}
        </div>
      </Html>
    </group>
  );
}

export function Education3D() {
  const selected = useNexusStore((s) => s.selection.education);
  const positions = useMemo(() => lineLayout(education.length, EDU_LINE.spacing, EDU_LINE.y, EDU_LINE.wave), []);
  const span = Math.max(1, (education.length - 1) * Math.min(EDU_LINE.spacing, 12 / Math.max(1, education.length - 1)));

  return (
    <StationRoot id="education">
      <Archive />
      <mesh geometry={geo.box} material={materials.violetSoft} position={[0, 0.34, 0]} scale={[span + 3, 0.05, 0.05]} />
      {education.map((e, i) => (
        <EduNode key={e.id} id={e.id} index={i} position={positions[i]} selected={selected === e.id} />
      ))}
    </StationRoot>
  );
}
