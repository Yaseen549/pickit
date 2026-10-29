"use client";

import { useEffect } from "react";
import { X, HelpCircle, ShieldCheck, Keyboard, Sparkles, Code, Star, ExternalLink } from "lucide-react";

export default function InfoModal({ isOpen, onClose }) {
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
      aria-labelledby="info-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6 rounded-3xl border border-subtle bg-surface shadow-modal relative flex flex-col gap-5 text-left animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-muted hover:text-primary hover:bg-surface-elevated transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-subtle flex items-center justify-center text-primary">
            <HelpCircle className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="info-modal-title" className="text-base font-bold text-primary">
                About PickIt
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-elevated text-secondary border border-subtle">
                Open Source
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Stop overthinking. Let fate decide.
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-3.5 text-xs text-secondary">
          {/* How it works */}
          <div className="p-3.5 rounded-2xl bg-surface-elevated border border-subtle space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>How It Works</span>
            </div>
            <p className="leading-relaxed">
              Enter 2 to 20 options in the editor or pick a preset. Hit Spin or tap Spacebar. PickIt uses cryptographic randomness and deceleration physics to select an unbiased winner.
            </p>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-3.5 rounded-2xl bg-surface-elevated border border-subtle space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <Keyboard className="w-3.5 h-3.5 text-secondary" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-surface border border-subtle font-mono text-primary font-bold">
                  Space
                </kbd>
                <span>Spin wheel</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-surface border border-subtle font-mono text-primary font-bold">
                  Enter
                </kbd>
                <span>Add option</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-surface border border-subtle font-mono text-primary font-bold">
                  Esc
                </kbd>
                <span>Close modal</span>
              </div>
            </div>
          </div>

          {/* Open Source & Privacy */}
          <div className="p-3.5 rounded-2xl bg-surface-elevated border border-subtle space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <Code className="w-3.5 h-3.5 text-secondary" />
                <span>100% Free &amp; Open Source</span>
              </div>
              <span className="text-[10px] text-muted">MIT License</span>
            </div>
            <p className="text-secondary leading-relaxed">
              PickIt is fully open source and runs entirely client-side. No tracking, no external database, and your choices stay private on your device.
            </p>
            <div className="pt-0.5">
              <a
                href="https://github.com/Yaseen549/pickit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline"
              >
                <Star className="w-3 h-3 text-[#B7A7D9] fill-[#B7A7D9]" />
                <span>Star on GitHub (Yaseen549/pickit)</span>
                <ExternalLink className="w-3 h-3 text-secondary" />
              </a>
            </div>
          </div>
        </div>

        {/* Close & GitHub action */}
        <div className="pt-2 border-t border-subtle flex items-center justify-between gap-2">
          <a
            href="https://github.com/Yaseen549/pickit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition-colors btn-tactile"
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="currentColor"
              className="w-3.5 h-3.5 shrink-0"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary-action hover:bg-primary-action-hover text-white text-xs font-bold btn-tactile"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
