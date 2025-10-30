import FloodFill from "q-floodfill";
import { useEffect, useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { imageDataToJpg } from "./imageDataToJpg";

type DrawingTool = "brush" | "paint-bucket";

const DEFAULT_TOOL: DrawingTool = "brush";
const DEFAULT_BRUSH_SIZE = 10;
const DEFAULT_COLOR = "#000000";

// Flood fill: https://stackoverflow.com/questions/2106995/how-can-i-perform-flood-fill-with-html-canvas/56221940#56221940

function getBrushCursor(color: string) {
  function getSvg() {
    const BRUSH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brush-icon lucide-brush"><path d="m11 10 3 3" fill="#ffffff"/><path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z" fill="#ffffff"/><path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031" fill="#ffffff"/></svg>`;
    if (color === "#000000" || color === "#ffffff") return BRUSH_SVG;
    return BRUSH_SVG.replace(/#ffffff/g, color);
  }
  return `url('data:image/svg+xml;utf8,${encodeURIComponent(getSvg())}') 0 24, auto`;
}

function getPaintBucketSvg(color: string) {
  function getSvg() {
    const PAINT_BUCKET_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paint-bucket-icon lucide-paint-bucket"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" fill="#ffffff"/><path d="m5 2 5 5" fill="#ffffff"/><path d="M2 13h15" fill="#ffffff"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z" fill="#ffffff"/></svg>`;
    if (color === "#000000" || color === "#ffffff") return PAINT_BUCKET_SVG;
    return PAINT_BUCKET_SVG.replace(/#ffffff/g, color);
  }
  return `url('data:image/svg+xml;utf8,${encodeURIComponent(getSvg())}') 24 24, auto`;
}

const CURSORS = {
  brush: getBrushCursor,
  "paint-bucket": getPaintBucketSvg,
};

const MAX_HISTORY_LENGTH = 64;

export type UserDrawableCanvasOptions = {
  onDraw?: (jpg: Blob) => void;
  debounceOnDrawMs?: number;
};

export function useDrawableCanvas(options: UserDrawableCanvasOptions = {}) {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas2dContextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Currently selected settings
  const [selectedTool, setSelectedTool] = useState<DrawingTool>(DEFAULT_TOOL);
  const [selectedBrushSize, setSelectedBrushSize] = useState<number>(DEFAULT_BRUSH_SIZE);
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_COLOR);

  // Debounced onDraw callback
  const didDraw = useDebounceCallback(async () => {
    // Check if onDraw is provided
    if (!options.onDraw) return;

    // Get canvas and ctx
    const canvas = canvasRef.current;
    const ctx = canvas2dContextRef.current;
    if (!canvas || !ctx) return;

    // Convert to JPG blob and call onDraw
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const blob = await imageDataToJpg(imageData);
    options.onDraw(blob);
  }, options.debounceOnDrawMs || 500);

  // History
  const historyRef = useRef<ImageData[]>([]);

  function selectTool(tool: DrawingTool) {
    setSelectedTool(tool);

    // Update cursor
    if (canvasRef.current) {
      canvasRef.current.style.cursor = CURSORS[tool](selectedColor);
    }
  }

  function selectBrushSize(size: number) {
    setSelectedBrushSize(size);

    // Apply to context if available
    if (canvas2dContextRef.current) {
      canvas2dContextRef.current.lineWidth = size;
    }
  }

  // Color selector
  function selectColor(color: string) {
    setSelectedColor(color);

    // Apply to context if available
    if (canvas2dContextRef.current) {
      canvas2dContextRef.current.strokeStyle = color;
    }

    // Update cursor
    if (canvasRef.current) {
      canvasRef.current.style.cursor = CURSORS[selectedTool](color);
    }
  }

  // Clear canvas
  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas2dContextRef.current;
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Record current state to history
  function recordHistory() {
    const canvas = canvasRef.current;
    const ctx = canvas2dContextRef.current;
    if (!canvas || !ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(imgData);

    // Limit history to max length
    if (historyRef.current.length > MAX_HISTORY_LENGTH) {
      historyRef.current.shift();
    }
  }

  // Undo
  function undo() {
    const canvas = canvasRef.current;
    const ctx = canvas2dContextRef.current;
    if (!canvas || !ctx) return;

    const history = historyRef.current;
    if (history.length === 0) return;

    // Pop last state
    const lastState = history.pop()!;

    if (lastState) {
      // Restore
      ctx.putImageData(lastState, 0, 0);
    } else {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /**
   * Setup canvas 2D context and resizing
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get 2D context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Setup canvas size for high-DPI displays
    const resize = () => {
      // Save current canvas content
      const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;

      // Update canvas size
      canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

      // Initialize context settings
      setTimeout(() => {
        // Setup drawing settings
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = selectedBrushSize;
        canvas.style.touchAction = "none"; // Disable touch scrolling
        canvas.style.cursor = CURSORS[selectedTool](selectedColor);

        // Restore content centered (crop if necessary)
        if (oldWidth > 0 && oldHeight > 0) {
          const offsetX = (canvas.width - oldWidth) / 2;
          const offsetY = (canvas.height - oldHeight) / 2;
          ctx.putImageData(currentImageData, offsetX, offsetY);
        }
      }, 0);
    };

    // Observe size changes
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Initial resizing
    resize();

    // Initialize with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save context
    canvas2dContextRef.current = ctx;

    // Cleanup function
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Brush handlers
  useEffect(() => {
    // Requirements
    const canvas = canvasRef.current;
    const ctx = canvas2dContextRef.current;
    if (!canvas || !ctx) return;

    // Only setup if brush is selected
    if (selectedTool !== "brush") return;

    // Drawing state
    let isDrawing = false;

    // Utility to get position from event
    const posFromEvent = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    // Setup event handlers
    const start = (e: PointerEvent) => {
      recordHistory();

      isDrawing = true;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      const pos = posFromEvent(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };
    const move = (e: PointerEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const p = posFromEvent(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    };
    const stop = (e: PointerEvent) => {
      e.preventDefault();
      if (isDrawing) {
        const p = posFromEvent(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {}

        // Trigger onDraw callback
        didDraw();
        isDrawing = false;
      }
    };

    // Attach event listeners
    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);
    canvas.addEventListener("pointerleave", stop);

    // Cleanup function
    return function cleanup() {
      canvas.removeEventListener("pointerdown", start);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", stop);
      canvas.removeEventListener("pointercancel", stop);
      canvas.removeEventListener("pointerleave", stop);
    };
  }, [selectedTool]);

  // Flood fill handlers
  useEffect(() => {
    // Requirements
    const canvas = canvasRef.current;
    const ctx = canvas2dContextRef.current;
    if (!canvas || !ctx) return;

    // Only setup if paint bucket is selected
    if (selectedTool !== "paint-bucket") return;

    // Flood fill handler using q-floodfill
    const handleFill = (e: PointerEvent) => {
      recordHistory();

      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const x = Math.floor((e.clientX - r.left) * dpr);
      const y = Math.floor((e.clientY - r.top) * dpr);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const floodFill = new FloodFill(imgData);
      floodFill.fill(String(ctx.strokeStyle), x, y, 0);
      ctx.putImageData(floodFill.imageData, 0, 0);

      // Trigger onDraw callback
      didDraw();
    };

    // Setup event handlers
    canvas.addEventListener("pointerdown", handleFill);

    // Cleanup function
    return function cleanup() {
      canvas.removeEventListener("pointerdown", handleFill);
    };
  }, [selectedTool]);

  return {
    canvasRef,

    selectedTool,
    selectTool,

    selectedBrushSize,
    selectBrushSize,

    selectedColor,
    selectColor,

    clearCanvas,

    undo,
  };
}
