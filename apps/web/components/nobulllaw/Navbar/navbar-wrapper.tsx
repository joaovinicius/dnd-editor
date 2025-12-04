'use client'

import dynamic from "next/dynamic";

export default function NavbarWrapper(props) {
  const LazyComponent = dynamic(
    () => import(/* webpackChunkName: "component-navbar-client" */ './navbar'),
    {
      ssr: false,
      loading: () => (
        <div
          className="fixed top-0 left-0 right-0 z-20 w-full bg-[#AC2B2E]/60 h-[140px]"
        />
      )
    }
  );

  return <LazyComponent {...props} />;
}