import confetti from "canvas-confetti";

/**
 * Fires an elegant celebratory confetti burst.
 * Respects prefers-reduced-motion settings.
 */
export function fireWinnerConfetti() {
  if (typeof window === "undefined") return;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  // Harmonious celebratory colors matching PickIt palette
  const colors = ["#7C3AED", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

  try {
    // Left cannon
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 55,
      origin: { x: 0.15, y: 0.7 },
      colors,
      disableForReducedMotion: true,
      zIndex: 100,
    });

    // Right cannon
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 55,
      origin: { x: 0.85, y: 0.7 },
      colors,
      disableForReducedMotion: true,
      zIndex: 100,
    });

    // Center star burst
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 90,
        origin: { x: 0.5, y: 0.45 },
        colors,
        shapes: ["circle"],
        scalar: 0.9,
        disableForReducedMotion: true,
        zIndex: 100,
      });
    }, 200);
  } catch (err) {
    console.warn("[PickIt Confetti] Particle error:", err);
  }
}
