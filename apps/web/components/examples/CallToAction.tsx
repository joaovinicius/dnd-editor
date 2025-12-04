import React from 'react';

interface CTAProps {
  text: string;
  url: string;
}

export default function CallToAction({ text, url = '#' }: CTAProps) {
  return (
    <section className="py-24 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Pronto para escalar sua aplicação?
        </h2>
        <a
          href={url}
          className="inline-block bg-white text-blue-600 font-bold py-4 px-10 rounded-full hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
        >
          {text}
        </a>
        <p className="mt-6 text-blue-200 text-sm">
          Sem cartão de crédito necessário. Performance garantida.
        </p>
      </div>
    </section>
  );
}