import { formatDuration } from "date-fns";

/**
 * Utility function to format seconds to a human-readable duration string,
 * e.g. "1 hour, 2 minutes, 3 seconds"
 */
export function formatSeconds(seconds: number | null | undefined) {
  if (!seconds) return "0 seconds";
  return formatDuration(
    {
      hours: Math.floor(seconds / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: seconds % 60,
    },
    { format: ["days", "hours", "minutes", "seconds"] },
  );
}
