"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  RotateCw,
  UserX,
  Copy,
  Check,
  Share2,
  X,
} from "lucide-react";
import { getSegmentColor } from "@/utils/wheelColors";
import { fireWinnerConfetti } from "@/utils/confetti";

export default function WinnerModal({
  isOpen,
  winner,
  optionCount = 6,
  onClose,
  onSpinAgain,
  onRemoveWinner,
}) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (isOpen && winner) {
      fireWinnerConfetti();
      setCopied(false);
      setShared(false);
    }
  }, [isOpen, winner]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !winner) return null;

  const segmentColor = getSegmentColor(winner.index ?? 0, optionCount);

  // Copy result to clipboard
  const handleCopy = async () => {
    const textToCopy = `🎯 PickIt: The wheel selected "${winner.text}" (from ${optionCount} options).`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.warn("Failed to copy:", err);
    }
  };

  // Web Share API with clipboard fallback
  const handleShare = async () => {
    const shareData = {
      title: "PickIt Result",
      text: `🎯 The wheel selected "${winner.text}"!`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopy();
        }
      }
    } else {
      handleCopy();
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm sm:max-w-md p-6 sm:p-7 rounded-3xl border border-subtle bg-surface shadow-modal relative flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-elevated transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Subtle Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-subtle flex items-center justify-center text-primary mb-3">
          <Trophy className="w-6 h-6 text-secondary" />
        </div>

        {/* Small Subtitle */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-secondary mb-1">
          The wheel has spoken
        </span>

        {/* Winning Text */}
        <h2
          id="winner-dialog-title"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary mt-1 mb-2.5 break-words max-w-full px-2"
        >
          {winner.text}
        </h2>

        {/* Context metadata pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated border border-subtle text-xs text-secondary mb-5">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: segmentColor }}
          />
          <span>Selected among {optionCount} choices</span>
        </div>

        {/* Feedback message for copy / share */}
        {(copied || shared) && (
          <div className="w-full mb-3 py-1.5 px-3 rounded-xl bg-surface-elevated border border-subtle text-xs font-semibold text-primary flex items-center justify-center gap-1.5 animate-in fade-in duration-100">
            <Check className="w-3.5 h-3.5 text-[#648A70]" />
            <span>{copied ? "Copied to clipboard" : "Shared successfully"}</span>
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          {/* Spin Again */}
          <button
            type="button"
            id="winner-spin-again-btn"
            onClick={() => {
              onClose();
              onSpinAgain();
            }}
            className="w-full h-11 rounded-xl bg-primary-action hover:bg-primary-action-hover text-white text-xs font-bold flex items-center justify-center gap-2 btn-tactile focus:outline-none focus:ring-2 focus:ring-[#B7A7D9]/40"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Spin Again</span>
          </button>

          {/* Remove Winner */}
          <button
            type="button"
            id="winner-remove-btn"
            onClick={() => {
              onRemoveWinner(winner.text);
              onClose();
            }}
            className="w-full h-11 rounded-xl border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong text-secondary hover:text-primary text-xs font-bold flex items-center justify-center gap-2 btn-tactile focus:outline-none focus:ring-2 focus:ring-[#B7A7D9]/40"
            title="Remove winner for an elimination round"
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Remove Winner</span>
          </button>
        </div>

        {/* Secondary Sharing Actions */}
        <div className="w-full flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            id="winner-copy-btn"
            onClick={handleCopy}
            className="flex-1 py-2 px-3 rounded-xl border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong text-secondary hover:text-primary text-xs font-semibold flex items-center justify-center gap-1.5 btn-tactile"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#648A70]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="winner-share-btn"
            onClick={handleShare}
            className="flex-1 py-2 px-3 rounded-xl border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong text-secondary hover:text-primary text-xs font-semibold flex items-center justify-center gap-1.5 btn-tactile"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
