"use client";

import { useEffect, useState } from "react";

type ScrollDirection = "up" | "down" | "none";

/**
 * Returns the current scroll direction.
 * "up"   → user is scrolling up   (show header)
 * "down" → user is scrolling down (hide header on mobile)
 * "none" → at top of page
 */
export function useScrollDirection(threshold = 8): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("none");
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 10) {
        setDirection("none");
      } else if (Math.abs(currentY - lastY) < threshold) {
        // ignore micro-scrolls
      } else {
        setDirection(currentY > lastY ? "down" : "up");
      }
      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY, threshold]);

  return direction;
}
