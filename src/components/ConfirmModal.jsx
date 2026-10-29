"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = false,
  onConfirm,
  onCancel,
}) {
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    cancelBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm p-5 sm:p-6 rounded-3xl border border-subtle bg-surface shadow-modal relative flex flex-col gap-4 text-left animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-elevated transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
              isDanger
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-surface-elevated text-secondary border-subtle"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3
              id="confirm-modal-title"
              className="text-sm sm:text-base font-bold text-primary tracking-tight"
            >
              {title}
            </h3>
            <p className="text-xs text-secondary mt-0.5 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-subtle">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 rounded-xl border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong text-xs font-semibold text-secondary hover:text-primary btn-tactile focus:outline-none focus:ring-2 focus:ring-[#B7A7D9]/40"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs btn-tactile focus:outline-none focus:ring-2 ${
              isDanger
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500/40"
                : "bg-primary-action hover:bg-primary-action-hover focus:ring-[#B7A7D9]/40"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
