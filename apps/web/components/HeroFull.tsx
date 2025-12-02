import React from 'react';
import { clsx } from 'clsx'; // O projeto já tem essa lib, vamos usar!

interface HeroButtonProps {
  label: string;
  href: string;
  style: 'solid' | 'outline';
}

interface HeroFullProps {
  title: string;
  description: string;
  align: 'left' | 'center' | 'right';
  padding: number;
  // O campo 'cta' será um objeto aninhado vindo do editor
  cta?: HeroButtonProps;
}

export default function HeroFull({
                               title,
                               description,
                               align = 'center',
                               padding = 60,
                               cta
                             }: HeroFullProps) {

  // Mapeamento de alinhamento para classes Tailwind
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <section
      className="bg-gradient-to-br from-gray-900 via-slate-800 to-black text-white"
      style={{ paddingTop: `${padding}px`, paddingBottom: `${padding}px` }}
    >
      <div className={clsx("container mx-auto px-6 flex flex-col", alignClasses[align])}>

        {/* Título (Vindo de Textarea) */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-4xl whitespace-pre-line">
          {title}
        </h1>

        {/* Descrição (Texto simples) */}
        {description && (
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
            {description}
          </p>
        )}

        {/* Botão CTA (Vindo de Object) */}
        {cta && cta.label && (
          <a
            href={cta.href || '#'}
            className={clsx(
              "px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105",
              cta.style === 'outline'
                ? "border-2 border-white text-white hover:bg-white hover:text-black"
                : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:shadow-blue-500/50"
            )}
          >
            {cta.label}
          </a>
        )}
      </div>
    </section>
  );
}