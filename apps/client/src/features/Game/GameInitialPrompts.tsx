import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { UserIdAtom } from "@/stores/UserIdAtom";
import type { RoomDTO } from "@wtd/shared/schemas";
import { useAtom } from "@xstate/store/react";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { WebSocketClient } from "../WebSocket/WebSocketClient";

export type GameInitialPromptsProps = {
  room: RoomDTO;
};

export function GameInitialPrompts(props: GameInitialPromptsProps) {
  const [input, setInput] = useState("");

  const userId = useAtom(UserIdAtom);

  const suggestions = userId ? props.room.game.initialPrompts[userId] || [] : [];

  const submittedPrompt = props.room.game.drawings[0]?.find((_) => _.drawerId === userId)?.prompt;

  if (submittedPrompt) {
    return (
      <div className="flex flex-col items-center gap-8 rounded-xl border border-slate-200 bg-white p-8 shadow-xl">
        <Loader2Icon />
        <h1 className="text-xl font-semibold">You have submitted your prompt.</h1>
        <Input readOnly placeholder={submittedPrompt} className="text-center" />
        <p className="opacity-50">Please wait for other players to submit theirs.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-xl font-bold tracking-tight">Select your initial prompt</h1>
        <p className="text-center text-sm opacity-50">You will draw this prompt first</p>
      </div>

      <div className="flex flex-col gap-2">
        {suggestions.map((prompt) => (
          <Button
            onClick={() => {
              WebSocketClient.send({
                type: "SELECT_INITIAL_PROMPT",
                roomId: props.room.id,
                prompt,
              });
            }}
            key={prompt}
            size="xl"
            className="justify-between"
            variant="white"
          >
            {prompt}
            <ArrowRightIcon />
          </Button>
        ))}
      </div>

      <p className="text-center text-sm opacity-50">Or come up with your own:</p>

      <form
        className="flex w-full flex-row gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
        style={{ width: "min(90vw, 560px)" }}
        onSubmit={(e) => {
          e.preventDefault();

          if (input.trim().length < 3) {
            toast("Prompt must be at least 3 characters long.");
            return;
          }

          WebSocketClient.send({
            type: "SELECT_INITIAL_PROMPT",
            roomId: props.room.id,
            prompt: input,
          });
        }}
      >
        <Input
          placeholder="Your own prompt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
