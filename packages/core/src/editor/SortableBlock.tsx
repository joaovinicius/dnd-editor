import React, { Suspense } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash, ArrowUp, ArrowDown, GripVertical, CornerLeftUp } from 'lucide-react';
import { clsx } from 'clsx';
import { PageDataBlock, ConfigMap } from '../types';
import { BlockContext } from './BlockContext';
import editor from './editor.module.css';

interface SortableBlockProps {
  block: PageDataBlock;
  config: ConfigMap;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onClick: () => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  parentId: string;
  onSelectParent: () => void;
}

export const SortableBlock = ({
                                block,
                                config,
                                isSelected,
                                isFirst,
                                isLast,
                                onClick,
                                onRemove,
                                onMove,
                                parentId,
                                onSelectParent,
                              }: SortableBlockProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: block.id,
    data: { isBlock: true, block }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const Component = config[block.type]?.component;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        editor.sortableItem,
        isSelected && editor.selected
        // We removed the 'group' class from Tailwind, the CSS Module handles :hover
      )}
      onClick={handleClick}
      data-block-id={block.id}
    >
      {/* --- Toolbar --- */}
      <div className={editor.blockToolbar}>
        {parentId !== 'root' && (
          <button
            className={editor.actionButton}
            onClick={(e) => { e.stopPropagation(); onSelectParent(); }}
            title="Select Parent"
          >
            <CornerLeftUp size={14} />
          </button>
        )}

        <button
          className={editor.actionButton}
          disabled={isFirst}
          onClick={(e) => { e.stopPropagation(); onMove(block.id, 'up'); }}
          title="Move Up"
        >
          <ArrowUp size={14} />
        </button>

        <button
          className={editor.actionButton}
          disabled={isLast}
          onClick={(e) => { e.stopPropagation(); onMove(block.id, 'down'); }}
          title="Move Down"
        >
          <ArrowDown size={14} />
        </button>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={clsx(editor.actionButton, editor.dragHandle)}
          title="Drag"
        >
          <GripVertical size={14} />
        </div>

        <button
          className={clsx(editor.actionButton, editor.deleteButton)}
          onClick={(e) => { e.stopPropagation(); onRemove(block.id); }}
          title="Remove"
        >
          <Trash size={14} />
        </button>
      </div>

      {/* --- Component Content --- */}
      <div className={editor.componentWrapper}>
        <BlockContext.Provider value={{ parentId: block.id }}>
          {Component ? (
            <Suspense fallback={<div className={editor.fallback}>Loading...</div>}>
              <Component {...block.props} />
            </Suspense>
          ) : (
            <div className={editor.componentError}>
              Component <strong>{block.type}</strong> not found.
            </div>
          )}
        </BlockContext.Provider>

        {/* Interaction Mask (Prevents clicks on internal links when not selected) */}
        {!isSelected && (
          <div
            className={editor.componentMask}
            onClick={handleClick}
          />
        )}

        {/* Hover Feedback Border (Replacing the div with Tailwind classes) */}
        <div className={editor.hoverFeedback} />
      </div>
    </div>
  );
};