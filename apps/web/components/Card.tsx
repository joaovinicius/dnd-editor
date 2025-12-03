import React from 'react';
import { Slot } from '@dnd-editor/core';

interface CardProps {
  title: string;
  // Importante: Tipamos como ReactNode | any para aceitar tanto
  // o HTML pré-renderizado (Server) quanto o JSON (Editor)
  children?: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 m-0">
          {title}
        </h3>
      </div>

      <div className="p-6 flex-1">
        {/*
          O Slot gerencia a mágica:
          - No servidor: Renderiza o HTML que já chegou pronto.
          - No editor: Cria uma zona de drop pontilhada.
        */}
        <Slot name="children" blocks={children} />
      </div>
    </div>
  );
}