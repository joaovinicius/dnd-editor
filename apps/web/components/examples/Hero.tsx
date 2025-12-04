import React from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  padding: number;
}

// Default export é obrigatório para o React.lazy / dynamic do Next
export default function Hero({ title, subtitle, padding = 60 }: HeroProps) {
  return (
    <section
      className="bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center text-center"
      style={{ paddingTop: `${padding}px`, paddingBottom: `${padding}px` }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}