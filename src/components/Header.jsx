"use client";

import { useState } from "react";
import { Bookmark, Volume2, VolumeX, HelpCircle } from "lucide-react";
import PresetDropdown from "./PresetDropdown";
import InfoModal from "./InfoModal";

export default function Header({
  activePresetId,
  onSelectPreset,
  onOpenSavedWheels,
  savedWheelsCount = 0,
  soundEnabled = false,
  onToggleSound,
}) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <header className="h-14 shrink-0 w-full border-b border-subtle bg-surface select-none">
        <div className="max-w-6xl mx-auto w-full h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 group">
              <div className="w-7 h-7 shrink-0 rounded-lg bg-primary-action flex items-center justify-center text-white shadow-xs">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-white shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v20" />
                  <path d="M12 12 4.93 4.93" />
                  <path d="M12 12l7.07 7.07" />
                  <path d="m12 12-7.07 7.07" />
                  <path d="m12 12 7.07-7.07" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                </svg>
              </div>
              <span className="font-extrabold text-base tracking-tight text-primary">
                PickIt
              </span>
            </div>
          </div>

          {/* Right: Presets Dropdown, Saved Wheels, Sound, Info */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <PresetDropdown
              activePresetId={activePresetId}
              onSelectPreset={onSelectPreset}
            />

            {/* Saved Wheels Trigger */}
            <button
              type="button"
              id="saved-wheels-header-btn"
              onClick={onOpenSavedWheels}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong text-secondary hover:text-primary text-xs font-semibold btn-tactile focus:outline-none focus:ring-2 focus:ring-[#B7A7D9]/40"
              title="View saved wheels"
              aria-label="View Saved Wheels"
            >
              <Bookmark className="w-3.5 h-3.5 text-secondary" />
              <span className="hidden sm:inline">Saved</span>
              {savedWheelsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-surface-elevated border border-subtle text-primary font-bold text-[10px]">
                  {savedWheelsCount}
                </span>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              id="sound-header-btn"
              onClick={onToggleSound}
              className="p-2 rounded-xl border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong text-secondary hover:text-primary text-xs font-semibold btn-tactile focus:outline-none focus:ring-2 focus:ring-[#B7A7D9]/40"
              title={soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
              aria-label={soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-primary" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-muted" />
              )}
            </button>

            {/* Help & Shortcuts Info */}
            <button
              type="button"
              id="info-header-btn"
              onClick={() => setShowInfoModal(true)}
              className="p-2 rounded-xl border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong text-secondary hover:text-primary text-xs font-semibold btn-tactile focus:outline-none focus:ring-2 focus:ring-[#B7A7D9]/40"
              title="About & Shortcuts"
              aria-label="About & Shortcuts"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {/* GitHub Star Link */}
            <a
              href="https://github.com/Yaseen549/pickit"
              target="_blank"
              rel="noopener noreferrer"
              id="github-header-btn"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong text-secondary hover:text-primary text-xs font-semibold btn-tactile focus:outline-none focus:ring-2 focus:ring-[#B7A7D9]/40"
              title="Star PickIt on GitHub"
              aria-label="Star PickIt on GitHub"
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
              <span className="hidden sm:inline">Star</span>
            </a>
          </div>
        </div>
      </header>

      {/* Info Modal */}
      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </>
  );
}
