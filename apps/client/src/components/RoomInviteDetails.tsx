import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/InputGroup";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { CheckIcon, CopyIcon } from "lucide-react";

export type RoomInviteDetailsProps = {
  roomId: string;
};

export function RoomInviteDetails(props: RoomInviteDetailsProps) {
  void props;

  const copy = useCopyToClipboard();

  return (
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground text-sm">Invite link</p>
      <InputGroup>
        <InputGroupInput className="font-mono" placeholder={window.location.href} readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Copy"
            title="Copy"
            size="icon-xs"
            onClick={() => copy.copyToClipboard(window.location.href)}
          >
            {copy.isCopied ? <CheckIcon /> : <CopyIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
