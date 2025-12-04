'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '../../ui/carousel';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { AttorneyCard } from './attorney-card';
import type { Attorney } from '../../../lib/model';

export function MeetOurTeamCarousel({ attorneys }: { attorneys: Attorney[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [slidesInView, setSlidesInView] = useState<number[]>([]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateSlidesInView = () => {
      setSlidesInView(api.slidesInView());
    };

    api.on('settle', updateSlidesInView);

    updateSlidesInView();

    return () => {
      api.off('settle', updateSlidesInView);
    };
  }, [api]);

  function goToSlide(index: number) {
    if (!api) {
      return;
    }
    api.scrollTo(index);
  }

  return (
    <div className="bg-brand-primary px-4 py-10 md:rounded-2xl md:px-8 lg:px-16 max-w-8xl mx-auto w-full md:w-[calc(100%-32px)] mb-10">
      <Carousel opts={{ align: 'start' }} setApi={setApi} className="w-full">
        <CarouselContent className="gap-x-8">
          {attorneys.map((item) => (
            <CarouselItem
              key={item.name}
              className="w-full md:w-[calc((100%-2*2rem)/3)] lg:w-[calc((100%-3*2rem)/4)]"
            >
              <AttorneyCard attorney={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mt-4 flex items-center justify-center gap-2">
        {attorneys.map((_, index) => (
          <button
            key={`circle-${index}`}
            className={clsx(
              'h-6 w-6 cursor-pointer rounded-full',
              slidesInView.includes(index) ? 'bg-white' : 'bg-[#D9D9D9]'
            )}
            aria-label="item"
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default MeetOurTeamCarousel;
