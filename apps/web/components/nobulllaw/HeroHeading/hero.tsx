import { ReactNode } from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  earningList: string[];
  children: ReactNode;
  leftChildren?: ReactNode;
  config?: {
    titleColor?: string;
    subtitleColor?: string;
    checkIconColor?: string;
    earningListColor?: string;
  };
}

export function Hero({
  title,
  subtitle,
  earningList,
  children,
  config,
  leftChildren,
}: HeroProps) {
  return (
    <section
      data-component="hero"
      className="flex flex-col gap-4 px-4 py-8 sm:px-8 md:py-10 lg:flex-row lg:px-16"
    >
      <div className="md:flex-1">
        <h1
          className="mt-6 mb-12 text-center lg:text-left"
          style={{ color: config?.titleColor }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {subtitle ? (
          <div
            className="text-h2 text-brand-base mb-4 flex flex-col gap-4 font-normal"
            style={{ color: config?.subtitleColor }}
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        ) : null}
        {Array.isArray(earningList) && earningList.length > 0 ? (
          <ul className="mx-auto mb-4 flex max-w-max flex-col gap-4 lg:mx-0">
            {earningList.map((check, index) => (
              <li key={index} className="flex items-start gap-2">
                <span
                  className="text-brand-primary font-black"
                  style={{ color: config?.checkIconColor }}
                >
                  ✔
                </span>
                <div
                  dangerouslySetInnerHTML={{ __html: check }}
                  style={{ color: config?.earningListColor }}
                />
              </li>
            ))}
          </ul>
        ) : null}
        {leftChildren ? <div>{leftChildren}</div> : null}
      </div>

      <div className="md:flex-1">
        <div className="lg:pl-[8rem]">{children}</div>
      </div>
    </section>
  );
}

export default Hero;
