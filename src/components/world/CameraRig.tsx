"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import { INTRO, resolveShots } from "@/config/cameraPaths";
import { buildCurves } from "@/lib/camera/cameraCurves";
import { rigState } from "@/lib/camera/rigState";
import { useNexusStore } from "@/stores/nexusStore";

const UP = new Vector3(0, 1, 0);

/**
 * The only thing that moves the camera. Reads mutable `rigState` (written by the
 * master tour timeline and the focus layer) once per frame; no React state involved.
 */
export function CameraRig() {
  const reduced = useNexusStore((s) => s.reducedMotion);
  const curves = useMemo(() => buildCurves(resolveShots(reduced)), [reduced]);
  const work = useMemo(
    () => ({
      pos: new Vector3(),
      target: new Vector3(),
      dir: new Vector3(),
      right: new Vector3(),
      px: 0,
      py: 0,
      sx: 0,
      sy: 0,
      lastSx: Number.NaN,
      lastSy: Number.NaN,
      lastW: 0,
      lastH: 0,
    }),
    [],
  );

  useFrame((state, delta) => {
    const cam = state.camera as PerspectiveCamera;
    const { width, height } = state.size;

    curves.sample(rigState.t, work.pos, work.target);
    work.dir.subVectors(work.target, work.pos).normalize();
    work.pos.addScaledVector(work.dir, rigState.dolly * 1.6);

    if (rigState.intro > 0.0005) {
      work.pos.x += INTRO.offset[0] * rigState.intro;
      work.pos.y += INTRO.offset[1] * rigState.intro;
      work.pos.z += INTRO.offset[2] * rigState.intro;
    }

    if (rigState.focusWeight > 0.0005) {
      work.pos.lerp(rigState.focusPos, rigState.focusWeight);
      work.target.lerp(rigState.focusTarget, rigState.focusWeight);
    }

    // Gentle pointer parallax, applied perpendicular to the view direction (no roll).
    const damp = 1 - Math.exp(-delta * 3);
    const wantX = reduced ? 0 : state.pointer.x * 0.45;
    const wantY = reduced ? 0 : state.pointer.y * 0.25;
    work.px += (wantX - work.px) * damp;
    work.py += (wantY - work.py) * damp;
    work.dir.subVectors(work.target, work.pos).normalize();
    work.right.crossVectors(work.dir, UP).normalize();
    work.pos.addScaledVector(work.right, work.px).addScaledVector(UP, work.py);

    cam.position.copy(work.pos);
    cam.lookAt(work.target);

    const aspect = width / height;
    const fov = aspect < 0.75 ? 72 : aspect < 1.1 ? 62 : 55;
    let projectionDirty = false;
    if (cam.fov !== fov) {
      cam.fov = fov;
      projectionDirty = true;
    }

    // Shift the composition so the subject stays clear of the HTML overlay panel.
    const s = useNexusStore.getState();
    const wide = width >= 1024;
    let tx = 0;
    let ty = 0;
    if (s.docked && s.phase !== "boot") {
      if (s.activeShot === 0) {
        if (wide) tx = -0.14;
        else ty = 0.14;
      } else if (s.activeShot >= 1 && s.activeShot <= 8) {
        if (wide) tx = 0.17;
        else ty = 0.2;
      }
    }
    const shiftDamp = 1 - Math.exp(-delta * 4);
    work.sx += (tx - work.sx) * shiftDamp;
    work.sy += (ty - work.sy) * shiftDamp;

    const changed =
      Math.abs(work.sx - work.lastSx) > 1e-4 ||
      Math.abs(work.sy - work.lastSy) > 1e-4 ||
      work.lastW !== width ||
      work.lastH !== height;
    if (changed) {
      if (Math.abs(work.sx) < 1e-4 && Math.abs(work.sy) < 1e-4) cam.clearViewOffset();
      else cam.setViewOffset(width, height, work.sx * width, work.sy * height, width, height);
      work.lastSx = work.sx;
      work.lastSy = work.sy;
      work.lastW = width;
      work.lastH = height;
      projectionDirty = false;
    }
    if (projectionDirty) cam.updateProjectionMatrix();
  });

  return null;
}
