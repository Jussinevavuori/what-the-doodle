import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      toast.success("Copied to clipboard!", {
        description: text,
        icon: <CopyIcon />,
        descriptionClassName: "font-mono",
      });
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return { isCopied, copyToClipboard };
}
