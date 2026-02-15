"use client";

import { useEffect, useState } from "react";

export function useCountUp(
  end: number,
  isActive: boolean,
  duration = 2000,
  startDelay = 0
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timeout = setTimeout(() => {
      let startTime: number | null = null;
      let animationFrame: number;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animationFrame);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [end, isActive, duration, startDelay]);

  return count;
}
