import { Link } from "@tanstack/react-router";
import { MIN_PLAYERS } from "@wtd/shared/consts.ts";
import type { RoomDTO } from "@wtd/shared/schemas";
import { DoorOpenIcon, JoystickIcon } from "lucide-react";
import { Button } from "../../components/Button";
import { GameSettingsForm } from "../../components/GameSettingsForm";
import { RoomInviteDetails } from "../../components/RoomInviteDetails";
import { WebSocketClient } from "../WebSocket/WebSocketClient";
import { LobbyPlayersList } from "./LobbyPlayersList";
import { LobbyRoomNameHeader } from "./LobbyRoomNameHeader";

export type LobbyProps = {
  room: RoomDTO;
};

export function Lobby(props: LobbyProps) {
  return (
    <div className="relative flex flex-col gap-8">
      <LobbyRoomNameHeader
        roomId={props.room.id}
        className="absolute -top-8 left-1/2 -translate-x-1/2"
      />

      {/* Player list */}
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Players</h2>
        <LobbyPlayersList />
      </div>

      {/* Game settings */}
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Invite players</h2>
        <RoomInviteDetails roomId={props.room.id} />
      </div>

      {/* Game settings */}
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Game settings</h2>
        <GameSettingsForm roomId={props.room.id} />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          disabled={props.room.players.length < MIN_PLAYERS}
          onClick={() => {
            WebSocketClient.send({
              type: "START_GAME",
              roomId: props.room.id,
            });
          }}
          variant="brand"
        >
          Start Game
          <JoystickIcon />
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">
            Exit lobby
            <DoorOpenIcon />
          </Link>
        </Button>
      </div>
    </div>
  );
}
