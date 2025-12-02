'use client'

import { createContext, useContext } from 'react';
import { ConfigMap } from '../types';

const RendererContext = createContext<{ config: ConfigMap } | null>(null);

export const RendererProvider = RendererContext.Provider;

export const useRendererConfig = () => {
  const ctx = useContext(RendererContext);
  if (!ctx) throw new Error("RenderBlocks must be used within PageRenderer");
  return ctx;
};