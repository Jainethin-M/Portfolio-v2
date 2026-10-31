"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import { AdditiveBlending, Group, InstancedMesh, Mesh, Object3D } from "three";
import { STATIONS } from "@/config/stations";
import { WORLD, type Vec3 } from "@/config/cameraPaths";
import { accentMaterial, geo, materials } from "@/lib/materials";
import { tour } from "@/lib/tour/tourEngine";
import { useNexusStore } from "@/stores/nexusStore";
import { DataBars } from "./StationRoot";
import { PortraitHologram } from "./PortraitHologram";
import { TrailTube } from "./TrailTube";

const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (angleDeg: number, r: number, y = 0): Vec3 => [
  r * Math.sin(rad(angleDeg)),
  y,
  -r * Math.cos(rad(angleDeg)),
];

const SPOKES = STATIONS.map((s) => [polar(s.angle, WORLD.hubRadius + 0.4, 0.07), polar(s.angle, WORLD.ringRadius - 7.3, 0.07)]);
const RING_POINTS: Vec3[] = Array.from({ length: 73 }, (_, i) => polar((i / 72) * 360, 22, 0.06));

export function LightTrails() {
  return (
    <group>
      {SPOKES.map((pts, i) => (
        <TrailTube key={i} points={pts} accent={i % 2 === 0 ? "cyan" : "violet"} speed={0.22} offset={i * 0.13} segments={12} />
      ))}
      <TrailTube points={RING_POINTS} accent="violet" radius={0.04} speed={0.06} segments={180} />
    </group>
  );
}

function ReactorCore() {
  const wireA = useRef<Mesh>(null);
  const wireB = useRef<Mesh>(null);
  const ringA = useRef<Group>(null);
  const ringB = useRef<Group>(null);
  const ringC = useRef<Group>(null);
  const hot = useRef<Mesh>(null);
  const reduced = useNexusStore((s) => s.reducedMotion);

  useFrame(({ clock }, delta) => {
    if (reduced) return;
    const d = delta;
    if (wireA.current) {
      wireA.current.rotation.y += d * 0.25;
      wireA.current.rotation.x += d * 0.1;
    }
    if (wireB.current) wireB.current.rotation.y -= d * 0.12;
    if (ringA.current) ringA.current.rotation.z += d * 0.45;
    if (ringB.current) ringB.current.rotation.x += d * 0.35;
    if (ringC.current) ringC.current.rotation.y -= d * 0.3;
    if (hot.current) hot.current.scale.setScalar(0.7 + Math.sin(clock.elapsedTime * 2) * 0.04);
  });

  return (
    <group position-y={3.5}>
      <mesh ref={hot} geometry={geo.sphere} material={materials.whiteBasic} scale={0.7} />
      <mesh geometry={geo.sphere} material={materials.cyanSoft} scale={1.25} />
      <mesh ref={wireA} geometry={geo.ico} material={materials.cyanWire} scale={1.9} />
      <mesh ref={wireB} geometry={geo.icoWire} material={materials.violetWire} scale={2.6} />
      <group ref={ringA} rotation-x={Math.PI / 2.4}>
        <mesh geometry={geo.ringThick} material={materials.cyanBasic} scale={3.2} />
      </group>
      <group ref={ringB} rotation-z={Math.PI / 3}>
        <mesh geometry={geo.ringThick} material={materials.violetBasic} scale={3.7} />
      </group>
      <group ref={ringC} rotation-x={-Math.PI / 5}>
        <mesh geometry={geo.ring} material={materials.cyanBasic} scale={4.3} />
      </group>
      <mesh position-y={5.5}>
        <cylinderGeometry args={[0.25, 0.5, 11, 24, 1, true]} />
        <meshBasicMaterial color="#25D9F8" transparent opacity={0.07} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Pillars() {
  const ref = useRef<InstancedMesh>(null);
  const strips = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    const a = ref.current;
    const b = strips.current;
    if (!a || !b) return;
    for (let i = 0; i < 8; i++) {
      const [x, , z] = polar(i * 45 + 22.5, 11.2);
      dummy.position.set(x, 3.6, z);
      dummy.rotation.set(0, -rad(i * 45 + 22.5), 0);
      dummy.scale.set(0.7, 7.2, 0.7);
      dummy.updateMatrix();
      a.setMatrixAt(i, dummy.matrix);
      const [sx, , sz] = polar(i * 45 + 22.5, 10.82);
      dummy.position.set(sx, 3.6, sz);
      dummy.scale.set(0.08, 6.2, 0.08);
      dummy.updateMatrix();
      b.setMatrixAt(i, dummy.matrix);
    }
    a.instanceMatrix.needsUpdate = true;
    b.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <>
      <instancedMesh ref={ref} args={[geo.box, materials.hull, 8]} frustumCulled={false} />
      <instancedMesh ref={strips} args={[geo.box, materials.cyanBasic, 8]} frustumCulled={false} />
    </>
  );
}

function Marker({ index, label, angle }: { index: number; label: string; angle: number }) {
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const reduced = useNexusStore((s) => s.reducedMotion);
  const active = useNexusStore((s) => s.activeShot === index + 1 && s.docked);
  const phase = useNexusStore((s) => s.phase);
  useCursor(hovered);
  const [x, , z] = polar(angle, 8.4);

  useFrame(({ clock }, delta) => {
    const m = ref.current;
    if (!m) return;
    if (!reduced) {
      m.rotation.y += delta * 0.8;
      m.position.y = 1.7 + Math.sin(clock.elapsedTime * 1.2 + index) * 0.12;
    }
    const s = hovered || active ? 0.46 : 0.34;
    m.scale.setScalar(m.scale.x + (s - m.scale.x) * 0.15);
  });

  return (
    <group position={[x, 0, z]}>
      <mesh
        ref={ref}
        geometry={geo.octa}
        material={hovered || active ? materials.whiteBasic : accentMaterial(index % 2 === 0 ? "cyan" : "violet")}
        position-y={1.7}
        scale={0.34}
        onClick={(e) => {
          e.stopPropagation();
          if (phase === "live") tour.goTo(index + 1);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      />
      <mesh geometry={geo.cylinderLow} material={materials.cyanSoft} position-y={0.8} scale={[0.02, 1.5, 0.02]} />
      {(hovered || active) && (
        <Html position={[0, 2.4, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div className="marker-tag">{label}</div>
        </Html>
      )}
    </group>
  );
}

function HoloScreen({ position, yaw, accent }: { position: Vec3; yaw: number; accent: "cyan" | "violet" }) {
  const t = 0.04;
  const border = accentMaterial(accent);
  return (
    <group position={position} rotation-y={yaw}>
      <mesh geometry={geo.plane} scale={[3.6, 2.2, 1]}>
        <meshBasicMaterial color="#25D9F8" transparent opacity={0.05} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh geometry={geo.box} material={border} position={[0, 1.12, 0]} scale={[3.7, t, t]} />
      <mesh geometry={geo.box} material={border} position={[0, -1.12, 0]} scale={[3.7, t, t]} />
      <mesh geometry={geo.box} material={border} position={[-1.82, 0, 0]} scale={[t, 2.28, t]} />
      <mesh geometry={geo.box} material={border} position={[1.82, 0, 0]} scale={[t, 2.28, t]} />
      <DataBars position={[0, -0.95, 0.02]} count={14} accent={accent} height={1.4} spacing={0.22} />
      <mesh geometry={geo.box} material={materials.cyanSoft} position={[-0.6, 0.7, 0.01]} scale={[1.8, 0.05, 0.01]} />
      <mesh geometry={geo.box} material={materials.cyanSoft} position={[-0.9, 0.5, 0.01]} scale={[1.2, 0.05, 0.01]} />
      <mesh geometry={geo.box} material={materials.violetSoft} position={[-0.75, 0.3, 0.01]} scale={[1.5, 0.05, 0.01]} />
    </group>
  );
}

export function Hub() {
  const quality = useNexusStore((s) => s.quality);
  const simplified = quality === "low";
  return (
    <group>
      <mesh geometry={geo.cylinder} material={materials.hull} position-y={0.2} scale={[WORLD.hubRadius, 0.4, WORLD.hubRadius]} />
      <mesh geometry={geo.ringThick} material={materials.cyanBasic} position-y={0.42} rotation-x={Math.PI / 2} scale={WORLD.hubRadius - 0.3} />
      <mesh geometry={geo.ring} material={materials.violetBasic} position-y={0.42} rotation-x={Math.PI / 2} scale={8} />
      <mesh geometry={geo.ring} material={materials.cyanSoft} position-y={0.42} rotation-x={Math.PI / 2} scale={4.6} />
      <mesh geometry={geo.cylinder} material={materials.hull} position-y={0.85} scale={[2.6, 0.9, 2.6]} />
      <mesh geometry={geo.ringThick} material={materials.cyanBasic} position-y={1.31} rotation-x={Math.PI / 2} scale={2.6} />

      <ReactorCore />
      {!simplified && <Pillars />}
      <LightTrails />

      {STATIONS.map((s, i) => (
        <Marker key={s.id} index={i} label={s.label} angle={s.angle} />
      ))}

      <HoloScreen position={[-8, 3.4, 3]} yaw={0.5} accent="violet" />
      {!simplified && <HoloScreen position={[9, 3.8, -1]} yaw={-0.7} accent="cyan" />}

      {/* Landing identity terminal: the visitor's holographic portrait */}
      <PortraitHologram position={[3.6, 3.1, 4.8]} rotationY={-0.3} width={2.6} introReveal />
    </group>
  );
}
