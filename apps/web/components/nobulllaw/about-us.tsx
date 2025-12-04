export type Attributes = {
  title: string;
  content: string;
}

export type Advantages = {
  icon: {
    name: string;
    content: string;
  };
  title: string;
  content: string;
}

export type AboutUsCardProps = {
  title: string;
  subtitle: string;
  picture: string;
  attributes: Attributes[];
  advantages: Advantages[];
}

export function AboutUs({
  picture,
  title,
  subtitle,
  attributes,
  advantages,
}: AboutUsCardProps) {
  return (
    <section className="relative flex flex-col gap-4 bg-white px-4 py-8 sm:rounded-2xl sm:px-8 md:gap-8 md:py-10 lg:px-16 max-w-8xl mx-auto w-full md:w-[calc(100%-32px)] mb-10">
      <img
        src={picture}
        alt="Attorneys photo"
        width={350}
        height={160}
        className="h-auto w-full sm:rounded-2xl"
        sizes="(max-width: 1024px) 50vw, 1000px"
      />

      <h2 className="text-h1 text-center sm:text-left">{title}</h2>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:grid-rows-1">
        <div className="flex flex-col gap-6">
          <div
            className="text-h2 text-brand-base flex flex-col gap-4 font-normal"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        </div>
        <div className="mb-4">
          <div className="flex flex-col gap-4 md:pl-[35%]">
            {attributes.map((item, index) => (
              <div key={`about-us-earning-${index}`} className="max-w-max">
                <h2 className="text-h1">{item.title}</h2>
                <p className="text-brand-base font-normal">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 grid-rows-3 gap-4 md:grid-cols-3 md:grid-rows-1">
        {advantages.map((card, index) => {
          return (
            <div
              key={`card-item-${index}`}
              className="bg-brand-background-secondary flex flex-row items-center gap-6 rounded-2xl p-5 md:flex-col md:items-start lg:flex-row lg:items-center"
            >
              {card.icon?.content ? (
                <div
                  className="h-auto w-full max-w-[69px]"
                  dangerouslySetInnerHTML={{ __html: card.icon.content }}
                />
              ) : null}
              <div>
                <h3 className="font-medium text-black">{card.title}</h3>
                <p className="text-small text-black">{card.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AboutUs;
