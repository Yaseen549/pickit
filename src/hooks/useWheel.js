"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  calculateTargetRotation,
  easeOutQuart,
  getSegmentArc,
  getWinningIndexAtAngle,
  normalizeAngle,
  POINTER_ANGLE,
} from "@/utils/wheelMath";

export function useWheel({
  options = [],
  onSpinStart,
  onSpinComplete,
  onManualPlace,
  onTick,
}) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [pointerKick, setPointerKick] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [winner, setWinner] = useState(null);

  const animationFrameRef = useRef(null);
  const currentAngleRef = useRef(0);
  const lastCrossingIndexRef = useRef(-1);
  const isDraggingRef = useRef(false);
  const dragCenterRef = useRef({ x: 0, y: 0 });
  const lastPointerAngleRef = useRef(0);
  const velocityHistoryRef = useRef([]);

  // Sync ref with state
  useEffect(() => {
    currentAngleRef.current = rotationAngle;
  }, [rotationAngle]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Standard motorized spin action
  const spin = useCallback(() => {
    if (isSpinning || isDraggingRef.current || options.length < 2) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startAngle = currentAngleRef.current;
    const { winningIndex, targetAngle, totalRotationDelta, duration } =
      calculateTargetRotation({
        currentAngle: startAngle,
        numSegments: options.length,
        minFullRotations: 5,
        maxFullRotations: 7,
      });

    const winningOption = options[winningIndex];
    setIsSpinning(true);
    setWinner(null);

    if (typeof onSpinStart === "function") {
      onSpinStart();
    }

    const startTime = performance.now();
    const arc = getSegmentArc(options.length);
    lastCrossingIndexRef.current = -1;

    const animate = (now) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, Math.max(0, elapsed / duration));
      const easedProgress = easeOutQuart(rawProgress);

      const currentAngle = startAngle + totalRotationDelta * easedProgress;
      currentAngleRef.current = currentAngle;
      setRotationAngle(currentAngle);

      // Pointer deflection & peg tick detection
      const currentWheelPointer = normalizeAngle(POINTER_ANGLE - normalizeAngle(currentAngle));
      const currentSegmentIndex = Math.floor(currentWheelPointer / arc);

      if (
        lastCrossingIndexRef.current !== -1 &&
        currentSegmentIndex !== lastCrossingIndexRef.current
      ) {
        const speedFactor = 1 - rawProgress;
        const kickDegrees = -Math.max(4, Math.min(15, speedFactor * 16));
        setPointerKick(kickDegrees);

        if (typeof onTick === "function") {
          onTick(0.8 + speedFactor * 0.4);
        }
      } else {
        setPointerKick((prev) => (prev !== 0 ? prev * 0.8 : 0));
      }

      lastCrossingIndexRef.current = currentSegmentIndex;

      if (rawProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation Complete: land exactly on calculated target
        const finalNormalizedAngle = normalizeAngle(targetAngle);
        setRotationAngle(finalNormalizedAngle);
        currentAngleRef.current = finalNormalizedAngle;
        setPointerKick(0);
        setIsSpinning(false);

        const result = {
          index: winningIndex,
          text: winningOption,
        };
        setWinner(result);

        if (typeof onSpinComplete === "function") {
          onSpinComplete(result);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isSpinning, options, onSpinStart, onSpinComplete, onTick]);

  // Inertial coasting when user flings the wheel
  const coastToStop = useCallback(
    (initialVelocity) => {
      if (options.length < 2) return;

      setIsSpinning(true);
      let velocity = initialVelocity; // in deg/ms
      let lastTime = performance.now();
      const arc = getSegmentArc(options.length);
      const friction = 0.965; // Smooth deceleration decay

      const step = (now) => {
        const dt = Math.min(32, now - lastTime);
        lastTime = now;

        velocity *= Math.pow(friction, dt / 16);
        const nextAngle = currentAngleRef.current + velocity * dt;
        currentAngleRef.current = nextAngle;
        setRotationAngle(nextAngle);

        // Needle deflection and tick
        const currentWheelPointer = normalizeAngle(POINTER_ANGLE - normalizeAngle(nextAngle));
        const currentSegmentIndex = Math.floor(currentWheelPointer / arc);

        if (
          lastCrossingIndexRef.current !== -1 &&
          currentSegmentIndex !== lastCrossingIndexRef.current
        ) {
          const kick = velocity > 0 ? -Math.min(14, Math.abs(velocity) * 12) : Math.min(14, Math.abs(velocity) * 12);
          setPointerKick(kick);

          if (typeof onTick === "function") {
            onTick(1.0);
          }
        } else {
          setPointerKick((prev) => (prev !== 0 ? prev * 0.8 : 0));
        }

        lastCrossingIndexRef.current = currentSegmentIndex;

        if (Math.abs(velocity) > 0.02) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          // Coast complete: stop exactly where momentum ended
          const finalAngle = normalizeAngle(nextAngle);
          currentAngleRef.current = finalAngle;
          setRotationAngle(finalAngle);
          setPointerKick(0);
          setIsSpinning(false);

          const winningIndex = getWinningIndexAtAngle(finalAngle, options.length);
          const result = {
            index: winningIndex,
            text: options[winningIndex],
          };
          setWinner(result);

          if (typeof onSpinComplete === "function") {
            onSpinComplete(result);
          }
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    },
    [options, onSpinComplete, onTick]
  );

  // Manual interactive dragging start
  const handleDragStart = useCallback(
    (clientX, clientY, rect) => {
      if (isSpinning || options.length < 2) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      dragCenterRef.current = { x: cx, y: cy };

      const pointerAngle =
        Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
      lastPointerAngleRef.current = pointerAngle;

      isDraggingRef.current = true;
      setIsDragging(true);

      const now = performance.now();
      velocityHistoryRef.current = [{ angle: currentAngleRef.current, time: now }];
      lastCrossingIndexRef.current = getWinningIndexAtAngle(
        currentAngleRef.current,
        options.length
      );
    },
    [isSpinning, options.length]
  );

  // Manual interactive dragging move
  const handleDragMove = useCallback(
    (clientX, clientY) => {
      if (!isDraggingRef.current) return;

      const { x: cx, y: cy } = dragCenterRef.current;
      const currentPointerAngle =
        Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);

      let delta = currentPointerAngle - lastPointerAngleRef.current;
      // Handle +/- 180 degree coordinate wrapping safely
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      lastPointerAngleRef.current = currentPointerAngle;

      const nextAngle = currentAngleRef.current + delta;
      currentAngleRef.current = nextAngle;
      setRotationAngle(nextAngle);

      // Track recent velocity for flick detection
      const now = performance.now();
      velocityHistoryRef.current.push({ angle: nextAngle, time: now });
      if (velocityHistoryRef.current.length > 5) {
        velocityHistoryRef.current.shift();
      }

      // Pointer deflection & peg tick while manually dragging
      const arc = getSegmentArc(options.length);
      const currentWheelPointer = normalizeAngle(
        POINTER_ANGLE - normalizeAngle(nextAngle)
      );
      const currentSegmentIndex = Math.floor(currentWheelPointer / arc);

      if (currentSegmentIndex !== lastCrossingIndexRef.current) {
        const kick = delta > 0 ? -7 : 7;
        setPointerKick(kick);

        if (typeof onTick === "function") {
          onTick(1.0);
        }
        lastCrossingIndexRef.current = currentSegmentIndex;
      } else {
        setPointerKick((prev) => (prev !== 0 ? prev * 0.7 : 0));
      }

      // Real-time live winner under 12 o'clock pointer
      const liveIndex = Math.min(
        options.length - 1,
        Math.max(0, currentSegmentIndex)
      );
      setWinner({
        index: liveIndex,
        text: options[liveIndex],
      });
    },
    [options, onTick]
  );

  // Manual interactive dragging release (keep wherever user leaves it)
  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);
    setPointerKick(0);

    // Check if user flung the wheel with high velocity
    const history = velocityHistoryRef.current;
    if (history.length >= 2) {
      const first = history[0];
      const last = history[history.length - 1];
      const dt = last.time - first.time;
      const dAngle = last.angle - first.angle;
      const velocity = dt > 0 ? dAngle / dt : 0; // deg/ms

      if (Math.abs(velocity) > 0.45 && options.length >= 2) {
        coastToStop(velocity);
        return;
      }
    }

    // Keep wheel EXACTLY where user positioned it
    const finalAngle = normalizeAngle(currentAngleRef.current);
    currentAngleRef.current = finalAngle;
    setRotationAngle(finalAngle);

    const winningIndex = getWinningIndexAtAngle(finalAngle, options.length);
    const result = {
      index: winningIndex,
      text: options[winningIndex],
    };
    setWinner(result);

    if (typeof onManualPlace === "function") {
      onManualPlace(result);
    }
  }, [options, coastToStop, onManualPlace]);

  return {
    rotationAngle,
    pointerKick,
    isSpinning,
    isDragging,
    winner,
    setWinner,
    spin,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    setRotationAngle: (angle) => {
      currentAngleRef.current = angle;
      setRotationAngle(angle);
    },
  };
}
