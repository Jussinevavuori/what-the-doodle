import { Button } from "@/components/Button";
import { PlayerAvatar } from "@/features/Player/PlayerAvatar";
import { RoomAtom } from "@/stores/RoomAtom";
import { UserIdAtom } from "@/stores/UserIdAtom";
import { cn } from "@/utils/ui/cn";
import { MAX_PLAYERS, MIN_PLAYERS } from "@wtd/shared/consts.ts";
import { useAtom } from "@xstate/store/react";
import { PenIcon } from "lucide-react";
import { PlayerProfileFormDialog } from "../Player/PlayerProfileFormDialog";

export type LobbyPlayersListProps = {
  roomId: string;
};

export function LobbyPlayersList() {
  const room = useAtom(RoomAtom);

  const userId = useAtom(UserIdAtom);

  if (!room) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row flex-wrap gap-2">
        {room.players.map((player) =>
          userId === player.id ? (
            <PlayerProfileFormDialog forceOpenWhileUnnamed>
              <PlayerAvatar
                className="hover:bg-muted cursor-pointer"
                key={player.id}
                player={player}
              >
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -top-2 -left-2 rounded-full"
                >
                  <PenIcon />
                </Button>
              </PlayerAvatar>
            </PlayerProfileFormDialog>
          ) : (
            <PlayerAvatar key={player.id} player={player} />
          ),
        )}
      </div>

      <p className="flex flex-row flex-wrap items-center justify-between">
        <span
          className={cn(
            "text-sm",
            room.players.length < MIN_PLAYERS ? "text-warning" : "text-success",
          )}
        >
          {room.players.length < MIN_PLAYERS ? "Waiting for more players..." : "Ready to start!"}
        </span>
        <span className="text-muted-foreground text-sm">
          {room.players.length} / {MAX_PLAYERS} players
        </span>
      </p>
    </div>
  );
}
