import React, { Suspense, lazy } from 'react';
import { PageDataBlock } from '../types';

// Dynamically import the EditorSlotWrapper using React.lazy.
// This is the standard React way to code-split and lazy-load components.
// The imported module must have a default export, so we create a synthetic one.
const EditorSlot = lazy(() => import('./EditorSlotWrapper').then(module => ({ default: module.EditorSlot })));


interface SlotProps {
  name: string;
  blocks: PageDataBlock[] | React.ReactNode; // Now accepts already rendered ReactNode!
}

export const Slot = ({ name, blocks }: SlotProps) => {
  // 1. If blocks have ALREADY been rendered by the Parent (RSC), just return them
  if (React.isValidElement(blocks) || (Array.isArray(blocks) && blocks.some(React.isValidElement))) {
    return <>{blocks}</>;
  }

  // 2. If it's a raw data array (JSON), it means we are in a client-side context
  // (like the editor) where pre-rendering hasn't happened.
  // In this case, we render the dynamically imported EditorSlot, wrapped in Suspense.
  return (
    <Suspense fallback={<div style={{ minHeight: '50px', width: '100%' }} />}>
      <EditorSlot name={name} blocks={blocks as PageDataBlock[]} />
    </Suspense>
  );
};