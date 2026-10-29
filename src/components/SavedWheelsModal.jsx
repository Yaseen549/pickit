"use client";

import { useState, useEffect } from "react";
import {
  Bookmark,
  X,
  Play,
  Pencil,
  Check,
  Trash2,
  Plus,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";

export default function SavedWheelsModal({
  isOpen,
  onClose,
  savedWheels = [],
  onSaveCurrentWheel,
  onLoadWheel,
  onRenameWheel,
  onDeleteWheel,
  currentOptions = [],
  activePresetName = "",
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [deletePendingWheel, setDeletePendingWheel] = useState(null);
  const [newWheelName, setNewWheelName] = useState("");
  const [isSavingNew, setIsSavingNew] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditingId(null);
      setDeletePendingWheel(null);
      setIsSavingNew(false);
      setNewWheelName(activePresetName || "My Custom Wheel");
    }
  }, [isOpen, activePresetName]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStartRename = (wheel) => {
    setEditingId(wheel.id);
    setEditingName(wheel.name);
  };

  const handleSaveRename = (id) => {
    const trimmed = editingName.trim();
    if (trimmed) {
      onRenameWheel(id, trimmed);
    }
    setEditingId(null);
  };

  const handleConfirmSaveNew = (e) => {
    e?.preventDefault();
    const trimmed = newWheelName.trim();
    if (!trimmed || currentOptions.length < 2) return;

    onSaveCurrentWheel(trimmed);
    setIsSavingNew(false);
    setNewWheelName("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-wheels-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[80vh] max-h-[80dvh] p-5 sm:p-6 rounded-3xl border border-subtle bg-surface shadow-modal relative flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-subtle shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-surface-elevated border border-subtle flex items-center justify-center text-primary">
              <Bookmark className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h2
                id="saved-wheels-dialog-title"
                className="text-sm sm:text-base font-bold text-primary tracking-tight"
              >
                Saved Wheels
              </h2>
              <p className="text-[11px] text-secondary">
                {savedWheels.length} {savedWheels.length === 1 ? "wheel" : "wheels"} stored locally
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-elevated transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Save Current Wheel Action Bar */}
        <div className="py-3 border-b border-subtle shrink-0">
          {isSavingNew ? (
            <form onSubmit={handleConfirmSaveNew} className="flex items-center gap-2">
              <input
                type="text"
                value={newWheelName}
                onChange={(e) => setNewWheelName(e.target.value)}
                placeholder="Give your wheel a name..."
                maxLength={30}
                autoFocus
                className="flex-1 px-3 py-1.5 rounded-xl border border-subtle bg-surface-elevated text-primary text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#B7A7D9]"
              />
              <button
                type="submit"
                disabled={!newWheelName.trim()}
                className="px-3 py-1.5 rounded-xl bg-primary-action text-white text-xs font-bold btn-tactile disabled:opacity-40"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsSavingNew(false)}
                className="px-2.5 py-1.5 rounded-xl border border-subtle text-secondary hover:text-primary text-xs font-medium"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-secondary">
                Current: <strong className="text-primary">{currentOptions.length} options</strong>
              </span>
              <button
                type="button"
                id="save-current-wheel-btn"
                onClick={() => setIsSavingNew(true)}
                disabled={currentOptions.length < 2}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-action hover:bg-primary-action-hover text-white text-xs font-bold btn-tactile disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Current Wheel</span>
              </button>
            </div>
          )}
        </div>

        {/* Wheels List (Internally Scrollable) */}
        <div className="flex-1 min-h-0 overflow-y-auto py-2.5 space-y-2">
          {savedWheels.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center gap-2">
              <p className="text-xs font-bold text-primary">No saved wheels yet</p>
              <p className="text-[11px] text-muted max-w-xs">
                Save your customized wheels to easily switch between your favorite decision lists.
              </p>
            </div>
          ) : (
            savedWheels.map((wheel) => {
              const isEditing = editingId === wheel.id;
              return (
                <div
                  key={wheel.id}
                  className="p-3 rounded-2xl border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong transition-all flex items-center justify-between gap-2.5 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveRename(wheel.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            maxLength={30}
                            autoFocus
                            className="px-2 py-0.5 rounded-lg border border-subtle bg-surface text-primary text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#B7A7D9]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRename(wheel.id)}
                            className="p-1 rounded text-primary hover:bg-surface-elevated"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-primary truncate max-w-[140px] sm:max-w-[200px]">
                            {wheel.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleStartRename(wheel)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-muted hover:text-primary transition-opacity"
                            title="Rename"
                            aria-label={`Rename ${wheel.name}`}
                          >
                            <Pencil className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}

                      <span className="px-1.5 py-0.2 rounded-md text-[10px] font-semibold bg-surface-elevated text-secondary border border-subtle">
                        {wheel.options.length} options
                      </span>
                    </div>

                    {/* Chips preview */}
                    <div className="flex flex-wrap gap-1">
                      {wheel.options.slice(0, 3).map((opt, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.2 rounded text-[10px] bg-surface-elevated text-muted truncate max-w-[80px]"
                        >
                          {opt}
                        </span>
                      ))}
                      {wheel.options.length > 3 && (
                        <span className="text-[10px] text-muted self-center">
                          +{wheel.options.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      id={`load-saved-wheel-${wheel.id}`}
                      onClick={() => {
                        onLoadWheel(wheel);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-primary-action hover:bg-primary-action-hover text-white text-xs font-bold flex items-center gap-1 btn-tactile"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Load</span>
                    </button>

                    <button
                      type="button"
                      id={`delete-saved-wheel-${wheel.id}`}
                      onClick={() => setDeletePendingWheel(wheel)}
                      className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete wheel"
                      aria-label={`Delete ${wheel.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-subtle flex items-center justify-between text-[10px] text-muted shrink-0">
          <span>Saved locally in browser</span>
          <span>100% private</span>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deletePendingWheel !== null}
        title="Delete saved wheel?"
        message={`Are you sure you want to delete "${deletePendingWheel?.name}"?`}
        confirmLabel="Yes, Delete"
        cancelLabel="Keep"
        isDanger={true}
        onConfirm={() => {
          if (deletePendingWheel) {
            onDeleteWheel(deletePendingWheel.id);
            setDeletePendingWheel(null);
          }
        }}
        onCancel={() => setDeletePendingWheel(null)}
      />
    </div>
  );
}
