import { useEffect, useState } from "react";
import { CanvasTexture, SRGBColorSpace, TextureLoader, type Texture } from "three";

export interface CardOptions {
  title: string;
  subtitle?: string;
  tag?: string;
  accent?: string;
  width?: number;
  height?: number;
  variant?: "card" | "avatar";
  initials?: string;
}

const cache = new Map<string, CanvasTexture>();

const hexToRgba = (hex: string, alpha: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/\s+\S*$/, "")}…`;
    return kept;
  }
  return lines;
}

/** Procedural preview card, used whenever a real image is not available. */
export function createCardTexture(opts: CardOptions): CanvasTexture {
  const key = JSON.stringify(opts);
  const hit = cache.get(key);
  if (hit) return hit;

  const accent = opts.accent ?? "#25D9F8";
  const avatar = opts.variant === "avatar";
  const w = opts.width ?? (avatar ? 800 : 1024);
  const h = opts.height ?? (avatar ? 1000 : 640);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#0b1426");
  bg.addColorStop(1, "#18264d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = hexToRgba(accent, 0.1);
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const glowGrad = ctx.createRadialGradient(w * 0.8, h * 0.2, 10, w * 0.8, h * 0.2, h * 0.75);
  glowGrad.addColorStop(0, hexToRgba(accent, 0.35));
  glowGrad.addColorStop(1, hexToRgba(accent, 0));
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, w, h);

  if (avatar) {
    ctx.fillStyle = hexToRgba(accent, 0.22);
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.38, w * 0.19, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.86, w * 0.36, h * 0.26, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#EAF5FF";
    ctx.font = '700 150px "Space Grotesk Variable", system-ui, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(opts.initials ?? opts.title.slice(0, 2).toUpperCase(), w / 2, h * 0.38);
    ctx.font = '500 26px "JetBrains Mono Variable", ui-monospace, monospace';
    ctx.fillStyle = accent;
    ctx.fillText("PORTRAIT PLACEHOLDER", w / 2, h * 0.93);
  } else {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, w - 32, h - 32);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    if (opts.tag) {
      ctx.fillStyle = accent;
      ctx.font = '600 28px "JetBrains Mono Variable", ui-monospace, monospace';
      ctx.fillText(opts.tag.toUpperCase(), 56, 96);
    }
    ctx.fillStyle = "#EAF5FF";
    ctx.font = '700 66px "Space Grotesk Variable", system-ui, sans-serif';
    const lines = wrapLines(ctx, opts.title, w - 112, 3);
    lines.forEach((line, i) => ctx.fillText(line, 56, 210 + i * 78));
    if (opts.subtitle) {
      ctx.fillStyle = "#91A7BF";
      ctx.font = '400 30px "Inter Variable", system-ui, sans-serif';
      const sub = wrapLines(ctx, opts.subtitle, w - 112, 2);
      sub.forEach((line, i) => ctx.fillText(line, 56, h - 110 + i * 40));
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  cache.set(key, texture);
  return texture;
}

/** Cover-fit UV scale/offset so a photo of any aspect fills a plane without distortion. */
export function coverFit(texture: Texture, targetAspect: number, focusY = 0.85) {
  const img = texture.image as { width?: number; height?: number } | undefined;
  const aspect = img?.width && img?.height ? img.width / img.height : targetAspect;
  if (aspect > targetAspect) {
    const sx = targetAspect / aspect;
    return { scale: [sx, 1] as const, offset: [(1 - sx) / 2, 0] as const };
  }
  const sy = aspect / targetAspect;
  return { scale: [1, sy] as const, offset: [0, (1 - sy) * focusY] as const };
}

/** Applies cover-fit repeat/offset directly on a standard-material texture. */
export function applyCover(texture: Texture, targetAspect: number) {
  const fit = coverFit(texture, targetAspect, 0.5);
  texture.repeat.set(fit.scale[0], fit.scale[1]);
  texture.offset.set(fit.offset[0], fit.offset[1]);
}

/**
 * Loads an image from /public as a texture. Falls back to a generated card when the
 * file is missing or fails to load, so the scene never crashes on absent assets.
 */
export function useImageTexture(
  src: string | undefined,
  exists: boolean,
  fallback: CardOptions,
): Texture | null {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    let loaded: Texture | null = null;

    if (!src || !exists) {
      setTexture(createCardTexture(fallback));
      return;
    }

    new TextureLoader().load(
      src,
      (t) => {
        if (cancelled) {
          t.dispose();
          return;
        }
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 4;
        loaded = t;
        setTexture(t);
      },
      undefined,
      () => {
        if (!cancelled) setTexture(createCardTexture(fallback));
      },
    );

    return () => {
      cancelled = true;
      loaded?.dispose();
    };
  }, [src, exists, fallback]);

  return texture;
}
