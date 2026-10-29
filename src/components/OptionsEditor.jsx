"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  Shuffle,
  RotateCcw,
  MoreHorizontal,
  Bookmark,
  AlertCircle,
  X,
} from "lucide-react";
import { getSegmentColor } from "@/utils/wheelColors";
import ConfirmModal from "./ConfirmModal";

export default function OptionsEditor({
  options = [],
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onShuffleOptions,
  onResetOptions,
  onClearOptions,
  onOpenSaveModal,
  isSpinning = false,
  maxOptions = 20,
  minOptions = 2,
}) {
  const [newOptionText, setNewOptionText] = useState("");
  const [showClearModal, setShowClearModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close overflow menu on outside click or escape
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMenu]);

  const handleAdd = (e) => {
    e?.preventDefault();
    const trimmed = newOptionText.trim();
    if (!trimmed || options.length >= maxOptions || isSpinning) return;

    onAddOption(trimmed);
    setNewOptionText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdd(e);
    }
  };

  const handleBlur = (index, rawValue) => {
    const trimmed = rawValue.trim();
    if (!trimmed) {
      onRemoveOption(index);
    } else {
      onUpdateOption(index, trimmed);
    }
  };

  const isAtMax = options.length >= maxOptions;
  const isBelowMin = options.length < minOptions;

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-4 sm:p-5 select-none overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-subtle shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-primary tracking-tight">
            Options
          </h2>
          <span
            id="options-count-badge"
            className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-elevated text-secondary border border-subtle"
          >
            {options.length} / {maxOptions}
          </span>
        </div>

        {/* Overflow Menu for Secondary Actions */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            id="options-overflow-menu-btn"
            onClick={() => setShowMenu((prev) => !prev)}
            disabled={isSpinning}
            className="p-1.5 rounded-lg border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong text-secondary hover:text-primary transition-colors btn-tactile disabled:opacity-40"
            title="More option actions"
            aria-label="Options Menu"
            aria-expanded={showMenu}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div
              role="menu"
              className="absolute right-0 mt-1.5 w-44 rounded-2xl border border-subtle bg-surface shadow-modal z-40 p-1 animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onShuffleOptions();
                  setShowMenu(false);
                }}
                disabled={options.length < 2 || isSpinning}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed text-left transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle Order</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onOpenSaveModal?.();
                  setShowMenu(false);
                }}
                disabled={options.length < 2 || isSpinning}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed text-left transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save to Collection</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onResetOptions();
                  setShowMenu(false);
                }}
                disabled={isSpinning}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 text-left transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <div className="my-1 border-t border-subtle" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setShowClearModal(true);
                  setShowMenu(false);
                }}
                disabled={options.length === 0 || isSpinning}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 text-left transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Options</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Validation banner: < 2 options */}
      {isBelowMin && (
        <div className="mt-2.5 p-2 rounded-xl bg-surface-elevated border border-subtle flex items-center gap-2 text-xs text-secondary shrink-0">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-muted" />
          <span>Add at least {minOptions} options to spin.</span>
        </div>
      )}

      {/* Add New Option Input Form */}
      <form onSubmit={handleAdd} className="mt-3 flex items-center gap-2 shrink-0">
        <div className="relative flex-1">
          <input
            type="text"
            id="new-option-input"
            value={newOptionText}
            onChange={(e) => setNewOptionText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isAtMax
                ? `Max ${maxOptions} options reached`
                : "Add an option..."
            }
            disabled={isAtMax || isSpinning}
            maxLength={35}
            className="w-full px-3 py-2 rounded-xl border border-subtle bg-surface-elevated text-primary placeholder:text-muted text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#B7A7D9] focus:border-transparent disabled:opacity-50 transition-all"
          />
        </div>
        <button
          type="submit"
          id="add-option-btn"
          disabled={!newOptionText.trim() || isAtMax || isSpinning}
          className="h-9 w-9 rounded-xl bg-primary-action hover:bg-primary-action-hover text-white flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed btn-tactile focus:outline-none focus:ring-2 focus:ring-[#B7A7D9]/40"
          title="Add option"
          aria-label="Add Option"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Internally Scrollable Options List (Never scrolls the page) */}
      <div className="mt-3 flex-1 min-h-0 overflow-y-auto pr-1 space-y-1.5">
        {options.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted text-xs">
            <span>No options yet.</span>
            <span className="text-[11px] mt-0.5">Type an option above and press Enter.</span>
          </div>
        ) : (
          options.map((opt, index) => {
            const color = getSegmentColor(index, options.length);
            return (
              <div
                key={`${index}-${opt}`}
                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong transition-all"
              >
                {/* Segment Color Dot */}
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: color }}
                  title={`Segment ${index + 1}`}
                />

                {/* Inline Editable Text Input */}
                <input
                  type="text"
                  value={opt}
                  disabled={isSpinning}
                  onChange={(e) => onUpdateOption(index, e.target.value)}
                  onBlur={(e) => handleBlur(index, e.target.value)}
                  maxLength={35}
                  className="flex-1 bg-transparent border-none text-xs font-medium text-primary focus:outline-none focus:ring-1 focus:ring-[#B7A7D9] rounded px-1 py-0.5"
                  aria-label={`Option ${index + 1}`}
                />

                {/* Remove button */}
                <button
                  type="button"
                  id={`remove-option-btn-${index}`}
                  onClick={() => onRemoveOption(index)}
                  disabled={isSpinning}
                  className="p-1 rounded-md text-muted hover:text-red-600 hover:bg-red-50 opacity-60 group-hover:opacity-100 transition-all disabled:opacity-20"
                  title="Remove option"
                  aria-label={`Remove ${opt}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Panel Footer */}
      <div className="pt-2 border-t border-subtle flex items-center justify-between text-[10px] text-muted shrink-0">
        <span>Click text to edit inline</span>
        <span>Drag or shuffle order</span>
      </div>

      {/* Clear All Confirmation Dialog */}
      <ConfirmModal
        isOpen={showClearModal}
        title="Clear all options?"
        message={`Are you sure you want to remove all ${options.length} options? This cannot be undone.`}
        confirmLabel="Yes, Clear All"
        cancelLabel="Keep Options"
        isDanger={true}
        onConfirm={() => {
          onClearOptions();
          setShowClearModal(false);
        }}
        onCancel={() => setShowClearModal(false)}
      />
    </div>
  );
}
