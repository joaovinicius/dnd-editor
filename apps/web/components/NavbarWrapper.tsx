'use client'

import dynamic from "next/dynamic";

export default function NavbarWrapper(props) {
  const LazyComponent = dynamic(
    () =>
      import(
        /* webpackChunkName: "component-navbar" */ './Navbar'
        )
  );
  return <LazyComponent {...props} />;
}