import { CatmullRomCurve3, Vector3 } from "three";
import type { ResolvedShot } from "@/config/cameraPaths";

export interface CameraCurves {
  count: number;
  /** Writes camera position and look-at target for a fractional shot index. */
  sample: (t: number, outPosition: Vector3, outTarget: Vector3) => void;
}

/**
 * Builds two CatmullRom curves: one through camera positions (including `via`
 * waypoints) and one through look-at targets. CatmullRomCurve3 is indexed
 * uniformly by control point, so shot k sits exactly at parameter k/(n-1).
 */
export function buildCurves(shots: ResolvedShot[]): CameraCurves {
  const positionPoints: Vector3[] = [];
  const shotIndexInCurve: number[] = [];

  shots.forEach((shot, i) => {
    if (i > 0) shot.via.forEach((v) => positionPoints.push(new Vector3(...v)));
    shotIndexInCurve.push(positionPoints.length);
    positionPoints.push(new Vector3(...shot.position));
  });

  const positionCurve = new CatmullRomCurve3(positionPoints, false, "centripetal");
  const targetCurve = new CatmullRomCurve3(
    shots.map((s) => new Vector3(...s.target)),
    false,
    "centripetal",
  );

  const n = shots.length;
  const positionSpan = positionPoints.length - 1;

  return {
    count: n,
    sample(t, outPosition, outTarget) {
      const clamped = Math.min(Math.max(t, 0), n - 1);
      const k = Math.min(Math.floor(clamped), n - 2);
      const f = clamped - k;
      const index = shotIndexInCurve[k] + (shotIndexInCurve[k + 1] - shotIndexInCurve[k]) * f;
      positionCurve.getPoint(index / positionSpan, outPosition);
      targetCurve.getPoint(clamped / (n - 1), outTarget);
    },
  };
}
