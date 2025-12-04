'use client';

import { Rating } from '../../ui/rating';
import { useEffect, useState, type CSSProperties, useMemo } from 'react';
import { Loader } from '../../ui/loader';
import type { CustomXYInputValues, CustomStyleValues } from '../../../lib/types';
import styles from './style.module.css';

export type GoogleRatingReviewsProps = {
  placeId: string;
  backgroundColor?: string;
  padding?: CustomXYInputValues;
  borderRadius?: CustomStyleValues;
  margin?: CustomStyleValues;
};

type Result = {
  rating: number;
  name: string;
  loading: boolean;
};

const initialResult = {
  rating: 0,
  name: '',
  loading: false,
};

export function GoogleRatingReviews({
  placeId,
  backgroundColor,
  padding,
  borderRadius,
  margin,
}: GoogleRatingReviewsProps) {
  const [result, setResult] = useState<Result>(initialResult);

  const style: CSSProperties = useMemo(
    () =>
      ({
        '--background-color': backgroundColor ? backgroundColor : 'initial',

        '--padding-top-mobile': `${padding?.mobile?.top || 0}px`,
        '--padding-right-mobile': `${padding?.mobile?.right || 0}px`,
        '--padding-bottom-mobile': `${padding?.mobile?.bottom || 0}px`,
        '--padding-left-mobile': `${padding?.mobile?.left || 0}px`,
        '--border-radius-mobile': `${borderRadius?.mobile || 0}`,
        '--margin-mobile': `${margin?.mobile || 0}`,

        '--padding-top-tablet': `${padding?.tablet?.top || 0}px`,
        '--padding-right-tablet': `${padding?.tablet?.right || 0}px`,
        '--padding-bottom-tablet': `${padding?.tablet?.bottom || 0}px`,
        '--padding-left-tablet': `${padding?.tablet?.left || 0}px`,
        '--border-radius-tablet': `${borderRadius?.tablet || 0}`,
        '--margin-tablet': `${margin?.tablet || 0}`,

        '--padding-top-desktop': `${padding?.desktop?.top || 0}px`,
        '--padding-right-desktop': `${padding?.desktop?.right || 0}px`,
        '--padding-bottom-desktop': `${padding?.desktop?.bottom || 0}px`,
        '--padding-left-desktop': `${padding?.desktop?.left || 0}px`,
        '--border-radius-desktop': `${borderRadius?.desktop || 0}`,
        '--margin-desktop': `${margin?.desktop || 0}`,
      }) as CSSProperties,
    [backgroundColor, padding, borderRadius, margin]
  );

  useEffect(() => {
    setResult((prev) => ({
      ...prev,
      loading: true,
    }));
    const fetchData = async () => {
      // const request = await fetch(
      //   `/api/google-rating-reviews?placeId=${placeId}`
      // );
      // const response = await request.json();
      const response = { rating: 4.5, name: '' };
      setResult({
        rating: response?.rating || 0,
        name: response?.name || '',
        loading: false,
      });
    };
    fetchData();
  }, [placeId]);

  if (result.loading) {
    return (
      <div className="mx-auto mt-10 flex max-w-max flex-col items-center">
        <Loader />
      </div>
    );
  }

  if (!result.rating) {
    return null;
  }

  return (
    <a
      href={`https://search.google.com/local/reviews?placeid=${placeId}`}
      target="_blank"
      className={`mx-auto mt-10 flex max-w-max flex-col items-center gap-2 lg:mx-0 ${styles.googleRatingReviews}`}
      style={style}
    >
      <div className="flex items-center gap-2">
        <svg
          version="1.2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 924 304"
          width="68"
          height="22"
        >
          <path
            fill="#ea4335"
            d="m395.38 159.81c0 43.72-34.2 75.93-76.17 75.93-41.97 0-76.17-32.21-76.17-75.93 0-44.02 34.2-75.93 76.17-75.93 41.97 0 76.17 31.91 76.17 75.93zm-33.34 0c0-27.32-19.82-46.01-42.83-46.01-23 0-42.83 18.69-42.83 46.01 0 27.05 19.83 46.01 42.83 46.01 23.01 0 42.83-19 42.83-46.01z"
          />
          <path
            fill="#fbbc05"
            d="m559.7 159.81c0 43.72-34.2 75.93-76.17 75.93-41.97 0-76.17-32.21-76.17-75.93 0-43.99 34.2-75.93 76.17-75.93 41.97 0 76.17 31.91 76.17 75.93zm-33.34 0c0-27.32-19.82-46.01-42.83-46.01-23 0-42.82 18.69-42.82 46.01 0 27.05 19.82 46.01 42.82 46.01 23.01 0 42.83-19 42.83-46.01z"
          />
          <path
            fill="#4285f4"
            d="m717.18 88.47v136.32c0 56.07-33.07 78.97-72.17 78.97-36.8 0-58.95-24.61-67.3-44.74l29.03-12.08c5.17 12.35 17.83 26.94 38.24 26.94 25.02 0 40.53-15.44 40.53-44.51v-10.92h-1.16c-7.47 9.21-21.84 17.26-39.99 17.26-37.96 0-72.74-33.07-72.74-75.62 0-42.87 34.78-76.21 72.74-76.21 18.11 0 32.49 8.05 39.99 16.98h1.16v-12.36h31.67zm-29.31 71.62c0-26.74-17.83-46.28-40.53-46.28-23 0-42.28 19.54-42.28 46.28 0 26.46 19.28 45.74 42.28 45.74 22.7 0 40.53-19.28 40.53-45.74z"
          />
          <path fill="#34a853" d="m769.38 8.57v222.52h-32.52v-222.52z" />
          <path
            fill="#ea4335"
            d="m896.12 184.8l25.88 17.26c-8.36 12.35-28.49 33.65-63.27 33.65-43.13 0-75.34-33.35-75.34-75.93 0-45.16 32.48-75.93 71.61-75.93 39.4 0 58.68 31.35 64.98 48.3l3.46 8.63-101.51 42.04c7.77 15.23 19.86 23 36.8 23 16.98 0 28.76-8.35 37.39-21.02zm-79.67-27.32l67.86-28.17c-3.74-9.48-14.96-16.09-28.18-16.09-16.94 0-40.53 14.96-39.68 44.26z"
          />
          <path
            fill="#4285f4"
            d="m119.94 140.06v-32.22h108.55c1.06 5.62 1.61 12.26 1.61 19.45 0 24.17-6.61 54.05-27.9 75.35-20.71 21.56-47.17 33.07-82.23 33.07-64.97 0-119.61-52.93-119.61-117.9 0-64.98 54.64-117.9 119.61-117.9 35.95 0 61.55 14.1 80.79 32.48l-22.73 22.73c-13.8-12.94-32.49-23-58.09-23-47.45 0-84.56 38.24-84.56 85.69 0 47.44 37.11 85.68 84.56 85.68 30.77 0 48.3-12.35 59.53-23.58 9.1-9.11 15.1-22.12 17.46-39.89z"
          />
        </svg>
        <span className="font-work-sans text-xl font-[600]">Reviews</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-2xl font-medium">{result.rating}</div>

        <Rating className="h-8 w-[138px]" rating={result.rating} />
      </div>
      <div className="text-small">View all Google Reviews</div>
    </a>
  );
}

export default GoogleRatingReviews;
