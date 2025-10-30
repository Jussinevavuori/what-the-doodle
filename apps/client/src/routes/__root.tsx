import { StatePersistor } from "@/components/StatePersistor";
import { Toaster } from "@/components/Toaster";
import { PlayerJoinEmitter } from "@/features/Player/PlayerJoinEmitter";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />

      <StatePersistor />
      <PlayerJoinEmitter />
      <Toaster />

      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
});
