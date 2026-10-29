"use client";

import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function Hero({ onQuickPresetSelect }) {
  return (
    <section className="pt-6 pb-4 sm:pt-8 sm:pb-6 text-center max-w-4xl mx-auto px-4">
      {/* Subtle pill indicator */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200/70 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
        <span>Instant Decision Maker</span>
      </div>

      {/* Main Tagline Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary leading-tight">
        Stop overthinking.{" "}
        <span className="brand-text-gradient">Let fate decide.</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-2.5 text-sm sm:text-base text-secondary max-w-xl mx-auto font-normal">
        Enter choices, hit spin, and break decision fatigue in seconds. 
        Whether it&apos;s dinner, a movie, or who goes first.
      </p>

      {/* Trust & Spec Badges */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-muted font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Hardware-accelerated spin physics
        </span>
        <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          100% Private &amp; client-side
        </span>
        <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          2 to 20 options
        </span>
      </div>
    </section>
  );
}
