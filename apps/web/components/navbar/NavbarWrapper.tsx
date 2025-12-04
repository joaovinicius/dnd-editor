'use client'

import dynamic from "next/dynamic";

export default function NavbarWrapper(props) {
  const LazyComponent = dynamic(
    () => import(/* webpackChunkName: "component-navbar-client" */ './NavbarClient'),
    {
      ssr: false,
      loading: () => (
        <nav className={`flex justify-between items-center fixed top-0 py-4 px-vw-1 left-0 right-0 z-50 transition-all min-h-20 duration-500 text-black bg-red-300`}>
          <h1>LOGO</h1>
          <a href="#">{props.phone}</a>
        </nav>
      )
    }
  );
  return <LazyComponent {...props} />;
}