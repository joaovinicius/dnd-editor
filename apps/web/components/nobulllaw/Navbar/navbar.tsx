'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Logo from '../../ui/logo';
import styles from './style.module.css';

interface NavbarProps {
  phone?: string;
}

const scrollYPositionTrigger = 130;

export function Navbar({ phone = '1-833-662-8550' }: NavbarProps) {
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
    <div
      className={`w-full ${styles.navbarWrapper} ${isScrolled ? styles.navbarWrapperScrolled : ''}`}
    >
      <div
        className={`mx-auto flex w-full origin-top-right items-end justify-between gap-6 ${styles.navbarWrapperInner} ${isScrolled ? styles.navbarWrapperInnerScrolled : ''}`}
      >
        <div className="flex w-full items-end justify-start">
          <div
            className={`origin-bottom-left ${styles.leftSide} ${isScrolled ? styles.leftSideScrolled : ''}`}
          >
            <Logo
              className="max-h-[100px] w-full max-w-[298px] min-w-[90px]"
              color="rgba(255, 255, 255, 1)"
            />
          </div>
        </div>
        <div className="flex w-full items-end justify-end">
          <div
            className={`origin-bottom-right ${styles.rightSide} ${isScrolled ? styles.rightSideScrolled : ''}`}
          >
            <h1 className={`text-nowrap text-white ${styles.phone}`}>
              <span>FREE CONSULTATION</span>
              <br />
              <a href={`tel:+${onlyNumberPhone}`}>{phone}</a>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
