import type JsConfettiType from "js-confetti";

export type ShootConfettiOptions = Parameters<JsConfettiType["addConfetti"]>[0];

export async function shootConfetti(options: ShootConfettiOptions) {
  // Dynamically import js-confetti to reduce bundle size
  const { default: JsConfetti } = await import("js-confetti");

  const jsConfetti = new JsConfetti();
  await jsConfetti.addConfetti(options);
}
