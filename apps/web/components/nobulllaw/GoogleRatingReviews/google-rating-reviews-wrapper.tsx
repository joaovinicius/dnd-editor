'use client'

import dynamic from "next/dynamic";

export default function GoogleRatingReviewsWrapper(props) {
  const LazyComponent = dynamic(
    () => import(/* webpackChunkName: "component-google-rating-reviews" */ './google-rating-reviews'),
    {
      ssr: false,
      loading: () => (
        <div className="h-[420px] w-full rounded-2xl bg-gray-200/40" />
      )
    }
  );
  return <LazyComponent {...props} />;
}