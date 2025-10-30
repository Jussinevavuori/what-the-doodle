import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/AlertDialog";
import { Button } from "@/components/Button";
import { RefreshCcwIcon } from "lucide-react";
import { WebSocketClient } from "../WebSocket/WebSocketClient";

export type NewGameButtonProps = {
  roomId: string;
};

export function NewGameButton(props: NewGameButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="white">
          <RefreshCcwIcon />
          New game
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm new game?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to start a new game? This will end the current game for all
            players.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              WebSocketClient.send({ type: "NEW_GAME", roomId: props.roomId });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
