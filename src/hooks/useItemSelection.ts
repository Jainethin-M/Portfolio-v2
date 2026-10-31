"use client";

import { useCallback } from "react";
import type { StationId } from "@/types/portfolio";
import { deselectItem, selectItem, toggleItem, type LocalFocus } from "@/lib/interaction";
import { useNexusStore, type SelectionKey } from "@/stores/nexusStore";

/** Shared selection logic for list-style stations (education, projects, ...). */
export function useItemSelection(
  key: SelectionKey,
  station: StationId,
  ids: string[],
  focusAt: (index: number) => LocalFocus,
) {
  const selected = useNexusStore((s) => s.selection[key]);
  const index = selected ? ids.indexOf(selected) : -1;
  const count = ids.length;

  const toggle = useCallback(
    (id: string) => toggleItem(key, id, station, focusAt(ids.indexOf(id))),
    [key, station, ids, focusAt],
  );
  const step = useCallback(
    (delta: number) => {
      const next = (Math.max(index, 0) + delta + count) % count;
      selectItem(key, ids[next], station, focusAt(next));
    },
    [index, count, key, station, ids, focusAt],
  );
  const clear = useCallback(() => deselectItem(key), [key]);

  return { selected, index, toggle, next: () => step(1), prev: () => step(-1), clear };
}
