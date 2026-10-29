/**
 * Resilient LocalStorage utilities for PickIt
 */

export const STORAGE_KEYS = {
  CURRENT_OPTIONS: "pickit_current_options",
  SAVED_WHEELS: "pickit_saved_wheels",
  THEME: "pickit_theme",
  SOUND_ENABLED: "pickit_sound_enabled",
  ACTIVE_PRESET_ID: "pickit_active_preset_id",
};

/**
 * Safely reads a value from LocalStorage with JSON parsing and fallback.
 */
export function getStoredItem(key, fallbackValue) {
  if (typeof window === "undefined") return fallbackValue;
  try {
    const item = window.localStorage.getItem(key);
    if (item === null || item === undefined) return fallbackValue;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`[PickIt Storage] Error reading key "${key}":`, err);
    return fallbackValue;
  }
}

/**
 * Safely writes a value to LocalStorage with JSON serialization.
 */
export function setStoredItem(key, value) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[PickIt Storage] Error writing key "${key}":`, err);
    return false;
  }
}

/**
 * Safely removes an item from LocalStorage.
 */
export function removeStoredItem(key) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`[PickIt Storage] Error removing key "${key}":`, err);
    return false;
  }
}
