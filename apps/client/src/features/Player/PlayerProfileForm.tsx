import { PlayerStore } from "@/stores/PlayerStore";
import { croodles } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useSelector } from "@xstate/store/react";
import { DicesIcon } from "lucide-react";
import { useRef } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

export function PlayerProfileForm() {
  const svgRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const seed = useSelector(PlayerStore, (_) => _.context.avatar);
  const name = useSelector(PlayerStore, (_) => _.context.name);

  /**
   * Regenerate avatar with spin animation
   */
  function handleRegenerateAvatar() {
    if (svgRef.current) {
      svgRef.current.style.animation = "none";
      svgRef.current.offsetHeight; // trigger reflow
      svgRef.current.style.animation = "spin 0.2s ease-in-out";
    }
    if (buttonRef.current) {
      buttonRef.current.style.animation = "none";
      buttonRef.current.offsetHeight; // trigger reflow
      buttonRef.current.style.animation = "spin 0.2s ease-in-out reverse";
    }
    setTimeout(() => {
      PlayerStore.trigger.newAvatar();
    }, 100);
  }

  /**
   * Get the avatar as SVG
   */
  const avatar = createAvatar(croodles, { seed });

  return (
    <div className="flex flex-col gap-2 pt-4">
      <div className="relative mx-auto w-full max-w-64 rounded-full border p-8">
        <div ref={svgRef} dangerouslySetInnerHTML={{ __html: avatar.toString() }} />
        <Button
          ref={buttonRef}
          onClick={handleRegenerateAvatar}
          size="icon"
          variant="outline"
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        >
          <DicesIcon />
        </Button>
      </div>

      <div className="z-10 mx-auto -mt-12 flex w-full max-w-36 flex-col gap-1">
        <Input
          type="text"
          id="nickname"
          name="nickname"
          maxLength={12}
          value={name}
          onChange={(e) => PlayerStore.trigger.setName({ name: e.target.value })}
          placeholder="Enter nickname"
          className="text-center"
        />
      </div>
    </div>
  );
}
