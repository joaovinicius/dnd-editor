import React, { useContext } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { clsx } from 'clsx';
import { PageDataBlock } from '../types';
import { SortableBlock } from './SortableBlock';
import { useBlockContext } from './BlockContext';
import { EditorContext } from './EditorContext';
import styles from './style.module.css'; // Importing the CSS Module

interface SlotFieldProps {
  name: string;
  blocks: PageDataBlock[];
}

export const SlotField = ({ name, blocks }: SlotFieldProps) => {
  const { parentId } = useBlockContext();
  const editorCtx = useContext(EditorContext);

  // Unique ID for the drop area: "parent-id:slot-name"
  const dropZoneId = `${parentId}:${name}`;

  const { setNodeRef, isOver } = useDroppable({
    id: dropZoneId,
    data: { isSlot: true, parentId, slotName: name }
  });

  const isRoot = parentId === 'root';

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        styles.slotField,
        // Apply Root OR Nested style
        isRoot ? styles.slotRoot : styles.slotNested,
        // Apply Hover style if dragging over
        isOver && styles.slotOver
      )}
    >
      <SortableContext
        id={dropZoneId}
        items={blocks.map(b => b.id)}
        strategy={verticalListSortingStrategy}
      >
        {blocks.map((block, index) => (
          <SortableBlock
            key={block.id}
            block={block}
            config={editorCtx!.config}
            isSelected={editorCtx!.selectedBlockId === block.id}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
            onClick={() => editorCtx!.onSelect(block.id)}
            onRemove={editorCtx!.onRemove}
            onMove={editorCtx!.onMove}
            parentId={parentId}
            onSelectParent={() => editorCtx!.onSelect(parentId === 'root' ? null : parentId)}
          />
        ))}

        {blocks.length === 0 && (
          <div className={styles.slotEmpty}>
            {isRoot ? "Drag components here to start" : `Slot: ${name} (Empty)`}
          </div>
        )}
      </SortableContext>
    </div>
  );
};