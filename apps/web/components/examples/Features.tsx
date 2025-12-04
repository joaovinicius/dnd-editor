import React from 'react';
import { LucideIcon, Zap, Shield, Globe } from 'lucide-react';

interface FeaturesProps {
  title: string;
  activeColor: string; // Ex: 'text-blue-500' ou hex
}

export default function Features({ title, activeColor = '#3b82f6' }: FeaturesProps) {
  // Em um cenário real, esses itens poderiam vir via props de uma lista complexa
  // Para performance, ícones devem ser importados individualmente
  const features = [
    { title: 'SSR Nativo', icon: Globe, desc: 'Renderização no servidor para SEO perfeito.' },
    { title: 'Tree Shaking', icon: Zap, desc: 'Removemos código morto automaticamente.' },
    { title: 'Type Safe', icon: Shield, desc: 'Desenvolvimento seguro com TypeScript.' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
              <div className="mb-4" style={{ color: activeColor }}>
                <f.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">{f.title}</h3>
              <p className="text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}