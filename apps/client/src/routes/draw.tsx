import { GameLayout } from "@/components/GameLayout";
import { Canvas } from "@/features/Drawing/Canvas";
import { createFileRoute } from "@tanstack/react-router";
import { PenIcon } from "lucide-react";

export const Route = createFileRoute("/draw")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <GameLayout>
      <div className="fixed inset-8 rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <p className="border-brand-500 shadow-brand-500/10 bg-brand absolute top-0 left-4 z-10 flex -translate-y-1/2 items-center gap-2 rounded-md border px-2 py-1 text-white shadow-lg">
          <PenIcon />
          <span className="text-sm">Draw!</span>
        </p>

        <Canvas
          className="absolute inset-0"
          onDraw={async (jpgBlob) => {}}
          debounceOnDrawMs={5000}
        />
      </div>
    </GameLayout>
  );
}
