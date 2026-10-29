"use client";

import { Sparkles, Command, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-subtle bg-surface/50 mt-auto py-10 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg brand-gradient flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-primary">
              PickIt
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">
            Stop overthinking. Let fate decide.
          </p>
        </div>

        {/* Keyboard hints */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-subtle bg-surface">
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-primary border border-subtle">
              Space
            </kbd>
            <span>Spin Wheel</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-subtle bg-surface">
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-primary border border-subtle">
              Enter
            </kbd>
            <span>Add Option</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Local &amp; Private</span>
          </div>
        </div>

        {/* Legal & Attribution */}
        <div className="text-xs text-muted text-center md:text-right">
          <p>© 2026 PickIt. All rights reserved.</p>
          <p className="text-[11px] mt-0.5 text-zinc-400 dark:text-zinc-500">
            Built with React, Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
