'use client'

import dynamic from "next/dynamic";

export default function JlgNavbarWrapper(props) {
  const LazyComponent = dynamic(
    () =>
      import(
        /* webpackChunkName: "component-jlg-navbar" */ './JlgNavbar'
      )
  );
  return <LazyComponent {...props} />;
}