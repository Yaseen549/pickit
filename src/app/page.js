"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import DecisionWheel from "@/components/DecisionWheel";
import OptionsEditor from "@/components/OptionsEditor";
import MobileOptionsSheet from "@/components/MobileOptionsSheet";
import ConfirmModal from "@/components/ConfirmModal";
import WinnerModal from "@/components/WinnerModal";
import SavedWheelsModal from "@/components/SavedWheelsModal";
import { DEFAULT_OPTIONS, PRESETS } from "@/data/presets";
import { useWheel } from "@/hooks/useWheel";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/utils/storage";
import { SlidersHorizontal } from "lucide-react";

const EMPTY_SAVED_WHEELS = [];

export default function Home() {
  // Persistent active choices in LocalStorage
  const [options, setOptions] = useLocalStorage(
    STORAGE_KEYS.CURRENT_OPTIONS,
    DEFAULT_OPTIONS
  );

  // Persistent sound preference
  const [soundEnabled, setSoundEnabled] = useLocalStorage(
    STORAGE_KEYS.SOUND_ENABLED,
    false
  );

  // Persistent saved wheels in LocalStorage
  const [savedWheels, setSavedWheels] = useLocalStorage(
    STORAGE_KEYS.SAVED_WHEELS,
    EMPTY_SAVED_WHEELS
  );

  const [activePresetId, setActivePresetId] = useState("food-picker");
  const [pendingPreset, setPendingPreset] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showSavedWheelsModal, setShowSavedWheelsModal] = useState(false);
  const [showMobileOptionsSheet, setShowMobileOptionsSheet] = useState(false);

  // Sound effects synthesizer
  const { playTick, playWinChime } = useSoundEffects(soundEnabled);

  // Handle spin completion
  const handleSpinComplete = useCallback(
    (result) => {
      playWinChime();
      setShowWinnerModal(true);
    },
    [playWinChime]
  );

  // Wheel physics state machine
  const {
    rotationAngle,
    pointerKick,
    isSpinning,
    isDragging,
    winner,
    setWinner,
    spin,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    setRotationAngle,
  } = useWheel({
    options,
    onTick: playTick,
    onSpinComplete: handleSpinComplete,
  });

  // Spacebar keyboard listener to trigger spin
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag === "input" || activeTag === "textarea") return;

        e.preventDefault();
        if (
          !showWinnerModal &&
          !showSavedWheelsModal &&
          !pendingPreset &&
          !showMobileOptionsSheet
        ) {
          spin();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    spin,
    showWinnerModal,
    showSavedWheelsModal,
    pendingPreset,
    showMobileOptionsSheet,
  ]);

  // Options management
  const handleAddOption = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed || options.length >= 20 || isSpinning) return;
      setOptions((prev) => [...prev, trimmed]);
      setActivePresetId(null);
      setWinner(null);
    },
    [options.length, isSpinning, setOptions, setWinner]
  );

  const handleUpdateOption = useCallback(
    (index, value) => {
      if (isSpinning) return;
      setOptions((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
      setActivePresetId(null);
      setWinner(null);
    },
    [isSpinning, setOptions, setWinner]
  );

  const handleRemoveOption = useCallback(
    (index) => {
      if (isSpinning) return;
      setOptions((prev) => prev.filter((_, i) => i !== index));
      setActivePresetId(null);
      setWinner(null);
    },
    [isSpinning, setOptions, setWinner]
  );

  const handleRemoveWinner = useCallback(
    (winnerText) => {
      if (isSpinning) return;
      setOptions((prev) => {
        const index = prev.indexOf(winnerText);
        if (index === -1) return prev;
        return prev.filter((_, i) => i !== index);
      });
      setWinner(null);
      setRotationAngle(0);
    },
    [isSpinning, setOptions, setWinner, setRotationAngle]
  );

  const handleShuffleOptions = useCallback(() => {
    if (isSpinning || options.length < 2) return;
    setOptions((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
    setWinner(null);
  }, [isSpinning, options.length, setOptions, setWinner]);

  const handleResetOptions = useCallback(() => {
    if (isSpinning) return;
    setOptions(DEFAULT_OPTIONS);
    setActivePresetId("food-picker");
    setWinner(null);
    setRotationAngle(0);
  }, [isSpinning, setOptions, setWinner, setRotationAngle]);

  const handleClearOptions = useCallback(() => {
    if (isSpinning) return;
    setOptions([]);
    setActivePresetId(null);
    setWinner(null);
  }, [isSpinning, setOptions, setWinner]);

  // Preset Selection with overwrite protection
  const applyPreset = useCallback(
    (preset) => {
      setOptions(preset.options);
      setActivePresetId(preset.id);
      setWinner(null);
      setRotationAngle(0);
    },
    [setOptions, setWinner, setRotationAngle]
  );

  const handleSelectPreset = useCallback(
    (preset) => {
      if (isSpinning) return;
      const isCustomized =
        options.length !== preset.options.length ||
        options.some((opt, i) => opt !== preset.options[i]);

      if (isCustomized && options.length > 0 && activePresetId !== preset.id) {
        setPendingPreset(preset);
      } else {
        applyPreset(preset);
      }
    },
    [isSpinning, options, activePresetId, applyPreset]
  );

  // Saved wheels actions
  const handleSaveCurrentWheel = useCallback(
    (name) => {
      if (options.length < 2) return;
      const newWheel = {
        id: `wheel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        name: name.trim() || "My Saved Wheel",
        options: [...options],
        createdAt: new Date().toISOString(),
      };

      setSavedWheels((prev) => [newWheel, ...(Array.isArray(prev) ? prev : [])]);
    },
    [options, setSavedWheels]
  );

  const handleLoadSavedWheel = useCallback(
    (savedWheel) => {
      if (isSpinning) return;
      setOptions(savedWheel.options);
      setActivePresetId(null);
      setWinner(null);
      setRotationAngle(0);
    },
    [isSpinning, setOptions, setWinner, setRotationAngle]
  );

  const handleRenameSavedWheel = useCallback(
    (id, newName) => {
      setSavedWheels((prev) =>
        prev.map((w) => (w.id === id ? { ...w, name: newName } : w))
      );
    },
    [setSavedWheels]
  );

  const handleDeleteSavedWheel = useCallback(
    (id) => {
      setSavedWheels((prev) => prev.filter((w) => w.id !== id));
    },
    [setSavedWheels]
  );

  const activePresetName = useMemo(() => {
    const found = PRESETS.find((p) => p.id === activePresetId);
    return found ? found.name : "Custom Wheel";
  }, [activePresetId]);

  return (
    <div className="h-screen h-dvh w-full overflow-hidden flex flex-col bg-app text-primary select-none">
      {/* 1. Slim Header (56px) */}
      <Header
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onOpenSavedWheels={() => setShowSavedWheelsModal(true)}
        savedWheelsCount={savedWheels.length}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* 2. Main Workspace (Single Viewport Layout) */}
      <main className="flex-1 min-h-0 w-full max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row gap-4 sm:gap-5 items-stretch overflow-hidden">
        {/* Left Column (Desktop / Tablet): Options Panel */}
        <section
          aria-label="Options Panel"
          className="hidden md:flex w-full md:w-[320px] lg:w-[340px] h-full min-h-0 flex-col rounded-2xl border border-subtle bg-surface shadow-soft overflow-hidden shrink-0"
        >
          <OptionsEditor
            options={options}
            onAddOption={handleAddOption}
            onUpdateOption={handleUpdateOption}
            onRemoveOption={handleRemoveOption}
            onShuffleOptions={handleShuffleOptions}
            onResetOptions={handleResetOptions}
            onClearOptions={handleClearOptions}
            onOpenSaveModal={() => setShowSavedWheelsModal(true)}
            isSpinning={isSpinning}
            maxOptions={20}
            minOptions={2}
          />
        </section>

        {/* Right Column (Desktop) / Primary View (Mobile): Decision Wheel Stage */}
        <section
          aria-label="Decision Wheel Stage"
          className="flex-1 h-full min-h-0 flex flex-col rounded-2xl border border-subtle bg-surface shadow-soft overflow-hidden relative"
        >
          <DecisionWheel
            options={options}
            rotationAngle={rotationAngle}
            pointerKick={pointerKick}
            isSpinning={isSpinning}
            isDragging={isDragging}
            winner={winner}
            onSpin={spin}
            onRemoveWinner={handleRemoveWinner}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          />

          {/* Mobile Bottom Action: Edit Options Button (< 768px) */}
          <div className="md:hidden pb-3 pt-1 px-4 shrink-0 flex justify-center">
            <button
              type="button"
              id="mobile-edit-options-btn"
              onClick={() => setShowMobileOptionsSheet(true)}
              disabled={isSpinning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-subtle bg-surface-elevated text-xs font-semibold text-secondary hover:text-primary btn-tactile focus:outline-none focus:ring-2 focus:ring-[#B7A7D9]/40"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Options ({options.length})</span>
            </button>
          </div>
        </section>
      </main>

      {/* 3. Mobile Options Sheet (< 768px) */}
      <MobileOptionsSheet
        isOpen={showMobileOptionsSheet}
        onClose={() => setShowMobileOptionsSheet(false)}
        options={options}
        onAddOption={handleAddOption}
        onUpdateOption={handleUpdateOption}
        onRemoveOption={handleRemoveOption}
        onShuffleOptions={handleShuffleOptions}
        onResetOptions={handleResetOptions}
        onClearOptions={handleClearOptions}
        onOpenSaveModal={() => {
          setShowMobileOptionsSheet(false);
          setShowSavedWheelsModal(true);
        }}
        isSpinning={isSpinning}
        maxOptions={20}
        minOptions={2}
      />

      {/* 4. Saved Wheels Collection Modal */}
      <SavedWheelsModal
        isOpen={showSavedWheelsModal}
        onClose={() => setShowSavedWheelsModal(false)}
        savedWheels={savedWheels}
        onSaveCurrentWheel={handleSaveCurrentWheel}
        onLoadWheel={handleLoadSavedWheel}
        onRenameWheel={handleRenameSavedWheel}
        onDeleteWheel={handleDeleteSavedWheel}
        currentOptions={options}
        activePresetName={activePresetName}
      />

      {/* 5. Winner Celebration Modal */}
      <WinnerModal
        isOpen={showWinnerModal}
        winner={winner}
        optionCount={options.length}
        onClose={() => setShowWinnerModal(false)}
        onSpinAgain={() => {
          setShowWinnerModal(false);
          setTimeout(() => {
            spin();
          }, 150);
        }}
        onRemoveWinner={handleRemoveWinner}
      />

      {/* 6. Preset Overwrite Confirmation Dialog */}
      <ConfirmModal
        isOpen={pendingPreset !== null}
        title="Load preset wheel?"
        message={`Loading "${pendingPreset?.name}" will replace your current wheel choices. Would you like to proceed?`}
        confirmLabel="Load Preset"
        cancelLabel="Keep Current"
        isDanger={false}
        onConfirm={() => {
          if (pendingPreset) {
            applyPreset(pendingPreset);
            setPendingPreset(null);
          }
        }}
        onCancel={() => setPendingPreset(null)}
      />
    </div>
  );
}
