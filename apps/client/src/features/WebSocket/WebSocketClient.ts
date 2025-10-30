import { UserIdAtom } from "@/stores/UserIdAtom";
import type { ClientMessage, ServerMessage } from "@wtd/shared/schemas";
import { ServerMessageSchema } from "@wtd/shared/schemas";

const ws = new WebSocket(`ws://${window.location.host}/api/ws`);

ws.addEventListener("message", async (event) => {
  try {
    const json = JSON.parse(event.data);
    const data = ServerMessageSchema.parse(json);
    console.log("Received message from server:", data);
    const eventSubscriptions = subscriptions.get(data.type);
    if (eventSubscriptions) {
      for (const callback of eventSubscriptions) {
        callback(data);
      }
    }

    // Automatically handle the following messages
    switch (data.type) {
      // Auto-assign user ID
      case "ASSIGN_USER_ID": {
        UserIdAtom.set(data.userId);
        break;
      }
    }
  } catch (e) {
    console.error("Invalid message received from server:", e);
  }
});

/**
 * Subscriptions for server messages
 */
const subscriptions = new Map<string, Set<(data: any) => void>>();

/**
 * Expose all WebSocket related functionality
 */
export const WebSocketClient = {
  /**
   * WebSocket instance
   */
  ws,

  /**
   * Send typesafe message to server
   */
  send(message: ClientMessage) {
    try {
      this.ws.send(JSON.stringify(message));
    } catch (e) {
      console.error("Failed to send message to server:", e);
    }
  },

  /**
   * Allow listening to server messages
   */
  on<TType extends ServerMessage["type"]>(
    event: TType,
    callback: (data: Extract<ServerMessage, { type: TType }>) => void,
  ) {
    const eventSubscriptions = subscriptions.get(event) || new Set();
    eventSubscriptions.add(callback);
    subscriptions.set(event, eventSubscriptions);
    return () => {
      eventSubscriptions.delete(callback);
    };
  },
};
