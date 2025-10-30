import { Button } from "@/components/Button";
import { UserIdAtom } from "@/stores/UserIdAtom";
import type { RoomDTO } from "@wtd/shared/schemas";
import { useAtom } from "@xstate/store/react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { DrawingViewer } from "../Drawing/DrawingViewer";
import { PlayerAvatar } from "../Player/PlayerAvatar";
import { GameFinalePickFinalGuess } from "./GameFinalePickFinalGuess";
import { NewGameButton } from "./NewGameButton";

export type GameFinaleProps = {
  room: RoomDTO;
};

export function GameFinale(props: GameFinaleProps) {
  const userId = useAtom(UserIdAtom);

  const [selectedThreadIndex, setSelectedThreadIndex] = useState<number | null>(null);

  const ownThreadIndex = props.room.game.drawings[0]?.find(
    (d) => d.drawerId === userId,
  )?.threadIndex;

  const finalDrawings = props.room.game.drawings[props.room.game.drawings.length - 1];

  if (selectedThreadIndex === null) {
    return (
      <GameFinalePickFinalGuess
        finalDrawings={finalDrawings}
        ownThreadIndex={ownThreadIndex}
        onGuessSelected={(threadIndex) => setSelectedThreadIndex(threadIndex)}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-9">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="white"
          onClick={() =>
            setSelectedThreadIndex(
              (_) => (selectedThreadIndex - 1 + finalDrawings.length) % finalDrawings.length,
            )
          }
        >
          <ArrowLeftIcon />
          Previous
        </Button>
        <NewGameButton roomId={props.room.id} />
        <Button
          variant="white"
          onClick={() => setSelectedThreadIndex((selectedThreadIndex + 1) % finalDrawings.length)}
        >
          Next
          <ArrowRightIcon />
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {props.room.game.drawings.map((roundDrawings, roundIndex) => {
          const drawing = roundDrawings.find((_) => _.threadIndex === selectedThreadIndex);

          if (!drawing) return <p key={roundIndex}>Missing</p>;

          const guesser = props.room.players.find((p) => p.id === drawing.guesserId);
          const drawer = props.room.players.find((p) => p.id === drawing.drawerId);

          return (
            <Fragment key={roundIndex}>
              {roundIndex === 0 ? (
                <div className="flex flex-row items-center gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <PlayerAvatar size={60} player={drawer || null} />
                  <div>
                    <p className="text-muted-foreground text-sm">Selected the initial guess</p>
                    <p className="font-medium">{drawing.prompt}</p>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="flex flex-row items-center gap-4">
                  <PlayerAvatar size={60} player={drawer || null} />
                  <div>
                    <p className="text-muted-foreground text-sm">Drew</p>
                    <p className="font-medium">{drawing.prompt}</p>
                  </div>
                </div>

                <DrawingViewer roomId={props.room.id} drawing={drawing} />
              </div>

              <div className="flex flex-row items-center gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <PlayerAvatar size={60} player={guesser || null} />
                <div>
                  <p className="text-muted-foreground text-sm">Guessed</p>
                  <p className="font-medium">{drawing.guess}</p>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
