"use client";

import { PRESETS } from "@/data/presets";
import { ArrowRight, Check } from "lucide-react";

export default function PresetGallery({ onSelectPreset, activePresetId }) {
  return (
    <section id="presets-section" className="py-12 sm:py-16 border-t border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-1.5">
              Instant Templates
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Popular Presets
            </h2>
            <p className="mt-1 text-sm text-secondary">
              Jump straight into common decisions with these ready-made wheels.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <div
                key={preset.id}
                className={`relative p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? "border-violet-500 bg-violet-500/5 shadow-md shadow-violet-500/10 ring-1 ring-violet-500/30"
                    : "border-subtle bg-surface hover:bg-surface-elevated hover:border-violet-300 dark:hover:border-violet-800"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-3xl select-none" role="img" aria-label={preset.name}>
                      {preset.emoji}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-elevated text-secondary border border-subtle">
                      {preset.options.length} options
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-primary mb-1">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed mb-4">
                    {preset.description}
                  </p>

                  {/* Option preview chips */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {preset.options.slice(0, 4).map((opt, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800/80 text-secondary"
                      >
                        {opt}
                      </span>
                    ))}
                    {preset.options.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium text-muted">
                        +{preset.options.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  id={`preset-btn-${preset.id}`}
                  onClick={() => onSelectPreset(preset)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 btn-tactile focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
                      : "border border-subtle bg-surface-elevated hover:bg-violet-600 hover:text-white hover:border-transparent text-primary"
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      Current Wheel
                    </>
                  ) : (
                    <>
                      <span>Use This Wheel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
