"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

const AssetsContext = createContext<ReadonlySet<string>>(new Set());

export function AssetsProvider({ existing, children }: { existing: string[]; children: ReactNode }) {
  const set = useMemo(() => new Set(existing), [existing]);
  return <AssetsContext.Provider value={set}>{children}</AssetsContext.Provider>;
}

/** True when the file was found in /public at build time. Empty/undefined paths are false. */
export function useAsset(path?: string): boolean {
  const set = useContext(AssetsContext);
  return Boolean(path && set.has(path));
}

export function useAssetSet(): ReadonlySet<string> {
  return useContext(AssetsContext);
}
