import type { Vec3 } from "@/config/cameraPaths";
import { FOCUS } from "@/config/cameraPaths";

/**
 * Station-local layout maths shared by the 3D stations and the HTML panels
 * (so a click in either place focuses the same spot).
 * Local space: origin at the station centre on the floor, +Z toward the hub/camera.
 */

export interface Placement {
  position: Vec3;
  /** Rotation about Y so the item faces `normal`. */
  yaw: number;
  /** Outward-facing direction (toward the viewer). */
  normal: Vec3;
}

export function lineLayout(count: number, maxSpacing: number, y: number, wave = 0, maxWidth = 12): Vec3[] {
  const spacing = count > 1 ? Math.min(maxSpacing, maxWidth / (count - 1)) : 0;
  return Array.from({ length: count }, (_, i) => [
    (i - (count - 1) / 2) * spacing,
    y + wave * Math.sin(i * 1.3),
    0,
  ]);
}

export function arcLayout(
  count: number,
  radius: number,
  centerZ: number,
  y: number,
  maxStep = 0.45,
  maxSpan = 2.4,
): Placement[] {
  const step = count > 1 ? Math.min(maxStep, maxSpan / (count - 1)) : 0;
  return Array.from({ length: count }, (_, i) => {
    const phi = (i - (count - 1) / 2) * step;
    return {
      position: [radius * Math.sin(phi), y + 0.18 * Math.sin(i * 1.7), centerZ - radius * Math.cos(phi)] as Vec3,
      yaw: -phi,
      normal: [-Math.sin(phi), 0, Math.cos(phi)] as Vec3,
    };
  });
}

export function itemFocus(
  position: Vec3,
  normal: Vec3 = [0, 0, 1],
  distance: number = FOCUS.itemDistance,
): { position: Vec3; target: Vec3 } {
  return {
    position: [
      position[0] + normal[0] * distance,
      position[1] + 0.15,
      position[2] + normal[2] * distance,
    ],
    target: position,
  };
}

/** Arc used by the project monitors. */
export const PROJECT_ARC = { radius: 7.5, centerZ: 3, y: 3.4 } as const;
/** Arc used by the certificate frames. */
export const CERT_ARC = { radius: 7, centerZ: 3, y: 3.2 } as const;

export const EDU_LINE = { spacing: 3.6, y: 2.7, wave: 0.3 } as const;
export const EXP_LINE = { spacing: 4, y: 2.5, wave: 0 } as const;
export const ACH_LINE = { spacing: 3.2, y: 2.9, wave: 0.15 } as const;

export const projectPlacements = (n: number) =>
  arcLayout(n, PROJECT_ARC.radius, PROJECT_ARC.centerZ, PROJECT_ARC.y);
export const certificatePlacements = (n: number) =>
  arcLayout(n, CERT_ARC.radius, CERT_ARC.centerZ, CERT_ARC.y, 0.5, 2.2);
