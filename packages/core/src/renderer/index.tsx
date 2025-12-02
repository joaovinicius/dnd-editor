import React from 'react';
import { ConfigMap, PageData } from '../types';
import { RenderBlocks } from './RenderBlocks';

interface PageRendererProps {
  config: ConfigMap;
  data: PageData;
}

// This is a native Server Component
export const PageRenderer = async ({ config, data }: PageRendererProps) => {
  if (!data?.blocks) return null;

  return (
    <div className="pb-renderer">
      <RenderBlocks blocks={data.blocks} config={config} />
    </div>
  );
};