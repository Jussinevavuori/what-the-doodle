import { Button } from "@/components/Button";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { cn } from "@/utils/ui/cn";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BrushIcon,
  PaintBucketIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import type { UserDrawableCanvasOptions } from "./useDrawableCanvas";
import { useDrawableCanvas } from "./useDrawableCanvas";

export type CanvasProps = {
  className?: string;
} & UserDrawableCanvasOptions;

const BRUSH_SIZE_OPTIONS = [2, 10, 20, 30];
const COLOR_OPTIONS = [
  "#000000", // black
  "#64748b", // gray
  "#ffffff", // white
  "#ef4444", // red
  "#f59e0b", // amber
  "#fde68a", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#854d0e", // brown
];
const COLOR_SHORTCUTS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+"];

export function Canvas({ className, ...drawableCanvasOptions }: CanvasProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    canvasRef,
    selectBrushSize,
    selectColor,
    selectTool,
    selectedBrushSize,
    selectedColor,
    selectedTool,
    clearCanvas,
    undo,
  } = useDrawableCanvas(drawableCanvasOptions);

  const selectedBrushSizeIndex = BRUSH_SIZE_OPTIONS.indexOf(selectedBrushSize);
  const selectedColorIndex = COLOR_OPTIONS.indexOf(selectedColor);

  function selectNextColor() {
    selectColor(COLOR_OPTIONS[(selectedColorIndex + 1) % COLOR_OPTIONS.length]);
  }

  function selectPreviousColor() {
    selectColor(
      COLOR_OPTIONS[(selectedColorIndex - 1 + COLOR_OPTIONS.length) % COLOR_OPTIONS.length],
    );
  }

  function selectLargerBrushSize() {
    selectBrushSize(BRUSH_SIZE_OPTIONS[(selectedBrushSizeIndex + 1) % BRUSH_SIZE_OPTIONS.length]);
  }

  function selectSmallerBrushSize() {
    selectBrushSize(
      BRUSH_SIZE_OPTIONS[
        (selectedBrushSizeIndex - 1 + BRUSH_SIZE_OPTIONS.length) % BRUSH_SIZE_OPTIONS.length
      ],
    );
  }

  // Shortcuts
  useKeyboardShortcut(() => selectTool("brush"), [{ key: "b" }]);
  useKeyboardShortcut(() => selectTool("paint-bucket"), [{ key: "f" }]);
  useKeyboardShortcut(selectNextColor, [{ key: "ArrowRight" }]);
  useKeyboardShortcut(selectPreviousColor, [{ key: "ArrowLeft" }]);
  useKeyboardShortcut(selectSmallerBrushSize, [{ key: "ArrowUp" }]);
  useKeyboardShortcut(selectLargerBrushSize, [{ key: "ArrowDown" }]);
  useKeyboardShortcut(
    undo,
    [
      { key: "z", ctrlKey: true },
      { key: "z", metaKey: true },
    ],
    { preventDefault: true },
  );
  for (let i = 0; i < COLOR_SHORTCUTS.length; i++) {
    const key = COLOR_SHORTCUTS[i];
    useKeyboardShortcut(() => selectColor(COLOR_OPTIONS[i]), [{ key }]);
  }

  return (
    <div className={className}>
      <canvas className="h-full w-full rounded-2xl bg-white" ref={canvasRef} />

      <div className="absolute top-1/2 left-0 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
        {/* Tool: Brush */}
        <Button
          variant={selectedTool === "brush" ? "brand" : "white"}
          onClick={() => selectTool("brush")}
          className={cn(
            "relative size-10 rounded-full transition",
            selectedTool === "brush" ? "shadow-brand-500/50 rotate-360 shadow-lg" : "shadow-md",
          )}
        >
          <BrushIcon />
          <span
            className={cn(
              "text-muted-foreground absolute -right-1 -bottom-1 z-10 flex size-4 items-center justify-center rounded-full border bg-white font-mono text-xs font-semibold transition",
              selectedTool === "brush" ? "scale-0 opacity-0" : "",
              isDesktop ? "" : "hidden",
            )}
          >
            B
          </span>
        </Button>

        {/* Tool: Paint bucket */}
        <Button
          variant={selectedTool === "paint-bucket" ? "brand" : "white"}
          onClick={() => selectTool("paint-bucket")}
          className={cn(
            "relative size-10 rounded-full transition",
            selectedTool === "paint-bucket"
              ? "shadow-brand-500/50 rotate-360 shadow-lg"
              : "shadow-md",
          )}
        >
          <PaintBucketIcon />
          <span
            className={cn(
              "text-muted-foreground absolute -right-1 -bottom-1 z-10 flex size-4 items-center justify-center rounded-full border bg-white font-mono text-xs font-semibold transition",
              selectedTool === "paint-bucket" ? "scale-0 opacity-0" : "",
              isDesktop ? "" : "hidden",
            )}
          >
            F
          </span>
        </Button>

        {/* Separator */}
        <div />

        {/* Undo */}
        <Button
          variant="white"
          className={cn("relative size-10 rounded-full shadow-md transition")}
          onClick={undo}
        >
          <UndoIcon />
        </Button>

        {/* Clear */}
        <Button
          variant="white"
          className={cn("relative size-10 rounded-full shadow-md transition")}
          onClick={clearCanvas}
        >
          <TrashIcon />
        </Button>
      </div>

      <div className="absolute top-1/2 right-0 z-10 flex translate-x-1/2 -translate-y-1/2 flex-col flex-wrap items-center gap-4">
        <Button
          onClick={selectSmallerBrushSize}
          variant="white"
          className={cn("size-6 rounded-full shadow-md", isDesktop ? "" : "hidden")}
        >
          <ArrowUpIcon />
        </Button>
        {BRUSH_SIZE_OPTIONS.map((size) => (
          <Button
            key={size}
            variant={selectedBrushSize === size ? "brand" : "white"}
            onClick={() => selectBrushSize(size)}
            className={cn(
              "size-10 rounded-full transition",
              selectedBrushSize === size ? "shadow-brand-500/50 rotate-360 shadow-lg" : "shadow-md",
            )}
          >
            <div className="absolute rounded-full bg-black" style={{ width: size, height: size }} />
          </Button>
        ))}
        <Button
          onClick={selectLargerBrushSize}
          variant="white"
          className={cn("size-6 rounded-full shadow-md", isDesktop ? "" : "hidden")}
        >
          <ArrowDownIcon />
        </Button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex max-w-screen translate-y-4 flex-wrap items-center justify-center gap-4">
        <Button
          onClick={selectPreviousColor}
          variant="white"
          className={cn("size-6 rounded-full shadow-md", isDesktop ? "" : "hidden")}
        >
          <ArrowLeftIcon />
        </Button>
        {COLOR_OPTIONS.map((color, colorIndex) => (
          <Button
            key={color}
            variant={selectedColor === color ? "brand" : "white"}
            onClick={() => selectColor(color)}
            className={cn(
              "size-10 rotate-0 rounded-full",
              selectedColor === color ? "shadow-brand-500/50 shadow-lg" : "shadow-md",
            )}
          >
            <div
              className="absolute size-4 rounded-full bg-black shadow-md shadow-black/50"
              style={{ backgroundColor: color }}
            />
            {COLOR_SHORTCUTS[colorIndex] && (
              <span className="text-muted-foreground absolute -right-1 -bottom-1 z-10 flex size-4 items-center justify-center rounded-full border bg-white font-mono text-xs font-semibold">
                {COLOR_SHORTCUTS[colorIndex]}
              </span>
            )}
          </Button>
        ))}
        <Button
          onClick={selectNextColor}
          variant="white"
          className={cn("size-6 rounded-full shadow-md", isDesktop ? "" : "hidden")}
        >
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
