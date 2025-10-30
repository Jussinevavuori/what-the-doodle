import type { RoomDTO } from "@wtd/shared/schemas";
import { createAtom } from "@xstate/store";

/**
 * Store for the current room information
 */
export const RoomAtom = createAtom<RoomDTO | null>(null);
