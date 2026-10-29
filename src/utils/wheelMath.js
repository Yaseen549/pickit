import { getSecureRandomInt, getSecureRandomFloat } from "./random.js";

export const POINTER_ANGLE = 270; // 12 o'clock position (in degrees)

/**
 * Normalizes any degree angle to the range [0, 360)
 */
export function normalizeAngle(angle) {
  const mod = angle % 360;
  return mod < 0 ? mod + 360 : mod;
}

/**
 * Returns the angular size in degrees of each segment for a given count
 */
export function getSegmentArc(numSegments) {
  if (numSegments <= 0) return 0;
  return 360 / numSegments;
}

/**
 * Given any wheel rotation angle, analytically determines which segment
 * index is directly under the top pointer (at 270 degrees).
 */
export function getWinningIndexAtAngle(rotationAngle, numSegments) {
  if (numSegments <= 0) return 0;
  const arc = getSegmentArc(numSegments);
  const normalizedRotation = normalizeAngle(rotationAngle);
  // Pointer is at 270 degrees in global space.
  // In the wheel's local space rotated by rotationAngle:
  const localPointerAngle = normalizeAngle(POINTER_ANGLE - normalizedRotation);
  const index = Math.floor(localPointerAngle / arc);
  return Math.min(numSegments - 1, Math.max(0, index));
}

/**
 * Calculates the exact target rotation to land on a chosen segment.
 *
 * @param {Object} params
 * @param {number} params.currentAngle - The current wheel rotation angle in degrees
 * @param {number} [params.targetIndex] - Optional explicit target index (otherwise randomly chosen)
 * @param {number} params.numSegments - Total number of segments (2–20)
 * @param {number} [params.minFullRotations=5] - Minimum complete spins for suspense
 * @param {number} [params.maxFullRotations=7] - Maximum complete spins
 * @returns {Object} { winningIndex, targetAngle, totalRotationDelta, duration }
 */
export function calculateTargetRotation({
  currentAngle,
  targetIndex = null,
  numSegments,
  minFullRotations = 5,
  maxFullRotations = 7,
}) {
  if (numSegments <= 0) {
    return { winningIndex: 0, targetAngle: currentAngle, totalRotationDelta: 0, duration: 4500 };
  }

  const arc = getSegmentArc(numSegments);

  // 1. Uniformly select winning index if not explicitly provided
  const winningIndex =
    targetIndex !== null && targetIndex >= 0 && targetIndex < numSegments
      ? targetIndex
      : getSecureRandomInt(0, numSegments - 1);

  // 2. Calculate slice center angle in wheel's local coordinates
  const segmentCenterAngle = winningIndex * arc + arc / 2;

  // 3. Add a safe random jitter inside the segment (within 70% interior of slice)
  // This prevents the pointer from unnaturally landing on the exact center every spin,
  // while strictly guaranteeing it never lands on the boundary line.
  const safeJitterRange = arc * 0.35; // +/- 35% from center
  const jitter = getSecureRandomFloat(-safeJitterRange, safeJitterRange);
  const targetLocalAngle = segmentCenterAngle + jitter;

  // 4. Calculate the required final rotation angle modulo 360
  // Formula: (targetLocalAngle + finalRotation) % 360 = POINTER_ANGLE (270)
  // => finalRotation % 360 = (POINTER_ANGLE - targetLocalAngle) % 360
  const requiredLandingAngle = normalizeAngle(POINTER_ANGLE - targetLocalAngle);

  // 5. Calculate forward delta from current rotation angle
  const currentNormalized = normalizeAngle(currentAngle);
  let forwardDelta = normalizeAngle(requiredLandingAngle - currentNormalized);

  // Ensure positive forward momentum (at least 30 degrees of partial rotation)
  if (forwardDelta < 30) {
    forwardDelta += 360;
  }

  // 6. Add full revolutions for suspension and deceleration
  const fullRotations = getSecureRandomInt(minFullRotations, maxFullRotations);
  const totalRotationDelta = fullRotations * 360 + forwardDelta;
  const targetAngle = currentAngle + totalRotationDelta;

  // 7. Dynamic duration based on total rotation distance
  const duration = 4600 + (fullRotations - minFullRotations) * 350;

  return {
    winningIndex,
    targetAngle,
    totalRotationDelta,
    duration,
  };
}

/**
 * Quartic Ease-Out curve for realistic mechanical deceleration
 * Starts with high momentum, glides, and gently settles to a stop.
 */
export function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Quintic Ease-Out curve for extra smooth finish
 */
export function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}
