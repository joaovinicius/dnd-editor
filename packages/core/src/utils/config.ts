import { ConfigMap, PageDataBlock, FieldDefinition, ComponentConfig } from '../types';

/**
 * Analyzes the page data and returns a subset of the configuration
 * containing only the components actually used in the page.
 * This helps with code splitting and reducing bundle size.
 */
export function trimConfig(fullConfig: ConfigMap, blocks: PageDataBlock[]): ConfigMap {
  const usedTypes = new Set<string>();

  // Helper to traverse the tree and collect types
  function traverse(nodeList: PageDataBlock[]) {
    for (const block of nodeList) {
      usedTypes.add(block.type);

      // Traverse props to find nested slots (children)
      // We need to look into the config to know which props are slots, 
      // OR we can just blindly look for array props that look like blocks.
      // But looking at the block structure is safer if we assume children are in props.
      
      // A more robust approach is to iterate over all props and check if they are arrays of blocks
      for (const key in block.props) {
        const propValue = block.props[key];
        if (Array.isArray(propValue) && propValue.length > 0) {
          // Check if the first item looks like a block (has id and type)
          const firstItem = propValue[0];
          if (typeof firstItem === 'object' && firstItem !== null && 'type' in firstItem && 'id' in firstItem) {
            traverse(propValue as PageDataBlock[]);
          }
        }
      }
    }
  }

  if (blocks) {
    traverse(blocks);
  }

  // Create new config with only used types
  const trimmed: ConfigMap = {};
  usedTypes.forEach(type => {
    if (fullConfig[type]) {
      trimmed[type] = fullConfig[type];
    }
  });

  return trimmed;
}

export const generateDefaultProps = (fields: Record<string, FieldDefinition>): Record<string, any> => {
  const props: Record<string, any> = {};
  
  for (const [key, field] of Object.entries(fields)) {
    if (field.type === 'object' && field.objectFields) {
      props[key] = generateDefaultProps(field.objectFields);
    } else if (field.type === 'slot') {
      props[key] = [];
    } else if (field.type === 'array') {
      props[key] = field.defaultValue || [];
    } else {
      props[key] = field.defaultValue;
    }
  }
  
  return props;
};

export const generateComponentDefaultProps = (config: ComponentConfig): Record<string, any> => {
  if (config.type === 'object') {
    return generateDefaultProps(config.objectFields);
  } else if (config.type === 'array') {
    // For array components, we don't generate default props for the items here.
    // The component likely expects an empty state or specific init.
    return {}; 
  } else {
    // Standard component
    return generateDefaultProps(config.fields || {});
  }
};
