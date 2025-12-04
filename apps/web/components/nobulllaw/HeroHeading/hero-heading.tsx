import Hero from './hero';
import dynamic from "next/dynamic";
import { sanitizedContent } from '../../../lib/string';
import Image from "next/image";

const NavbarWrapper = dynamic(
  () => import(/* webpackChunkName: "component-navbar-wrapper" */ '../Navbar/navbar-wrapper'),
);
const GoogleRatingReviewsWrapper = dynamic(
  () => import(/* webpackChunkName: "component-google-rating-reviews-wrapper" */ '../GoogleRatingReviews/google-rating-reviews-wrapper'),
);
const ContactFormWrapper = dynamic(
  () => import(/* webpackChunkName: "component-contact-form-wrapper" */ '../ContactForm/contact-form-wrapper'),
);

export type HeroHeadingProps = {
  title: string;
  subtitle?: string;
  earningList: { earning: string }[];
  other?: {
    placeId?: string;
    phone?: string;
    consentTerms?: string;
  };
}

export function HeroHeading({ title,
                              subtitle,
                              earningList,
                              other }: HeroHeadingProps) {
  const earnings =
    earningList?.map((item) => sanitizedContent(item.earning)) ?? [];

  return (
    <div>
      <NavbarWrapper phone={other?.phone || 'X-XXX-XXX-XXXX'} />
      <div className="relative w-full">
        <Image
          src="https://d3secykhf0toyz.cloudfront.net/no-bull-law/live/static/hero-background.webp"
          width={1920}
          height={1080}
          alt="hero-background"
          className="absolute inset-0 h-full w-full object-cover"
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="relative z-10 h-full w-full bg-black/60">
          <div className="max-w-8xl mx-auto w-full px-0 pt-[150px] md:px-4 md:pt-[180px] lg:pt-[200px]">
            <Hero
              title={title ?? ''}
              subtitle={subtitle}
              earningList={earnings}
              config={{
                titleColor: 'white',
                subtitleColor: 'white',
                checkIconColor: 'white',
                earningListColor: 'white',
              }}
              leftChildren={
                <div className="mt-10 flex items-center justify-center">
                  <GoogleRatingReviewsWrapper
                    placeId={other?.placeId || ''}
                    backgroundColor="white"
                    margin={{
                      mobile: '0px',
                      tablet: '0px',
                      desktop: '0px',
                    }}
                    borderRadius={{
                      mobile: '1rem',
                      tablet: '1rem',
                      desktop: '1rem',
                    }}
                    padding={{
                      mobile: {
                        top: 16,
                        right: 16,
                        bottom: 16,
                        left: 16,
                      },
                      tablet: {
                        top: 16,
                        right: 16,
                        bottom: 16,
                        left: 16,
                      },
                      desktop: {
                        top: 16,
                        right: 16,
                        bottom: 16,
                        left: 16,
                      },
                    }}
                  />
                </div>
              }
            >
              <div className="flex flex-col gap-1 rounded-3xl bg-white/60 p-4 pt-6 md:p-8 md:pt-8">
                <h2 className="text-black">If you want help</h2>
                <p className="font-bold">
                  It costs absolutely nothing to see if you have a case.
                </p>
                <ContactFormWrapper
                  consentTerms={other?.consentTerms || ''}
                />
              </div>
            </Hero>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroHeading;
