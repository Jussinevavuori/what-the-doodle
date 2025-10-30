import type { DrawingDTO } from "@wtd/shared/schemas";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { WebSocketClient } from "../WebSocket/WebSocketClient";

export type DrawingViewerProps = {
  roomId: string;
  drawing: DrawingDTO;
};

export function DrawingViewer(props: DrawingViewerProps) {
  const drawingId = props.drawing.id;

  /**
   * The JPEG image data in Base64 format (undefined = loading, null = not available).
   */
  const [jpgBase64, setJpgBase64] = useState<string | null | undefined>(undefined);

  /**
   * Request the drawing image from the server if not already available
   */
  useEffect(() => {
    WebSocketClient.send({
      type: "REQUEST_DRAWING",
      roomId: props.roomId,
      drawingId: drawingId,
    });
  }, [drawingId, props.roomId]);

  /**
   * Handle incoming drawing data messages
   */
  useEffect(() => {
    WebSocketClient.on("DRAWING_DATA", (message) => {
      if (message.drawingId === props.drawing.id && message.roomId === props.roomId) {
        setJpgBase64(message.jpgBase64);
      }
    });
  }, [drawingId, props.roomId]);

  return (
    <div className="flex size-[min(95vw,600px)] items-center justify-center rounded-md border bg-white p-2 shadow">
      {jpgBase64 === undefined && <Loader2Icon />}
      {jpgBase64 && (
        <img
          src={`data:image/jpeg;base64,${jpgBase64}`}
          alt="Player's drawing"
          className="mx-auto rounded-xl"
        />
      )}
    </div>
  );
}
