import { PlayerStore } from "@/stores/PlayerStore";
import { useSelector } from "@xstate/store/react";
import { useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { WebSocketClient } from "../WebSocket/WebSocketClient";

export function PlayerJoinEmitter() {
  const [name] = useDebounceValue(
    useSelector(PlayerStore, (_) => _.context.name),
    500,
  );

  const [avatar] = useDebounceValue(
    useSelector(PlayerStore, (_) => _.context.avatar),
    500,
  );

  useEffect(() => {
    WebSocketClient.send({
      type: "PLAYER_UPDATED",
      player: { name, avatar },
    });
  }, [name, avatar]);

  return null;
}
