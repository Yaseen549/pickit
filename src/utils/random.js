/**
 * Cryptographically secure random integer generator.
 * Uses window.crypto.getRandomValues with fallback to Math.random.
 *
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer between min and max
 */
export function getSecureRandomInt(min, max) {
  if (min === max) return min;
  const range = max - min + 1;

  if (
    typeof window !== "undefined" &&
    window.crypto &&
    typeof window.crypto.getRandomValues === "function"
  ) {
    const uint32 = new Uint32Array(1);
    // Unbiased rejection sampling for exact uniform distribution
    const maxUint32 = 0xffffffff;
    const limit = maxUint32 - (maxUint32 % range);
    let randomVal;

    do {
      window.crypto.getRandomValues(uint32);
      randomVal = uint32[0];
    } while (randomVal >= limit);

    return min + (randomVal % range);
  }

  // Fallback if crypto is unavailable
  return Math.floor(Math.random() * range) + min;
}

/**
 * Returns a secure random float between min (inclusive) and max (exclusive).
 */
export function getSecureRandomFloat(min = 0, max = 1) {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    typeof window.crypto.getRandomValues === "function"
  ) {
    const uint32 = new Uint32Array(1);
    window.crypto.getRandomValues(uint32);
    const normalized = uint32[0] / (0xffffffff + 1);
    return min + normalized * (max - min);
  }
  return min + Math.random() * (max - min);
}
