import { PlayerStore, PlayerStoreLocalStorageKey } from "@/stores/PlayerStore";
import { useEffect } from "react";

export function StatePersistor() {
  /**
   * Persist to storage on state change
   */
  useEffect(() => {
    return PlayerStore.subscribe(({ context }) => {
      localStorage.setItem(PlayerStoreLocalStorageKey, JSON.stringify(context));
    }).unsubscribe;
  }, []);

  return null;
}
