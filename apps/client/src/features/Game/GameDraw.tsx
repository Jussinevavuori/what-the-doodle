import { UserIdAtom } from "@/stores/UserIdAtom";
import { blobToBase64 } from "@/utils/generic/blobToBase64";
import type { RoomDTO } from "@wtd/shared/schemas";
import { useAtom } from "@xstate/store/react";
import { PenIcon } from "lucide-react";
import { Canvas } from "../Drawing/Canvas";
import { optimizeClientSideFile } from "../Drawing/optimizeClientSideFile";
import { WebSocketClient } from "../WebSocket/WebSocketClient";
import { RoomClock } from "./RoomClock";

export type GameDrawProps = {
  room: RoomDTO;
};

export function GameDraw(props: GameDrawProps) {
  const userId = useAtom(UserIdAtom);

  const drawing = props.room.game.drawings[props.room.game.currentRound]?.find(
    (_) => _.drawerId === userId,
  );

  if (!drawing) return <p>No drawing found for you in this round.</p>;

  return (
    <div className="fixed inset-8 rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <p className="border-brand-500 shadow-brand-500/10 bg-brand absolute top-0 left-4 z-10 flex -translate-y-1/2 items-center gap-2 rounded-md border px-2 py-1 text-white shadow-lg">
        <PenIcon />
        <span className="text-sm">Draw!</span>
        <span className="text-sm">·</span>
        <span className="font-medium">{drawing.prompt}</span>
      </p>

      <RoomClock room={props.room} className="absolute top-0 right-4 z-10 -translate-y-1/2" />

      <Canvas
        className="absolute inset-0"
        onDraw={async (jpgBlob) => {
          WebSocketClient.send({
            type: "SUBMIT_DRAWING",
            roomId: props.room.id,
            drawingId: drawing.id,
            jpgBase64: await blobToBase64(
              // Make sure to optimize the image before sending
              await optimizeClientSideFile(jpgBlob, { maxDim: 360 }),
            ),
          });
        }}
        debounceOnDrawMs={2000}
      />
    </div>
  );
}
