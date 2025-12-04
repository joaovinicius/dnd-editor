'use client'

import dynamic from "next/dynamic";

export default function GoogleRatingReviewsWrapper(props) {
  const LazyComponent = dynamic(
    () => import(/* webpackChunkName: "component-google-rating-reviews" */ './google-rating-reviews'),
    {
      ssr: false,
      loading: () => (
        <div className="h-[130px] w-[217px] rounded-2xl bg-gray-200/40 mx-auto" />
      )
    }
  );
  return <LazyComponent {...props} />;
}