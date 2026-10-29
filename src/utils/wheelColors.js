// 20 Curated Harmonious Segment Colors
// Specially selected to maintain aesthetic cohesion and high contrast with white labels
export const WHEEL_COLORS = [
  "#7C3AED", // Violet
  "#EC4899", // Pink
  "#2563EB", // Blue
  "#059669", // Emerald
  "#D97706", // Amber
  "#0891B2", // Cyan
  "#EA580C", // Orange
  "#65A30D", // Lime
  "#4F46E5", // Indigo
  "#0D9488", // Teal
  "#C026D3", // Fuchsia
  "#CA8A04", // Yellow
  "#E11D48", // Rose
  "#0284C7", // Sky
  "#16A34A", // Green
  "#9333EA", // Purple
  "#B45309", // Warm Amber
  "#0F766E", // Deep Teal
  "#BE185D", // Dark Pink
  "#4338CA", // Deep Indigo
];

export function getSegmentColor(index, total) {
  // Use modulo for wrap-around
  return WHEEL_COLORS[index % WHEEL_COLORS.length];
}
