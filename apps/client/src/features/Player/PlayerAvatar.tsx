import { UserIdAtom } from "@/stores/UserIdAtom";
import { cn } from "@/utils/ui/cn";
import { croodles } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import type { PlayerDTO } from "@wtd/shared/schemas";
import { useAtom } from "@xstate/store/react";

export type PlayerAvatarProps = {
  player: PlayerDTO | null;
  size?: number;
  className?: string;
  children?: React.ReactNode;
};

export function PlayerAvatar(props: PlayerAvatarProps) {
  const userId = useAtom(UserIdAtom);

  const isSelf = props.player?.id === userId;

  // Get the avatar as SVG
  const avatar = createAvatar(croodles, { seed: props.player?.avatar });

  return (
    <div
      style={{
        width: props.size || 80,
        height: props.size || 80,
      }}
      className={cn(
        "relative mb-2 rounded-full border",
        isSelf ? "border-brand-500" : "border-success-500",
        props.className,
      )}
    >
      {props.children}

      {props.player !== null && (
        <div
          style={{ padding: (props.size || 80) * 0.1 }}
          dangerouslySetInnerHTML={{ __html: avatar.toString() }}
        />
      )}

      <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2">
        <p className="rounded border bg-white px-1 text-xs font-medium whitespace-nowrap">
          {props.player ? props.player.name : "Unknown"}
        </p>
      </div>

      {
        // Self indicator
        isSelf && (
          <>
            <div className="bg-brand-500 absolute top-1.5 right-1.5 size-3 rounded-full border-2 border-white" />
            <div className="bg-brand-500 absolute top-1.5 right-1.5 size-3 animate-ping rounded-full border-2 border-white" />
          </>
        )
      }

      {
        // Online indicator for other players
        !isSelf && (
          <>
            <div className="bg-success-500 absolute top-1.5 right-1.5 size-3 rounded-full border-2 border-white" />
            <div className="bg-success-500 absolute top-1.5 right-1.5 size-3 animate-ping rounded-full border-2 border-white" />
          </>
        )
      }
    </div>
  );
}
