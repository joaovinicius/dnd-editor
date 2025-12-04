'use client'

import {useCallback, useEffect, useRef, useState} from "react";

const scrollYPositionTrigger = 130;

export function useNavbar() {

  const [isScrolled, setIsScrolled] = useState(false);

  // Lightweight rAF-based throttle to avoid pulling lodash/throttle
  const ticking = useRef(false);
  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const scrolledState = window.scrollY > scrollYPositionTrigger;
      // Avoid redundant state updates
      setIsScrolled((prev) => (prev !== scrolledState ? scrolledState : prev));
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    // Sync initial state on mount to prevent visual jump
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return isScrolled;
}