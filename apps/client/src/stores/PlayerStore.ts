import { createAvatarSeed } from "@/utils/generic/createAvatarSeed";
import { createStore } from "@xstate/store";
import z from "zod";

export const PlayerStoreLocalStorageKey = "@wtd/PlayerStore";

/**
 * Player store context type
 */
export type PlayerStoreContext = {
  name: string;
  avatar: string;
};

/**
 * Read initial state from localStorage
 */
function getInitialContext(): PlayerStoreContext {
  const storedState = localStorage.getItem(PlayerStoreLocalStorageKey);
  if (storedState) {
    try {
      const persistedState = z
        .object({
          name: z.string(),
          avatar: z.string(),
        })
        .parse(JSON.parse(localStorage.getItem(PlayerStoreLocalStorageKey) || "{}"));

      return persistedState;
    } catch {}
  }

  return {
    name: "",
    avatar: createAvatarSeed(),
  };
}

/**
 * Store for current player information
 */
export const PlayerStore = createStore({
  // Initial context
  context: getInitialContext(),

  on: {
    /**
     * Full initialization of the store state
     */
    initialize(_context, event: { name: string; avatar: string }) {
      return {
        name: event.name,
        avatar: event.avatar,
      };
    },

    /**
     * Set the player's name
     */
    setName: (context, event: { name: string }) => ({
      ...context,
      name: event.name,
    }),

    /**
     * Refresh the avatar seed
     */
    newAvatar: (context) => ({
      ...context,
      avatar: createAvatarSeed(),
    }),
  },
});
