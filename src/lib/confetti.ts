/**
 * Thin wrappers around `canvas-confetti`. Exposed as imperative helpers
 * (not a component) so click handlers can fire bursts without dealing
 * with DOM refs or React state.
 *
 * Both helpers are no-ops when `window` is undefined, which keeps them
 * safe to call from server-rendered modules that later hydrate.
 */
import confetti from "canvas-confetti";

const BRAND_COLORS = [
  "#4b1d8c", // primary
  "#7a4ec7", // primary-light
  "#1fc9b6", // success / mint
  "#f4c542", // accent-yellow
  "#ef6e8f", // accent-pink
];

/** Small, focused burst used for micro-feedback on each tap. `origin`
 *  lets callers pin the burst to the element that was just pressed
 *  (screen coordinates normalized 0..1). */
export function spark(origin?: { x: number; y: number }): void {
  if (typeof window === "undefined") return;
  void confetti({
    particleCount: 30,
    spread: 55,
    startVelocity: 28,
    gravity: 1,
    ticks: 120,
    scalar: 0.7,
    origin: origin ?? { x: 0.5, y: 0.55 },
    colors: BRAND_COLORS,
    zIndex: 9999,
    disableForReducedMotion: true,
  });
}

/** Hero burst used when the owner confirms a promo. Two simultaneous
 *  cannons from the bottom corners cover the viewport with brand
 *  colors and quickly settle. */
export function celebrate(): void {
  if (typeof window === "undefined") return;
  const common = {
    particleCount: 90,
    spread: 75,
    startVelocity: 55,
    gravity: 0.95,
    ticks: 240,
    scalar: 1,
    colors: BRAND_COLORS,
    zIndex: 9999,
    disableForReducedMotion: true,
  } as const;

  void confetti({
    ...common,
    angle: 60,
    origin: { x: 0.1, y: 0.9 },
  });
  void confetti({
    ...common,
    angle: 120,
    origin: { x: 0.9, y: 0.9 },
  });
  setTimeout(() => {
    void confetti({
      ...common,
      particleCount: 60,
      spread: 110,
      origin: { x: 0.5, y: 0.7 },
    });
  }, 220);
}
