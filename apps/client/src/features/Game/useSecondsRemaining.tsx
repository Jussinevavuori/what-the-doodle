import { useEffect, useState } from "react";

function calculateSecondsRemaining(until: Date | number) {
  const targetTime = until instanceof Date ? until.getTime() : until;
  const now = Date.now();
  return Math.max(0, Math.ceil((targetTime - now) / 1000));
}

export function useSecondsRemaining(until: Date | number) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    return calculateSecondsRemaining(until);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining(calculateSecondsRemaining(until));
    }, 500);
    return () => clearInterval(interval);
  }, [until]);

  return secondsRemaining;
}
