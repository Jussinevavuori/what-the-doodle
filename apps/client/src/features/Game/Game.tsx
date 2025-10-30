import { GameLayout } from "@/components/GameLayout";
import { HomeLayout } from "@/components/HomeLayout";
import type { RoomDTO } from "@wtd/shared/schemas";
import { GameDraw } from "./GameDraw";
import { GameFinale } from "./GameFinale";
import { GameGuess } from "./GameGuess";
import { GameInitialPrompts } from "./GameInitialPrompts";
import { Lobby } from "./Lobby";

export type GameProps = {
  room: RoomDTO;
};

export function Game(props: GameProps) {
  switch (props.room.game.state) {
    case "lobby": {
      return (
        <HomeLayout>
          <div className="flex w-full max-w-120 flex-col gap-8 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
            <Lobby room={props.room} />
          </div>
        </HomeLayout>
      );
    }

    case "selecting-initial-prompts": {
      return (
        <GameLayout>
          <GameInitialPrompts room={props.room} />
        </GameLayout>
      );
    }

    case "drawing": {
      return (
        <GameLayout>
          <GameDraw room={props.room} />
        </GameLayout>
      );
    }

    case "finale": {
      return (
        <GameLayout>
          <GameFinale room={props.room} />
        </GameLayout>
      );
    }

    case "guessing": {
      return (
        <GameLayout>
          <GameGuess room={props.room} />
        </GameLayout>
      );
    }

    default: {
      return (
        <HomeLayout>
          <div className="flex w-full max-w-120 flex-col gap-8 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
            <p>Unknown state: {props.room.game.state}</p>
          </div>
        </HomeLayout>
      );
    }
  }
}
