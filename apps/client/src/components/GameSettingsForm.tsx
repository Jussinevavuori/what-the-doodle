import { WebSocketClient } from "@/features/WebSocket/WebSocketClient";
import { RoomAtom } from "@/stores/RoomAtom";
import { formatSeconds } from "@/utils/format/formatSeconds";
import { useAtom } from "@xstate/store/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./InputGroup";

export type GameSettingsFormProps = {
  roomId: string;
};

const DRAWING_TIME_STEPS = [5, 15, 30, 60, 90, 120];
const DEFAULT_DRAWING_TIME_INDEX = 2; // 60 seconds

export function GameSettingsForm(props: GameSettingsFormProps) {
  const room = useAtom(RoomAtom);

  const drawingTimeSeconds =
    room?.game?.drawingTimeSeconds || DRAWING_TIME_STEPS[DEFAULT_DRAWING_TIME_INDEX];

  function setDrawingTimeSeconds(seconds: number) {
    if (!room) return;
    WebSocketClient.send({
      type: "UPDATE_GAME_SETTINGS",
      roomId: props.roomId,
      drawingTimeSeconds: seconds,
    });
  }

  function increaseDrawingTime() {
    setDrawingTimeSeconds(
      Math.min(
        DRAWING_TIME_STEPS.find((t) => t > drawingTimeSeconds) ||
          DRAWING_TIME_STEPS[DRAWING_TIME_STEPS.length - 1],
        DRAWING_TIME_STEPS[DRAWING_TIME_STEPS.length - 1],
      ),
    );
  }

  function decreaseDrawingTime() {
    setDrawingTimeSeconds(
      Math.max(
        [...DRAWING_TIME_STEPS].reverse().find((t) => t < drawingTimeSeconds) ||
          DRAWING_TIME_STEPS[0],
        DRAWING_TIME_STEPS[0],
      ),
    );
  }

  return (
    <div>
      <div>
        <label className="text-muted-foreground text-sm">Drawing time</label>
        <InputGroup>
          <InputGroupInput
            className="text-center tabular-nums"
            placeholder={formatSeconds(drawingTimeSeconds)}
          />
          <InputGroupAddon align="inline-start">
            <InputGroupButton onClick={decreaseDrawingTime} variant="secondary" size="icon-xs">
              <MinusIcon />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={increaseDrawingTime} variant="secondary" size="icon-xs">
              <PlusIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
