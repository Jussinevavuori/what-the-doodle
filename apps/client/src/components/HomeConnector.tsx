import { WebSocketClient } from "@/features/WebSocket/WebSocketClient";
import { RoomAtom } from "@/stores/RoomAtom";
import { useAtom } from "@xstate/store/react";
import { useEffect } from "react";

export function HomeConnector() {
  const room = useAtom(RoomAtom);

  /**
   * Leave room if roomId
   */
  useEffect(() => {
    if (room) {
      WebSocketClient.send({ type: "LEAVE_ROOM" });
      RoomAtom.set(null);
    }
  }, [room]);

  return null;
}
