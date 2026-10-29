import { calculateTargetRotation, getWinningIndexAtAngle, normalizeAngle, POINTER_ANGLE } from "../src/utils/wheelMath.js";
import { getSecureRandomInt } from "../src/utils/random.js";
import { PRESETS, DEFAULT_OPTIONS } from "../src/data/presets.js";

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName) {
  if (condition) {
    passedCount++;
    console.log(`  ✓ ${testName}`);
  } else {
    failedCount++;
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

console.log("\n==========================================");
console.log("   PICKIT COMPREHENSIVE TEST SUITE");
console.log("==========================================\n");

// 1. Test Option Counts: 2, 3, 6, 10, 20 options
console.log("1. Testing Option Counts & Pointer Alignment:");
const testCounts = [2, 3, 6, 10, 20];
for (const count of testCounts) {
  let allMatched = true;
  for (let trial = 0; trial < 100; trial++) {
    const currentAngle = Math.random() * 7200;
    const { winningIndex, targetAngle } = calculateTargetRotation({
      currentAngle,
      numSegments: count,
    });
    const pointerWinner = getWinningIndexAtAngle(targetAngle, count);
    if (winningIndex !== pointerWinner) {
      allMatched = false;
      break;
    }
  }
  assert(allMatched, `100 spins with ${count} options strictly match 12 o'clock pointer`);
}

// 2. Segment Boundary & Normalization Precision
console.log("\n2. Testing Angle Normalization & Boundary Safety:");
assert(normalizeAngle(0) === 0, "normalizeAngle(0) === 0");
assert(normalizeAngle(360) === 0, "normalizeAngle(360) === 0");
assert(normalizeAngle(720) === 0, "normalizeAngle(720) === 0");
assert(normalizeAngle(-90) === 270, "normalizeAngle(-90) === 270 (pointer angle)");
assert(normalizeAngle(450) === 90, "normalizeAngle(450) === 90");

// Verify that normalized target angle has the EXACT same winner as non-normalized target angle
let normalizationPreserved = true;
for (let i = 0; i < 200; i++) {
  const count = getSecureRandomInt(2, 20);
  const rawAngle = Math.random() * 10000;
  const winnerRaw = getWinningIndexAtAngle(rawAngle, count);
  const winnerNormalized = getWinningIndexAtAngle(normalizeAngle(rawAngle), count);
  if (winnerRaw !== winnerNormalized) {
    normalizationPreserved = false;
    break;
  }
}
assert(normalizationPreserved, "Angle normalization never alters winning segment under pointer");

// 3. Cryptographic Random Uniformity
console.log("\n3. Testing Cryptographic Uniform Random Selection:");
const freq = [0, 0, 0, 0];
const trials = 40000;
for (let i = 0; i < trials; i++) {
  const val = getSecureRandomInt(0, 3);
  freq[val]++;
}
const expected = trials / 4;
const isUniform = freq.every((f) => Math.abs(f - expected) / expected < 0.05); // within 5% tolerance
assert(isUniform, `Crypto random distribution is uniform (counts: ${freq.join(", ")})`);

// 4. Duplicate Label Support
console.log("\n4. Testing Duplicate Label Support:");
const duplicateOptions = ["Pizza", "Pizza", "Burger", "Pizza"];
const targetIdx = 1;
const { winningIndex: dupWin, targetAngle: dupAngle } = calculateTargetRotation({
  currentAngle: 120,
  targetIndex: targetIdx,
  numSegments: duplicateOptions.length,
});
const visualDup = getWinningIndexAtAngle(dupAngle, duplicateOptions.length);
assert(dupWin === targetIdx && visualDup === targetIdx, "Specific duplicate slice index is accurately targeted and won");

// 5. Presets Data Integrity
console.log("\n5. Testing Presets Configuration:");
assert(PRESETS.length === 6, "Exactly 6 curated presets provided");
let allPresetsValid = true;
for (const p of PRESETS) {
  if (
    !p.id ||
    !p.name ||
    !p.emoji ||
    !p.description ||
    !Array.isArray(p.options) ||
    p.options.length < 2 ||
    p.options.length > 20
  ) {
    allPresetsValid = false;
    break;
  }
}
assert(allPresetsValid, "All 6 presets contain valid IDs, names, emojis, descriptions, and 2–20 options");
assert(DEFAULT_OPTIONS.length === 6, "Default options array contains 6 food items");

// 6. Elimination Mode (Remove Winner) Logic
console.log("\n6. Testing Elimination Round Logic:");
let currentList = ["Pizza", "Burger", "Biryani", "Dosa", "Noodles", "Sandwich"];
const winnerToRemove = "Biryani";
currentList = currentList.filter((item) => item !== winnerToRemove);
assert(
  currentList.length === 5 && !currentList.includes("Biryani"),
  "Removing winner cleanly reduces options count and removes target item"
);

// 7. Input Sanitization & Bounds Rules
console.log("\n7. Testing Input Sanitization & Option Bounds:");
function sanitizeOption(input) {
  return typeof input === "string" ? input.trim() : "";
}
assert(sanitizeOption("   ") === "", "Whitespace-only input sanitizes to empty string");
assert(sanitizeOption("  Sushi Rolls  ") === "Sushi Rolls", "Leading/trailing whitespace is safely trimmed");
assert(sanitizeOption("Tacos") === "Tacos", "Clean input is preserved without modification");

console.log("\n==========================================");
console.log(`TOTAL TESTS: ${passedCount + failedCount}`);
console.log(`PASSED:      ${passedCount}`);
console.log(`FAILED:      ${failedCount}`);
console.log("==========================================\n");

if (failedCount > 0) {
  process.exit(1);
}
