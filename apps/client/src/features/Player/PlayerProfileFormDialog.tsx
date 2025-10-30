import { Button } from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/Dialog";
import { PlayerStore } from "@/stores/PlayerStore";
import { useSelector } from "@xstate/store/react";
import { useState } from "react";
import { PlayerProfileForm } from "./PlayerProfileForm";

export type PlayerProfileFormDialogProps = {
  children?: React.ReactNode;
  asChild?: boolean;

  forceOpenWhileUnnamed?: boolean;
};

export function PlayerProfileFormDialog(props: PlayerProfileFormDialogProps) {
  const playerName = useSelector(PlayerStore, (_) => _.context.name);

  const shouldForceOpen = props.forceOpenWhileUnnamed && !playerName.trim();
  const [isOpen, setIsOpen] = useState(shouldForceOpen);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(shouldForceOpen || open)}>
      {props.children && <DialogTrigger asChild={props.asChild}>{props.children}</DialogTrigger>}
      <DialogContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setIsOpen(shouldForceOpen || false);
          }}
        >
          <DialogHeader>
            <PlayerProfileForm />
          </DialogHeader>
          <DialogFooter>
            <Button className="w-full" type="submit" disabled={shouldForceOpen}>
              Ok
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
