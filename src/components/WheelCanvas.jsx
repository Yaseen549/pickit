"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getSegmentColor } from "@/utils/wheelColors";

export default function WheelCanvas({
  options = [],
  rotationAngle = 0,
  pointerKick = 0,
  isSpinning = false,
  isDragging = false,
  onDragStart,
  onDragMove,
  onDragEnd,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [size, setSize] = useState(420);

  // Measure both available width AND height so wheel never overflows the single viewport
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const available = Math.min(width, height > 120 ? height : width);
        // Clamp size safely between 260px (mobile) and 480px (desktop)
        const computedSize = Math.max(260, Math.min(480, available - 12));
        setSize(computedSize);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pointer & Touch drag handlers for interactive free rotation
  const handlePointerDown = useCallback(
    (e) => {
      if (isSpinning || options.length < 2) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      // Only initiate drag if clicked inside the wheel circle
      if (dist > rect.width / 2 + 10) return;

      e.preventDefault();
      onDragStart?.(e.clientX, e.clientY, rect);

      const handleMove = (moveEvt) => {
        moveEvt.preventDefault();
        onDragMove?.(moveEvt.clientX, moveEvt.clientY);
      };

      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
        onDragEnd?.();
      };

      window.addEventListener("pointermove", handleMove, { passive: false });
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
    },
    [isSpinning, options.length, onDragStart, onDragMove, onDragEnd]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    // High DPI Retina scaling
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 18; // Room for 12 o'clock pointer needle

    ctx.clearRect(0, 0, size, size);

    const total = options.length;
    if (total === 0) {
      ctx.restore();
      return;
    }

    const arc = (2 * Math.PI) / total;

    // Soft milky ambient shadow behind wheel
    ctx.save();
    ctx.shadowColor = "rgba(32, 32, 31, 0.08)";
    ctx.shadowBlur = Math.round(size * 0.05);
    ctx.shadowOffsetY = Math.round(size * 0.016);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    // Rotate context by current rotation angle
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotationAngle * Math.PI) / 180);

    // 1. Render Segment Wedges
    for (let i = 0; i < total; i++) {
      const startAngle = i * arc;
      const endAngle = startAngle + arc;
      const color = getSegmentColor(i, total);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Subtle radial depth gradient
      const segmentGrad = ctx.createRadialGradient(0, 0, radius * 0.25, 0, 0, radius);
      segmentGrad.addColorStop(0, "rgba(255, 255, 255, 0.12)");
      segmentGrad.addColorStop(0.85, "rgba(0, 0, 0, 0)");
      segmentGrad.addColorStop(1, "rgba(0, 0, 0, 0.16)");
      ctx.fillStyle = segmentGrad;
      ctx.fill();

      // Segment separator border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 1.75;
      ctx.stroke();

      // 2. Render Text Label inside Segment
      ctx.save();
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";

      // Scale font based on options count and wheel diameter
      const scaleFactor = size / 420;
      const baseFontSize = Math.max(9, Math.min(14, Math.floor(20 - total * 0.46)));
      const fontSize = Math.max(9, Math.round(baseFontSize * scaleFactor));

      ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;

      // Crisp text shadow for legibility
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Truncate long text gracefully
      let text = options[i] || "";
      const maxTextWidth = radius * 0.52;
      if (ctx.measureText(text).width > maxTextWidth) {
        while (text.length > 2 && ctx.measureText(text + "…").width > maxTextWidth) {
          text = text.slice(0, -1);
        }
        text = text + "…";
      }

      ctx.fillText(text, radius - Math.round(18 * scaleFactor), 0);
      ctx.restore();

      // 3. Perimeter Metallic Pegs
      const pegDistance = radius - 5;
      const pegX = Math.cos(startAngle) * pegDistance;
      const pegY = Math.sin(startAngle) * pegDistance;
      const pegRadius = Math.max(2, Math.round(2.8 * scaleFactor));

      ctx.save();
      ctx.beginPath();
      ctx.arc(pegX, pegY, pegRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "#fafaf8";
      ctx.fill();
      ctx.strokeStyle = "#a3a39e";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // Outer wheel rim ring
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = Math.max(4, Math.round(5.5 * (size / 420)));
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius + 2.5, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(234, 234, 230, 0.85)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore(); // Restore rotation

    // 4. Center Hub (Brushed steel with dark-neutral jewel)
    const hubRadius = Math.max(26, size * 0.092);

    // Hub Shadow
    ctx.save();
    ctx.shadowColor = "rgba(32, 32, 31, 0.22)";
    ctx.shadowBlur = Math.round(hubRadius * 0.3);
    ctx.shadowOffsetY = 3;

    // Chrome Beveled Rim
    const hubGrad = ctx.createLinearGradient(
      centerX - hubRadius,
      centerY - hubRadius,
      centerX + hubRadius,
      centerY + hubRadius
    );
    hubGrad.addColorStop(0, "#ffffff");
    hubGrad.addColorStop(0.4, "#f5f5f3");
    hubGrad.addColorStop(0.8, "#dcdcd6");
    hubGrad.addColorStop(1, "#999994");

    ctx.beginPath();
    ctx.arc(centerX, centerY, hubRadius, 0, 2 * Math.PI);
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.restore();

    // Hub Rim Highlight
    ctx.beginPath();
    ctx.arc(centerX, centerY, hubRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center Core Jewel (Dark Neutral #292927)
    const jewelRadius = hubRadius * 0.62;
    const jewelGrad = ctx.createRadialGradient(
      centerX - 2,
      centerY - 2,
      1,
      centerX,
      centerY,
      jewelRadius
    );
    jewelGrad.addColorStop(0, "#4a4a46");
    jewelGrad.addColorStop(0.7, "#292927");
    jewelGrad.addColorStop(1, "#181817");

    ctx.beginPath();
    ctx.arc(centerX, centerY, jewelRadius, 0, 2 * Math.PI);
    ctx.fillStyle = jewelGrad;
    ctx.fill();

    // Jewel highlight line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.25;
    ctx.stroke();

    // Center Dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(2, 3 * (size / 420)), 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // 5. Top Pointer Indicator at 12 o'clock (270 degrees)
    ctx.save();
    const pointerScale = size / 420;
    const pointerBaseY = centerY - radius - Math.round(13 * pointerScale);
    const pointerTipY = centerY - radius + Math.round(9 * pointerScale);
    const pointerHalfWidth = Math.round(10 * pointerScale);

    ctx.translate(centerX, pointerBaseY);
    ctx.rotate((pointerKick * Math.PI) / 180);

    // Pointer shadow
    ctx.shadowColor = "rgba(32, 32, 31, 0.3)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;

    // Needle shape
    ctx.beginPath();
    ctx.moveTo(-pointerHalfWidth, 0);
    ctx.lineTo(pointerHalfWidth, 0);
    ctx.lineTo(0, pointerTipY - pointerBaseY);
    ctx.closePath();

    const pointerGrad = ctx.createLinearGradient(0, 0, 0, pointerTipY - pointerBaseY);
    pointerGrad.addColorStop(0, "#383835");
    pointerGrad.addColorStop(0.8, "#20201f");
    pointerGrad.addColorStop(1, "#141413");
    ctx.fillStyle = pointerGrad;
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.75;
    ctx.stroke();

    // Pointer Pivot Pin
    const pinRadius = Math.max(3.5, Math.round(5.5 * pointerScale));
    ctx.beginPath();
    ctx.arc(0, 0, pinRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#dcdcd6";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, Math.round(pinRadius * 0.5), 0, 2 * Math.PI);
    ctx.fillStyle = "#292927";
    ctx.fill();

    ctx.restore(); // Restore pointer
    ctx.restore(); // Restore main
  }, [options, rotationAngle, pointerKick, size]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center select-none w-full h-full min-h-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="block transition-transform duration-75 select-none"
        style={{
          filter: "drop-shadow(0 12px 28px rgba(32, 32, 31, 0.06))",
          cursor: isSpinning
            ? "not-allowed"
            : isDragging
            ? "grabbing"
            : "pointer",
          touchAction: "none",
        }}
        title="Click & drag to rotate freely, or let it spin"
        aria-label="Interactive decision wheel. Click and drag with mouse or finger to rotate freely."
      />
    </div>
  );
}
