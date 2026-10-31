import type { StationId } from "@/types/portfolio";
import { STATION_BY_ID, STATIONS } from "./stations";

/**
 * CAMERA CONFIGURATION
 * --------------------
 * Everything that decides where the camera goes lives in this file.
 *
 * World layout: the hub is at the origin. Stations sit on a ring of radius
 * `WORLD.ringRadius`. Station-local space has +Z pointing toward the hub, so a
 * "station" shot such as position [0, 3.4, 11.5] means "11.5 units in front of
 * the station, 3.4 units up, looking at the target".
 *
 * Shots are visited in order. The camera follows a CatmullRom curve through
 * every shot position (plus optional `via` waypoints for curved fly-throughs);
 * the look-at target follows a second curve through the shot targets.
 */

export type Vec3 = [number, number, number];

export const WORLD = {
  ringRadius: 34,
  hubRadius: 12,
  fogNear: 30,
  fogFar: 120,
} as const;

export const TOUR_TIMING = {
  /** Seconds spent flying between two shots. */
  travel: 4.5,
  /** Seconds spent resting at each station (auto tour reading time). */
  dwell: 7,
  /** Seconds resting at the final hub shot. */
  finalDwell: 5,
  /** Scroll distance (in viewport heights) per second of tour timeline. */
  scrollVhPerSecond: 11,
  /** Faster travel when the visitor prefers reduced motion. */
  reducedTravel: 1.2,
} as const;

export const INTRO = {
  /** Where the camera starts (offset from the first shot) during the opening fly-in. */
  offset: [0, 10, 26] as Vec3,
  duration: 3.6,
} as const;

export interface ShotConfig {
  id: "hub" | StationId | "hub-final";
  /** Coordinate space of position/target/via. */
  space: "world" | "station";
  position: Vec3;
  target: Vec3;
  via?: Vec3[];
  travel?: number;
  dwell?: number;
}

export const SHOTS: readonly ShotConfig[] = [
  { id: "hub", space: "world", position: [0, 3.6, 17], target: [1.2, 3.1, 2] },
  { id: "profile", space: "station", position: [0, 3.3, 11.5], target: [0, 2.8, 0] },
  { id: "education", space: "station", position: [-3.5, 3.3, 11.5], target: [0, 2.6, 0] },
  { id: "experience", space: "station", position: [0, 3.2, 12], target: [0, 2.8, 0] },
  { id: "skills", space: "station", position: [0, 4.2, 12.5], target: [0, 3.5, 0] },
  { id: "projects", space: "station", position: [0, 3.5, 10.5], target: [0, 3.4, 0] },
  { id: "certificates", space: "station", position: [3.5, 3.3, 11.5], target: [0, 3, 0] },
  { id: "achievements", space: "station", position: [0, 3.2, 12], target: [0, 2.6, 0] },
  { id: "contact", space: "station", position: [0, 3.4, 11.5], target: [0, 2.6, 0] },
  {
    id: "hub-final",
    space: "world",
    position: [0, 9.5, 22],
    target: [0, 3, 0],
    via: [[25, 7, 7]],
    dwell: TOUR_TIMING.finalDwell,
  },
];

/** Camera focus presets (station-local) used when a visitor selects something. */
export const FOCUS = {
  /** Distance in front of a monitor/frame/node when focusing it. */
  itemDistance: 4.6,
  profile: { position: [0.8, 3.1, 6.5] as Vec3, target: [0, 2.9, 0] as Vec3 },
  reactor: { position: [0, 4.2, 8.2] as Vec3, target: [0, 3.5, 0] as Vec3 },
  contactConsole: { position: [0, 3.1, 6.8] as Vec3, target: [0, 2.2, 0] as Vec3 },
  duration: 1.4,
} as const;

/** Resolved world-space transform for a station group. */
export function stationTransform(id: StationId): { position: Vec3; yaw: number } {
  const a = (STATION_BY_ID[id].angle * Math.PI) / 180;
  return {
    position: [WORLD.ringRadius * Math.sin(a), 0, -WORLD.ringRadius * Math.cos(a)],
    // Local +Z must point toward the hub.
    yaw: -a,
  };
}

/** Convert a station-local point to world space. */
export function stationToWorld(id: StationId, local: Vec3): Vec3 {
  const { position, yaw } = stationTransform(id);
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return [
    position[0] + local[0] * c + local[2] * s,
    position[1] + local[1],
    position[2] - local[0] * s + local[2] * c,
  ];
}

export interface ResolvedShot {
  id: ShotConfig["id"];
  position: Vec3;
  target: Vec3;
  via: Vec3[];
  travel: number;
  dwell: number;
}

export function resolveShots(reducedMotion = false): ResolvedShot[] {
  return SHOTS.map((shot, index) => {
    const stationId = STATIONS.find((s) => s.id === shot.id)?.id;
    const convert = (v: Vec3): Vec3 =>
      shot.space === "station" && stationId ? stationToWorld(stationId, v) : v;
    const isFirst = index === 0;
    return {
      id: shot.id,
      position: convert(shot.position),
      target: convert(shot.target),
      via: (shot.via ?? []).map(convert),
      travel: isFirst
        ? 0
        : reducedMotion
          ? TOUR_TIMING.reducedTravel
          : (shot.travel ?? TOUR_TIMING.travel),
      dwell: isFirst ? 0 : (shot.dwell ?? TOUR_TIMING.dwell),
    };
  });
}
