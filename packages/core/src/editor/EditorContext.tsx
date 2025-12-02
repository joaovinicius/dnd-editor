'use client'

import { createContext } from 'react';
import { ConfigMap, PageDataBlock } from '../types';

interface EditorContextType {
  config: ConfigMap;
  SlotField: React.ComponentType<any>;
  blocks: PageDataBlock[];
  selectedBlockId: string | null;
  onSelect: (id: string | null) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

export const EditorContext = createContext<EditorContextType | null>(null);