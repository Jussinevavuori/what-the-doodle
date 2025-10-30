import { createAtom } from "@xstate/store";

/**
 * Store the server-assigned User ID
 */
export const UserIdAtom = createAtom<string | null>(null);
