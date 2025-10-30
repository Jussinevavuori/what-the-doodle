import { PlayerStore } from "@/stores/PlayerStore";
import { generateRoomName } from "@/utils/generic/generateRoomName";
import { focusQuerySelector } from "@/utils/ui/focusQuerySelector";
import { useRouter } from "@tanstack/react-router";
import { useSelector } from "@xstate/store/react";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./Button";
import { Input } from "./Input";

export function RoomForm() {
  const name = useSelector(PlayerStore, (_) => _.context.name);

  const [roomId, setRoomId] = useState<string>("");

  const router = useRouter();

  function canJoinRoom(room: string) {
    if (!room.trim()) {
      toast.warning("Please enter a room number to join a game");
      focusQuerySelector('input[name="room"]');
      return false;
    }
    if (name.trim() === "") {
      toast.warning("Please set your nickname before joining a room");
      focusQuerySelector('input[name="nickname"]');
      return false;
    }
    return true;
  }

  function cleanRoomId(room: string) {
    return room.trim().toLowerCase().split("/").pop() || "";
  }

  function handleCreateRoom() {
    const generatedRoomId = generateRoomName();
    if (canJoinRoom(generatedRoomId)) {
      router.navigate({ to: "/r/$roomId", params: { roomId: cleanRoomId(generatedRoomId) } });
    }
  }

  function handleJoinRoom() {
    if (canJoinRoom(roomId)) {
      if (roomId.trim() === "") return;
      router.navigate({ to: "/r/$roomId", params: { roomId: cleanRoomId(roomId) } });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Button variant="brand" onClick={handleCreateRoom}>
        <PlusIcon />
        Create new game
      </Button>

      <p className="text-center text-sm opacity-50">Or join an existing game</p>

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleJoinRoom();
        }}
      >
        <Input
          type="text"
          placeholder="Enter room name"
          value={roomId}
          name="room"
          onChange={(e) => setRoomId(e.target.value.trim().toLowerCase())}
        />
        <Button variant="brand" onClick={handleJoinRoom}>
          Join
          <ArrowRightIcon />
        </Button>
      </form>
    </div>
  );
}
