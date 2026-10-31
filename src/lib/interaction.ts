import type { StationId } from "@/types/portfolio";
import type { Vec3 } from "@/config/cameraPaths";
import { stationToWorld } from "@/config/cameraPaths";
import { focusCamera, releaseFocus } from "@/lib/camera/rigState";
import { tour } from "@/lib/tour/tourEngine";
import { useNexusStore, type SelectionKey } from "@/stores/nexusStore";

export interface LocalFocus {
  position: Vec3;
  target: Vec3;
}

/** Select an item (from 3D or HTML), pausing an auto tour and focusing the camera on it. */
export function selectItem(key: SelectionKey, id: string, station: StationId, focus?: LocalFocus) {
  tour.interact();
  useNexusStore.getState().select(key, id);
  if (focus) focusCamera(stationToWorld(station, focus.position), stationToWorld(station, focus.target));
}

export function deselectItem(key: SelectionKey) {
  useNexusStore.getState().select(key, null);
  releaseFocus();
}

/** Click handler helper: clicking the selected item again closes it. */
export function toggleItem(key: SelectionKey, id: string, station: StationId, focus?: LocalFocus) {
  if (useNexusStore.getState().selection[key] === id) deselectItem(key);
  else selectItem(key, id, station, focus);
}
