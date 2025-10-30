import { useEffect } from "react";
import { useWrapRef } from "./useWrapRef";

export type ShortcutTriggerDefinition = {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
};

/**
 * Utility hook for creating shortcuts
 */
export function useKeyboardShortcut(
  callback: () => void,
  shortcuts: ShortcutTriggerDefinition[],
  options?: {
    disabled?: boolean;
    preventDefault?: boolean;
    allowOnInputs?: boolean;
  },
) {
  const shortcutsRef = useWrapRef(shortcuts);
  const callbackRef = useWrapRef(callback);
  const optionsRef = useWrapRef(options);

  useEffect(() => {
    const ac = new AbortController();

    const handler = (e: KeyboardEvent) => {
      // Respect disabled option
      if (optionsRef.current?.disabled) return;

      // If currently focused on an input or textarea, ignore shortcut (unless allowOnInputs is true)
      const isInputTarget =
        e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (isInputTarget && !optionsRef.current?.allowOnInputs) return;

      // Find matching shortcut
      const matchedShortcut = shortcutsRef.current.find((shortcut) => {
        // Match key (or code)
        if (
          shortcut.key.toLowerCase() !== e.key.toLowerCase() &&
          shortcut.key.toLowerCase() !== e.code.toLowerCase()
        ) {
          return false;
        }

        // Match all required modifier keys
        if (shortcut.altKey && !e.altKey) return false;
        if (shortcut.ctrlKey && !e.ctrlKey) return false;
        if (shortcut.metaKey && !e.metaKey) return false;
        if (shortcut.shiftKey && !e.shiftKey) return false;

        // All checks passed, return true
        return true;
      });

      // Did not match, abort
      if (!matchedShortcut) return;

      // If matched shortcut found, run callback and apply options
      if (optionsRef.current?.preventDefault) e.preventDefault();
      callbackRef.current();
    };

    document.addEventListener("keydown", handler, { signal: ac.signal });
    return () => ac.abort();
  }, [shortcutsRef, callbackRef, optionsRef]);
}
