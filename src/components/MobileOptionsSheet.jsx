"use client";

import { useEffect } from "react";
import { X, Check } from "lucide-react";
import OptionsEditor from "./OptionsEditor";

export default function MobileOptionsSheet({
  isOpen,
  onClose,
  options,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onShuffleOptions,
  onResetOptions,
  onClearOptions,
  onOpenSaveModal,
  isSpinning,
  maxOptions,
  minOptions,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-options-title"
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg h-[82vh] max-h-[82dvh] rounded-t-3xl sm:rounded-3xl border border-subtle bg-surface shadow-modal flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle & Header */}
        <div className="w-full pt-3 pb-2 px-5 flex items-center justify-between border-b border-subtle shrink-0">
          <div className="flex items-center gap-2">
            <h3 id="mobile-options-title" className="text-sm font-bold text-primary">
              Edit Choices
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-elevated text-secondary border border-subtle">
              {options.length} items
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-action text-white text-xs font-bold btn-tactile"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>

        {/* Embedded Options Editor */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <OptionsEditor
            options={options}
            onAddOption={onAddOption}
            onUpdateOption={onUpdateOption}
            onRemoveOption={onRemoveOption}
            onShuffleOptions={onShuffleOptions}
            onResetOptions={onResetOptions}
            onClearOptions={onClearOptions}
            onOpenSaveModal={onOpenSaveModal}
            isSpinning={isSpinning}
            maxOptions={maxOptions}
            minOptions={minOptions}
          />
        </div>
      </div>
    </div>
  );
}
