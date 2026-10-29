"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Compass } from "lucide-react";
import { PRESETS } from "@/data/presets";

export default function PresetDropdown({ activePresetId, onSelectPreset }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activePreset = PRESETS.find((p) => p.id === activePresetId);
  const label = activePreset ? activePreset.name : "Presets";

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        id="preset-dropdown-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-subtle bg-surface hover:bg-surface-elevated hover:border-strong text-primary text-xs font-semibold btn-tactile focus:outline-none focus:ring-2 focus:ring-[#B7A7D9]/40"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Choose a preset wheel"
      >
        <Compass className="w-3.5 h-3.5 text-secondary" />
        <span className="truncate max-w-[120px] sm:max-w-[160px]">{label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-secondary transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-60 rounded-2xl border border-subtle bg-surface shadow-modal z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
            Ready-Made Presets
          </div>

          <div className="space-y-0.5">
            {PRESETS.map((preset) => {
              const isSelected = preset.id === activePresetId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  role="menuitem"
                  id={`preset-item-${preset.id}`}
                  onClick={() => {
                    onSelectPreset(preset);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                    isSelected
                      ? "bg-surface-elevated font-bold text-primary border border-subtle"
                      : "text-secondary hover:text-primary hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base select-none shrink-0" role="img" aria-label={preset.name}>
                      {preset.emoji}
                    </span>
                    <div className="truncate">
                      <div className="font-semibold truncate">{preset.name}</div>
                      <div className="text-[10px] text-muted truncate">
                        {preset.options.length} options
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
