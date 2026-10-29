"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getStoredItem, setStoredItem } from "@/utils/storage";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);
  const initialValueRef = useRef(initialValue);

  // Initialize from LocalStorage once mounted on client
  useEffect(() => {
    const stored = getStoredItem(key, initialValueRef.current);
    setValue((prev) => {
      // Avoid unnecessary state update if values are structurally identical
      try {
        if (JSON.stringify(prev) === JSON.stringify(stored)) {
          return prev;
        }
      } catch {
        // Fallback to updating if JSON serialization fails
      }
      return stored;
    });
    setIsInitialized(true);
  }, [key]);

  // Persist updates to LocalStorage
  const setStoredValue = useCallback(
    (newValue) => {
      setValue((prev) => {
        const resolvedValue =
          typeof newValue === "function" ? newValue(prev) : newValue;
        setStoredItem(key, resolvedValue);
        return resolvedValue;
      });
    },
    [key]
  );

  return [value, setStoredValue, isInitialized];
}
