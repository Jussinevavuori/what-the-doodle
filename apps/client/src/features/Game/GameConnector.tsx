import { RoomAtom } from "@/stores/RoomAtom";
import { useEffect } from "react";
import { WebSocketClient } from "../WebSocket/WebSocketClient";

export type GameEmitterProps = {
  roomId: string;
};

export function GameConnector(props: GameEmitterProps) {
  /**
   * Join room on roomId change
   */
  useEffect(() => {
    WebSocketClient.send({
      type: "JOIN_ROOM",
      roomId: props.roomId,
    });
  }, [props.roomId]);

  /**
   * Subscribe to room updates
   */
  useEffect(() => {
    return WebSocketClient.on("ROOM_SYNC", (data) => {
      if (data.room.id !== props.roomId) return;
      RoomAtom.set(data.room);
    });
  }, [props.roomId]);

  return null;
}
