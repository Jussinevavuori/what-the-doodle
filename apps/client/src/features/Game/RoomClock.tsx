import { cn } from "@/utils/ui/cn";
import type { RoomDTO } from "@wtd/shared/schemas";
import { TimerIcon } from "lucide-react";
import { useSecondsRemaining } from "./useSecondsRemaining";

export type RoomClockProps = {
  room: RoomDTO;
  className?: string;
};

export function RoomClock(props: RoomClockProps) {
  const secondsRemaining = useSecondsRemaining(
    (props.room.game.stateChangedAt || Date.now()) + props.room.game.drawingTimeSeconds * 1000,
  );

  if (props.room.game.state !== "drawing") return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 shadow-md",
        props.className,
      )}
    >
      <TimerIcon />
      <span className="text-sm tabular-nums">
        {
          // Minutes
          Math.floor(secondsRemaining / 60)
        }
        :
        {
          // Seconds
          (secondsRemaining % 60).toString().padStart(2, "0")
        }
      </span>
    </div>
  );
}
