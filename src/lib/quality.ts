export type QualityTier = "high" | "medium" | "low";

export interface QualitySettings {
  tier: QualityTier;
  maxDpr: number;
  particles: number;
  bloom: boolean;
  /** Radial/segment detail multiplier for procedural geometry. */
  detail: number;
  /** Lighter geometry and fewer decorative objects. */
  simplified: boolean;
  antialias: boolean;
  labels: boolean;
}

export const QUALITY: Record<QualityTier, QualitySettings> = {
  high: { tier: "high", maxDpr: 2, particles: 1400, bloom: true, detail: 1, simplified: false, antialias: false, labels: true },
  medium: { tier: "medium", maxDpr: 1.5, particles: 600, bloom: true, detail: 0.7, simplified: false, antialias: true, labels: true },
  low: { tier: "low", maxDpr: 1, particles: 220, bloom: false, detail: 0.5, simplified: true, antialias: true, labels: false },
};

/** Coarse capability detection. Runs on the client only. */
export function detectQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;

  if ((coarse && narrow) || memory <= 2 || cores <= 2) return "low";
  if (coarse || narrow || memory <= 4 || cores <= 4) return "medium";
  return "high";
}
