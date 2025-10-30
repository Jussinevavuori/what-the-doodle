import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { UserIdAtom } from "@/stores/UserIdAtom";
import type { RoomDTO } from "@wtd/shared/schemas";
import { useAtom } from "@xstate/store/react";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DrawingViewer } from "../Drawing/DrawingViewer";
import { WebSocketClient } from "../WebSocket/WebSocketClient";

export type GameGuessProps = {
  room: RoomDTO;
};

export function GameGuess(props: GameGuessProps) {
  const [input, setInput] = useState("");

  const userId = useAtom(UserIdAtom);

  const drawing = props.room.game.drawings[props.room.game.currentRound]?.find(
    (_) => _.guesserId === userId,
  );

  if (!drawing) return <p>Drawing not foud.</p>;

  const submittedGuess = drawing.guess;

  if (submittedGuess) {
    return (
      <div className="flex flex-col items-center gap-8 rounded-xl border border-slate-200 bg-white p-8 shadow-xl">
        <Loader2Icon />
        <h1 className="text-xl font-semibold">You have submitted your guess.</h1>
        <Input readOnly placeholder={submittedGuess} className="text-center" />
        <p className="opacity-50">Please wait for other players to submit theirs.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-bold tracking-tight">Guess what the drawing is</h1>
        <p className="text-center text-sm opacity-50">
          The next person will draw based on your guess!
        </p>
      </div>

      <form
        className="flex flex-row gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
        style={{ width: "min(90vw, 560px)" }}
        onSubmit={(e) => {
          e.preventDefault();

          if (input.trim().length < 3) {
            toast("Guess must be at least 3 characters long.");
            return;
          }

          WebSocketClient.send({
            type: "GUESS",
            roomId: props.room.id,
            guess: input.trim(),
          });
        }}
      >
        <Input
          placeholder="Your guess..."
          maxLength={80}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>

      <DrawingViewer roomId={props.room.id} drawing={drawing} />
    </div>
  );
}
