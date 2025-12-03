'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type NavbarProps = {
  phone?: string;
}

const scrollYPositionTrigger = 130;

export default function Navbar({ phone = '1-833-662-8550' }: NavbarProps) {
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

  const onlyNumberPhone = useMemo(() => phone.replace(/[^\d]/g, ''), [phone]);

  useEffect(() => {
    // Sync initial state on mount to prevent visual jump
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <nav className={`flex justify-between items-center fixed top-0 py-4 px-vw-1 left-0 right-0 z-50 transition-all min-h-20 duration-500 text-black ${isScrolled ? 'bg-white' : 'bg-red-300'}`}>
      <h1>LOGO</h1>
      <a href={`tel:+${onlyNumberPhone}`}>{phone}</a>
    </nav>
  );
}
