import { StatePersistor } from "@/components/StatePersistor";
import { Toaster } from "@/components/Toaster";
import { PlayerJoinEmitter } from "@/features/Player/PlayerJoinEmitter";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />

      <StatePersistor />
      <PlayerJoinEmitter />
      <Toaster />
    </>
  ),
});
