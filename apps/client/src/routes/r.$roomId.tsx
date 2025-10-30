import { HomeLayout } from "@/components/HomeLayout";
import { Game } from "@/features/Game/Game";
import { GameConnector } from "@/features/Game/GameConnector";
import { RoomAtom } from "@/stores/RoomAtom";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "@xstate/store/react";
import { Loader2Icon } from "lucide-react";

export const Route = createFileRoute("/r/$roomId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = Route.useParams();

  const room = useAtom(RoomAtom);

  return (
    <>
      {room ? (
        <Game room={room} />
      ) : (
        <HomeLayout>
          <div className="flex w-full max-w-120 flex-col gap-8 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
            <Loader2Icon className="mx-auto my-16" />
          </div>
        </HomeLayout>
      )}
      <GameConnector roomId={roomId} />
    </>
  );
}
