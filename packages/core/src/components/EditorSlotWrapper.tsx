'use client';

import React, { useContext } from 'react';
import { EditorContext } from '../editor/EditorContext';
import { PageDataBlock } from '../types';

export const EditorSlot = ({ name, blocks }: { name: string, blocks: PageDataBlock[] }) => {
  const editorContext = useContext(EditorContext);

  if (editorContext) {
    const { SlotField } = editorContext;
    return <SlotField name={name} blocks={blocks || []} />;
  }

  // Safe fallback in case there is no context or pre-rendering
  // (This should rarely happen if PageRenderer is correct)
  return null;
};