import { Button } from "@/components/Button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/utils/ui/cn";
import { CheckIcon, CopyIcon } from "lucide-react";

export type LobbyRoomNameHeaderProps = {
  className?: string;
  roomId: string;
};

export function LobbyRoomNameHeader(props: LobbyRoomNameHeaderProps) {
  const copy = useCopyToClipboard();

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border bg-white px-2 py-1",
        props.className,
      )}
    >
      <span className="text-muted-foreground text-sm">Room</span>
      <span className="text-sm font-medium">{props.roomId}</span>
      <Button
        className="-mr-1 size-7"
        variant="ghost"
        aria-label="Copy"
        title="Copy"
        size="icon"
        onClick={() => copy.copyToClipboard(props.roomId)}
      >
        {copy.isCopied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
      </Button>
    </div>
  );
}
