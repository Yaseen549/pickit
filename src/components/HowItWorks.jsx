"use client";

import { ListPlus, RotateCw, Trophy } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: ListPlus,
      title: "Enter Your Options",
      description:
        "Type 2 to 20 choices, shuffle them, or load a curated preset. Your list saves automatically in local storage.",
      accentBg: "bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/40",
    },
    {
      number: "02",
      icon: RotateCw,
      title: "Spin The Wheel",
      description:
        "Hit the tactile SPIN button or press Spacebar. Smooth, hardware-accelerated deceleration physics simulate a real wheel.",
      accentBg: "bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800/40",
    },
    {
      number: "03",
      icon: Trophy,
      title: "Let Fate Decide",
      description:
        "The pointer selects the true winner. Celebrate, copy or share the verdict, or remove the winner for elimination rounds.",
      accentBg: "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
    },
  ];

  return (
    <section id="how-it-works-section" className="py-12 sm:py-16 border-t border-subtle">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            How PickIt Works
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Three simple steps to end back-and-forth debates and make confident choices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative p-6 rounded-2xl border border-subtle bg-surface hover:bg-surface-elevated transition-all duration-200 flex flex-col group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${step.accentBg} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black tracking-tight text-zinc-300 dark:text-zinc-700/60 font-mono">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
