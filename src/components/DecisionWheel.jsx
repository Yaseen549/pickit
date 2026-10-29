"use client";

import { Play, RotateCw, Trophy, UserX } from "lucide-react";
import WheelCanvas from "./WheelCanvas";

export default function DecisionWheel({
  options = [],
  rotationAngle = 0,
  pointerKick = 0,
  isSpinning = false,
  isDragging = false,
  winner = null,
  onSpin,
  onRemoveWinner,
  onDragStart,
  onDragMove,
  onDragEnd,
}) {
  const canSpin = options.length >= 2 && !isSpinning;

  return (
    <div className="w-full h-full min-h-0 flex flex-col items-center justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Top Contextual Status / Elimination Banner */}
      <div className="h-8 shrink-0 flex items-center justify-center w-full">
        {winner && options.includes(winner.text) ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-subtle text-xs animate-in fade-in duration-150 shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="text-secondary font-medium">Under pointer:</span>
            <span className="font-bold text-primary truncate max-w-[140px] sm:max-w-[200px]">
              {winner.text}
            </span>
            {onRemoveWinner && (
              <button
                type="button"
                onClick={() => onRemoveWinner(winner.text)}
                disabled={isSpinning || isDragging}
                className="ml-1 text-[11px] font-semibold text-secondary hover:text-red-600 transition-colors flex items-center gap-1"
                title="Remove winner for an elimination round"
              >
                <UserX className="w-3 h-3" />
                <span>Remove</span>
              </button>
            )}
          </div>
        ) : (
          <span className="text-xs font-semibold text-secondary">
            {options.length} {options.length === 1 ? "option" : "options"} on wheel
          </span>
        )}
      </div>

      {/* Center Interactive Wheel Stage (Constrained to available container height & width) */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center relative py-1 sm:py-2">
        <WheelCanvas
          options={options}
          rotationAngle={rotationAngle}
          pointerKick={pointerKick}
          isSpinning={isSpinning}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        />
      </div>

      {/* Bottom Main Action Bar */}
      <div className="shrink-0 w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center gap-1.5 pt-1">
        <button
          type="button"
          id="main-spin-button"
          onClick={onSpin}
          disabled={!canSpin || isDragging}
          className={`w-full h-12 rounded-2xl font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 transition-all select-none btn-tactile focus:outline-none focus:ring-2 focus:ring-[#B7A7D9]/50 ${
            canSpin && !isDragging
              ? "bg-primary-action text-white shadow-soft hover:bg-primary-action-hover active:scale-[0.98] cursor-pointer"
              : "bg-surface-elevated text-muted border border-subtle cursor-not-allowed shadow-none"
          }`}
          aria-label={
            isSpinning
              ? "Fate is deciding..."
              : winner
              ? "Spin Again"
              : "Spin the Wheel"
          }
        >
          {isSpinning ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-white" />
              <span>Deciding...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-white" />
              <span>{winner ? "Spin Again" : "Spin Wheel"}</span>
            </>
          )}
        </button>

        <span className="text-[11px] text-muted hidden sm:inline-block">
          Press <kbd className="px-1 py-0.5 rounded bg-surface-elevated border border-subtle font-mono text-[10px] text-secondary">space</kbd> to spin
        </span>
      </div>
    </div>
  );
}
