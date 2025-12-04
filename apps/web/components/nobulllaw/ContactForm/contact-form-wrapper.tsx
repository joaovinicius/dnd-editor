'use client'

import dynamic from "next/dynamic";

export default function ContactFormWrapper(props) {
  const LazyComponent = dynamic(
    () => import(/* webpackChunkName: "component-contact-form" */ './contact-form'),
    {
      ssr: false,
      loading: () => (
        <div className="h-[420px] w-full rounded-2xl bg-gray-200/40" />
      )
    }
  );
  return <LazyComponent {...props} />;
}