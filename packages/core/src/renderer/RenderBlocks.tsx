import styles from './style.module.css';
import { PageDataBlock, ConfigMap } from '../types';
import {Suspense} from "react";

interface RenderBlocksProps {
  blocks: PageDataBlock[];
  config: ConfigMap;
}

export const RenderBlocks = async ({ blocks, config }: RenderBlocksProps) => {
  if (!blocks || !Array.isArray(blocks)) return null;

  // We map the blocks in parallel (good for performance with async data)
  const renderedBlocks = await Promise.all(blocks.map(async (block) => {
    const componentConfig = config[block.type];

    if (!componentConfig) {
      console.warn(`[PageBuilder] Component "${block.type}" not found in config.`);
      return null;
    }

    const Component = componentConfig.component;

    // --- THE PERFORMANCE MAGIC (Prop Transformation) ---
    // We clone the props to avoid mutating the original
    const resolvedProps: Record<string, any> = { ...block.props };

    // We check the CONFIGURATION for fields of type 'slot' or recursive 'object'
    // and pre-render their contents.
    for (const field of componentConfig.fields) {
      if (field.type === 'slot') {
        const childBlocks = block.props[field.name] as PageDataBlock[];
        // Recursion: Render children HERE on the server
        if (childBlocks && childBlocks.length > 0) {
          resolvedProps[field.name] = await RenderBlocks({
            blocks: childBlocks,
            config
          });
        } else {
          resolvedProps[field.name] = null;
        }
      }
      // Optional: If 'object' has slots inside, deeper recursion would be needed here.
    }

    // Returns the component with individual Suspense for Streaming
    return (
      <div key={block.id} data-block-id={block.id}>
        <Suspense fallback={<div className={styles.fallback} />}>
          {/* @ts-ignore - TS sometimes complains about Async Components, but it's valid in Next.js 14 app router */}
          <Component {...resolvedProps} />
        </Suspense>
      </div>
    );
  }));

  return <>{renderedBlocks}</>;
};