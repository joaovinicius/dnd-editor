export type InjuryCardProps  = {
  title: string;
  content: string;
  picture?: string;
}

export function InjuryCard({ title, content, picture }: InjuryCardProps) {
  return (
    <section className="flex flex-col gap-4 bg-white px-4 py-8 sm:rounded-2xl sm:px-8 md:flex-row md:gap-8 md:py-10 lg:px-16 max-w-8xl mx-auto w-full md:w-[calc(100%-32px)] mb-10">
      <div className="order-last flex w-full flex-1 flex-col gap-4 sm:order-first">
        <h1 className="text-h1 text-center sm:text-left">{title}</h1>
        <div
          className="text-h2 text-brand-base flex flex-col gap-4 font-normal"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <div className="relative w-full flex-1">
        {picture && (
          <img
            src={picture}
            alt={`${title} photo`}
            width={350}
            height={185}
            className="h-auto w-full"
            sizes="(max-width: 768px) 50vw, 608px"
          />
        )}
      </div>
    </section>
  );
}

export default InjuryCard;
