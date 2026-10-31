"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useAsset } from "./AssetsContext";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  fallback: ReactNode;
  sizes?: string;
  priority?: boolean;
}

/** next/image that degrades to `fallback` when the file is missing or fails to load. */
export function SafeImage({ src, alt, className, fallback, sizes = "(max-width: 768px) 90vw, 480px", priority }: Props) {
  const exists = useAsset(src);
  const [failed, setFailed] = useState(false);
  if (!src || !exists || failed) return <>{fallback}</>;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className ?? "object-cover"}
      onError={() => setFailed(true)}
    />
  );
}

export function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-nexus-surface to-nexus-bg p-4 text-center font-mono text-[11px] uppercase tracking-widest text-nexus-muted ${className}`}
    >
      {label}
    </div>
  );
}
