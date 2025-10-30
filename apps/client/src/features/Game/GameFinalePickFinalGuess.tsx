import { Button } from "@/components/Button";
import { shootConfetti } from "@/utils/ui/shootConfetti";
import type { DrawingDTO } from "@wtd/shared/schemas";
import { ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";

export type GameFinalePickFinalGuessProps = {
  finalDrawings: DrawingDTO[];
  ownThreadIndex?: number;
  onGuessSelected: (threadIndex: number) => void;
};

export function GameFinalePickFinalGuess(props: GameFinalePickFinalGuessProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-bold tracking-tight">Find your initial prompt</h1>
        <p className="text-center text-sm opacity-50">
          Guess which one of these guesses was based on your original prompt
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {props.finalDrawings.map((drawing) => (
          <Button
            key={drawing.drawerId}
            onClick={() => {
              if (drawing.threadIndex === props.ownThreadIndex) {
                toast.success("You have selected your own drawing!");
                shootConfetti({});
                props.onGuessSelected(drawing.threadIndex);
              } else {
                toast.error("That's not yours! Try again.");
              }
            }}
            size="xl"
            className="justify-between"
            variant="white"
          >
            {drawing.guess}
            <ArrowRightIcon />
          </Button>
        ))}
      </div>
    </div>
  );
}
