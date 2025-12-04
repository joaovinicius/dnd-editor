import styles from './style.module.css';
import { PageDataBlock, ConfigMap, FieldDefinition } from '../types';
import {Fragment, Suspense} from "react";

interface RenderBlocksProps {
  blocks: PageDataBlock[];
  config: ConfigMap;
}

// Helper to recursively resolve slots in props (including nested objects/arrays)
const resolveSlots = async (props: any, fields: Record<string, FieldDefinition>, config: ConfigMap): Promise<any> => {
  if (!props || typeof props !== 'object') return props;
  
  const newProps = { ...props };

  for (const [key, field] of Object.entries(fields)) {
    if (field.type === 'slot') {
      const childBlocks = props[key] as PageDataBlock[];
      // Recursion: Render children HERE on the server
      if (childBlocks && Array.isArray(childBlocks) && childBlocks.length > 0) {
        newProps[key] = await RenderBlocks({
          blocks: childBlocks,
          config
        });
      } else {
        newProps[key] = null;
      }
    } else if (field.type === 'object' && field.objectFields) {
      if (props[key]) {
        newProps[key] = await resolveSlots(props[key], field.objectFields, config);
      }
    } else if (field.type === 'array' && field.arrayFields) {
      if (Array.isArray(props[key])) {
        newProps[key] = await Promise.all(props[key].map(async (item: any) => {
          return await resolveSlots(item, field.arrayFields!, config);
        }));
      }
    }
  }
  return newProps;
};

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

    let resolvedProps = { ...block.props };

    // Resolve slots based on configuration type
    if (componentConfig.type === 'object') {
       resolvedProps = await resolveSlots(block.props, componentConfig.objectFields, config);
    } else if (componentConfig.type === 'array') {
       // No root-level field mapping for Array Component yet
    } else {
       // Standard component
       resolvedProps = await resolveSlots(block.props, componentConfig.fields || {}, config);
    }

    // Returns the component with individual Suspense for Streaming
    return (
      <Fragment key={block.id} data-block-id={block.id}>
        <Suspense fallback={<div className={styles.fallback} />}>
          {/* @ts-ignore - TS sometimes complains about Async Components, but it's valid in Next.js 14 app router */}
          <Component {...resolvedProps} />
        </Suspense>
      </Fragment>
    );
  }));

  return <>{renderedBlocks}</>;
};