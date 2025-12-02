import React from 'react';
import { Slot } from '@dnd-editor/core/src';

interface GridProps {
  columns: number;
  gap: number;
  children?: React.ReactNode;
}

export default function Grid({ columns = 2, gap = 4, children }: GridProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div
        className="grid w-full"
        style={{
          // Usamos style inline para o grid-template dinâmico
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap * 0.25}rem` // converte unidade tailwind (1 = 0.25rem)
        }}
      >
        <Slot name="children" blocks={children} />
      </div>
    </section>
  );
}