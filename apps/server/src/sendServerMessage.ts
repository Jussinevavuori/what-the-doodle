import type { ServerMessage } from "@wtd/shared/schemas";
import type { ServerWebSocket } from "bun";
import { BunServer } from "..";

/**
 * Typesafe function to send a server message to all clients in a room
 */
export function sendServerMessage(
  recipient: { roomId: string } | ServerWebSocket<any>,
  message: ServerMessage,
) {
  if ("roomId" in recipient) {
    const roomId = recipient.roomId;
    BunServer.publish(roomId, JSON.stringify(message));
    return;
  } else {
    recipient.send(JSON.stringify(message));
  }
}
