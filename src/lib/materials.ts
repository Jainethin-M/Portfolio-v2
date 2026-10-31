import {
  BoxGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  IcosahedronGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
} from "three";
import { COLORS } from "@/config/theme";

/** HDR-ish tints (values > 1) so bloom only catches intentional emitters. */
export const glow = {
  cyan: new Color(COLORS.cyan).multiplyScalar(1.6),
  violet: new Color(COLORS.violet).multiplyScalar(1.7),
  white: new Color("#EAF5FF").multiplyScalar(1.4),
};

export const baseColor = {
  cyan: new Color(COLORS.cyan),
  violet: new Color(COLORS.violet),
  surface: new Color(COLORS.surface),
  bg: new Color(COLORS.bg),
};

/** Shared materials: reused across the whole scene, never disposed. */
export const materials = {
  cyanBasic: new MeshBasicMaterial({ color: glow.cyan, toneMapped: false }),
  violetBasic: new MeshBasicMaterial({ color: glow.violet, toneMapped: false }),
  whiteBasic: new MeshBasicMaterial({ color: glow.white, toneMapped: false }),
  cyanSoft: new MeshBasicMaterial({ color: baseColor.cyan, transparent: true, opacity: 0.35, toneMapped: false }),
  violetSoft: new MeshBasicMaterial({ color: baseColor.violet, transparent: true, opacity: 0.35, toneMapped: false }),
  cyanWire: new MeshBasicMaterial({ color: baseColor.cyan, wireframe: true, transparent: true, opacity: 0.55, toneMapped: false }),
  violetWire: new MeshBasicMaterial({ color: baseColor.violet, wireframe: true, transparent: true, opacity: 0.55, toneMapped: false }),
  hull: new MeshStandardMaterial({ color: "#0c1424", metalness: 0.65, roughness: 0.42 }),
  panel: new MeshStandardMaterial({ color: COLORS.surface, metalness: 0.5, roughness: 0.4 }),
  glass: new MeshStandardMaterial({ color: "#16243d", metalness: 0.2, roughness: 0.15, transparent: true, opacity: 0.35 }),
};

export const accentMaterial = (accent: "cyan" | "violet") =>
  accent === "cyan" ? materials.cyanBasic : materials.violetBasic;
export const accentSoft = (accent: "cyan" | "violet") =>
  accent === "cyan" ? materials.cyanSoft : materials.violetSoft;
export const accentWire = (accent: "cyan" | "violet") =>
  accent === "cyan" ? materials.cyanWire : materials.violetWire;
export const accentColor = (accent: "cyan" | "violet") => (accent === "cyan" ? baseColor.cyan : baseColor.violet);

/** Shared unit geometries; scale meshes instead of creating new geometry. */
export const geo = {
  box: new BoxGeometry(1, 1, 1),
  plane: new PlaneGeometry(1, 1),
  sphere: new SphereGeometry(1, 24, 24),
  sphereLow: new SphereGeometry(1, 12, 12),
  octa: new OctahedronGeometry(1, 0),
  ico: new IcosahedronGeometry(1, 1),
  icoWire: new IcosahedronGeometry(1, 2),
  cylinder: new CylinderGeometry(1, 1, 1, 48, 1),
  cylinderLow: new CylinderGeometry(1, 1, 1, 16, 1),
  hex: new CylinderGeometry(1, 1, 1, 6, 1),
  disc: new CircleGeometry(1, 64),
  /** Thin torus of radius 1; scale uniformly for different ring sizes. */
  ring: new TorusGeometry(1, 0.012, 8, 128),
  ringThick: new TorusGeometry(1, 0.03, 8, 96),
};
