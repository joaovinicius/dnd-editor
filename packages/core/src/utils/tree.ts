import { PageDataBlock } from '../types';

// Nova função: Retorna o caminho [Root, Avô, Pai, Item]
export const findPathToNode = (
  blocks: PageDataBlock[],
  targetId: string,
  path: PageDataBlock[] = []
): PageDataBlock[] | null => {
  for (const block of blocks) {
    // 1. Encontrou? Retorna o caminho + o item
    if (block.id === targetId) {
      return [...path, block];
    }

    // 2. Procura nos filhos
    for (const key in block.props) {
      if (Array.isArray(block.props[key])) {
        const found = findPathToNode(block.props[key] as PageDataBlock[], targetId, [...path, block]);
        if (found) return found;
      }
    }
  }
  return null;
};

// Encontra um bloco pelo ID em qualquer nível da árvore
export const findBlock = (blocks: PageDataBlock[], id: string): PageDataBlock | null => {
  for (const block of blocks) {
    if (block.id === id) return block;
    // Procura dentro das props que são arrays (Slots)
    for (const key in block.props) {
      if (Array.isArray(block.props[key])) {
        const found = findBlock(block.props[key], id);
        if (found) return found;
      }
    }
  }
  return null;
};

// Encontra o container (pai) de um bloco e retorna o array onde ele está
export const findContainer = (
  blocks: PageDataBlock[],
  id: string
): { container: PageDataBlock[], parent: PageDataBlock | null, propName: string | null } | undefined => {

  // Verifica se está na raiz
  if (blocks.find(b => b.id === id)) {
    return { container: blocks, parent: null, propName: null };
  }

  for (const block of blocks) {
    for (const key in block.props) {
      if (Array.isArray(block.props[key])) {
        const children = block.props[key] as PageDataBlock[];
        // Verifica se é filho direto deste slot
        if (children.find(c => c.id === id)) {
          return { container: children, parent: block, propName: key };
        }
        // Recursão
        const found = findContainer(children, id);
        if (found) return found;
      }
    }
  }
  return undefined;
};


export const findBlockById = (blocks: PageDataBlock[], id: string): PageDataBlock | null => {
  for (const block of blocks) {
    if (block.id === id) return block;
    for (const key in block.props) {
      if (Array.isArray(block.props[key])) {
        const found = findBlockById(block.props[key], id);
        if (found) return found;
      }
    }
  }
  return null;
};