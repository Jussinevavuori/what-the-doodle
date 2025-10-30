import { HomeConnector } from "@/components/HomeConnector";
import { HomeLayout } from "@/components/HomeLayout";
import { RoomForm } from "@/components/RoomForm";
import { PlayerProfileForm } from "@/features/Player/PlayerProfileForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <HomeLayout>
        <div className="flex w-full max-w-120 flex-col gap-8 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
          <PlayerProfileForm />
          <RoomForm />
        </div>
      </HomeLayout>

      <HomeConnector />
    </>
  );
}
