'use client';

import {useNavbar} from "../../hooks/useNavbar";
import {useMemo} from "react";

export type JlgNavbarProps = {
  phone?: string;
}

export default function JlgNavbarClient({ phone = '1-888-888-8888' }: JlgNavbarProps) {
  const isScrolled = useNavbar();
  const onlyNumberPhone = useMemo(() => phone.replace(/[^\d]/g, ''), [phone]);

  return (
    <nav
      className={`flex justify-between items-center fixed top-0 py-4 px-vw-1 left-0 right-0 z-50 transition-all min-h-20 duration-500 text-black ${isScrolled ? 'bg-white' : 'bg-blue-300'}`}
    >
      <h1>LOGO</h1>
      <a href={`tel:+${onlyNumberPhone}`}>{phone}</a>
    </nav>
  );
}
