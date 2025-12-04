'use client';

import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
  useDraggable,
  closestCorners,
  MeasuringStrategy
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { GripVertical, Trash, ChevronRight, Layers } from 'lucide-react';
import { clsx } from 'clsx';

// Internal Imports
import { ConfigMap, PageData, PageDataBlock, FieldDefinition, ComponentConfig } from '../types';
import { FieldRenderer } from './FieldRenderer';
import { EditorContext } from './EditorContext';
import { SlotField } from './SlotField';
import { BlockContext } from './BlockContext';
import editor from './editor.module.css';

// Tree utilities (ensure they exist at src/utils/tree.ts)
import { findContainer, findPathToNode, findBlockById } from '../utils/tree';
import { generateComponentDefaultProps } from '../utils/config';

// --- Local State Mutation Helpers ---

const updateBlockInTree = (blocks: PageDataBlock[], id: string, newProps: any): PageDataBlock[] => {
  return blocks.map(block => {
    if (block.id === id) {
      return { ...block, props: { ...block.props, ...newProps } };
    }
    const newPropsObj = { ...block.props };
    let hasChanges = false;

    for (const key in newPropsObj) {
      if (Array.isArray(newPropsObj[key])) {
        const updatedChildren = updateBlockInTree(newPropsObj[key], id, newProps);
        if (updatedChildren !== newPropsObj[key]) {
          newPropsObj[key] = updatedChildren;
          hasChanges = true;
        }
      }
    }
    return hasChanges ? { ...block, props: newPropsObj } : block;
  });
};

const removeBlockFromTree = (blocks: PageDataBlock[], id: string): PageDataBlock[] => {
  return blocks.filter(block => block.id !== id).map(block => {
    const newProps = { ...block.props };
    for (const key in newProps) {
      if (Array.isArray(newProps[key])) {
        newProps[key] = removeBlockFromTree(newProps[key], id);
      }
    }
    return { ...block, props: newProps };
  });
};



/* --- Sidebar Item Component --- */
const DraggableSidebarItem = ({ type, label }: { type: string, label: string }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `sidebar-${type}`,
    data: { type, label, isSidebar: true }
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={editor.draggableItem}>
      <GripVertical size={16} style={{ color: '#9ca3af' }} />
      {label}
    </div>
  );
};


/* --- MAIN EDITOR --- */
interface EditorProps {
  config: ConfigMap;
  initialData?: PageData;
  onSave: (data: PageData) => void;
}

export const PageEditor = ({ config, initialData, onSave }: EditorProps) => {
  const [blocks, setBlocks] = useState<PageDataBlock[]>(initialData?.blocks || []);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // --- Breadcrumbs Logic ---
  const selectedPath = useMemo(() => {
    if (!selectedBlockId) return [];
    return findPathToNode(blocks, selectedBlockId) || [];
  }, [blocks, selectedBlockId]);

  // --- Action Handlers ---

  const handleUpdateProps = (id: string, props: any) => {
    setBlocks(prev => updateBlockInTree(prev, id, props));
  };

  const handleRemove = (id: string) => {
    setBlocks(prev => removeBlockFromTree(prev, id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    setBlocks(currentBlocks => {
      const info = findContainer(currentBlocks, id);
      if (!info) return currentBlocks; // No block found or invalid container

      const { container, parent, propName } = info;
      const oldIndex = container.findIndex(b => b.id === id);
      if (oldIndex === -1) return currentBlocks; // Block not found in container

      let newIndex = direction === 'up' ? oldIndex - 1 : oldIndex + 1;
      // Ensure newIndex is within bounds
      if (newIndex < 0 || newIndex >= container.length) return currentBlocks;

      // Create a new array with the block moved
      const newContainer = arrayMove(container, oldIndex, newIndex);

      if (parent && propName) {
        // If the moved block is within a nested slot
        // Use updateBlockInTree to immutably update the parent's specific slot property
        return updateBlockInTree(currentBlocks, parent.id, { [propName]: newContainer });
      } else {
        // If the moved block is at the root level
        return newContainer;
      }
    });
  };

  // --- Drag and Drop Logic ---

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current) {
      setActiveDragItem(event.active.data.current);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (active.data.current?.isSidebar) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeInfo = findContainer(blocks, activeId);
    const overInfo = findContainer(blocks, overId);

    if (!activeInfo || !overInfo) return;

    // Logic to move between different containers (Slots) during drag
    if (activeInfo.container !== overInfo.container) {
      setBlocks(prev => {
        const clone = JSON.parse(JSON.stringify(prev));
        const source = findContainer(clone, activeId);
        const target = findContainer(clone, overId);

        if (!source || !target) return prev;

        const activeIndex = source.container.findIndex(b => b.id === activeId);
        const overIndex = target.container.findIndex(b => b.id === overId);

        let newIndex;
        if (target.container.find(b => b.id === overId)) {
          // It's over an item, insert at its position
          newIndex = overIndex >= 0 ? overIndex : target.container.length + 1;
        } else {
          // It's over the empty container
          newIndex = target.container.length + 1;
        }

        const [movedBlock] = source.container.splice(activeIndex, 1);
        target.container.splice(newIndex, 0, movedBlock);

        return clone;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;

    // 1. Sidebar Drop (New Item)
    if (active.data.current?.isSidebar) {
      const type = active.data.current.type;
      const newBlock: PageDataBlock = {
        id: nanoid(),
        type,
        props: generateComponentDefaultProps(config[type])
      };

      setBlocks(prev => {
        if (over.data.current?.isSlot) {
          const { parentId, slotName } = over.data.current;
          if (parentId === 'root') {
            // Add to root level if dropped into root slot
            return [...prev, newBlock];
          } else {
            // Add to nested slot
            const parentBlock = findBlockById(prev, parentId);
            if (parentBlock && Array.isArray(parentBlock.props[slotName])) {
              const newChildren = [...parentBlock.props[slotName], newBlock];
              return updateBlockInTree(prev, parentId, { [slotName]: newChildren });
            }
          }
        } else {
          // Dropped on an existing item, insert next to it
          const overInfo = findContainer(prev, over.id as string);
          if (overInfo) {
            const { container, parent, propName } = overInfo;
            const idx = container.findIndex(b => b.id === over.id);
            const newContainer = [...container.slice(0, idx + 1), newBlock, ...container.slice(idx + 1)];

            if (parent && propName) {
              return updateBlockInTree(prev, parent.id, { [propName]: newContainer });
            } else {
              // Root level insertion
              return newContainer;
            }
          } else {
            // Fallback: If no overInfo, add to root (should not happen if over is valid)
            return [...prev, newBlock];
          }
        }
        return prev;
      });

      // Defer selection to allow state update to settle and avoid race conditions
      requestAnimationFrame(() => {
        setSelectedBlockId(newBlock.id);
      });
      return;
    }

    // 2. Reorder Drop (Same Container)
    const activeInfo = findContainer(blocks, active.id as string);
    const overInfo = findContainer(blocks, over.id as string);

    if (activeInfo && overInfo && activeInfo.container === overInfo.container) {
      const activeIndex = activeInfo.container.findIndex(b => b.id === active.id);
      const overIndex = overInfo.container.findIndex(b => b.id === over.id);

      if (activeIndex !== overIndex) {
        setBlocks(prev => {
          const clone = JSON.parse(JSON.stringify(prev));
          const info = findContainer(clone, active.id as string);
          if (info) {
            const moved = arrayMove(info.container, activeIndex, overIndex);
            if (info.parent && info.propName) {
              info.parent.props[info.propName] = moved;
            } else {
              return moved;
            }
          }
          return clone;
        });
      }
    }
  };

  const selectedBlock = selectedBlockId ? findBlockById(blocks, selectedBlockId) : null;
  const selectedBlockConfig = selectedBlock ? config[selectedBlock.type] : null;

  const renderPropertiesForm = (cfg: ComponentConfig) => {
    if (cfg.type === 'array') {
      // Special handling for Array Component - Render a synthetic "items" field
      const fakeField: FieldDefinition = {
        type: 'array',
        label: 'Items',
        arrayFields: cfg.arrayFields
      };
      return (
        <div className={editor.fieldGroup}>
          <label className={editor.label}>Items</label>
          <FieldRenderer 
            name="items"
            field={fakeField} 
            value={selectedBlock!.props.items} 
            onChange={(val) => handleUpdateProps(selectedBlock!.id, { items: val })} 
          />
        </div>
      );
    }

    const fields = cfg.type === 'object' ? cfg.objectFields : (cfg.fields || {});
    
    if (Object.keys(fields).length === 0) {
       return <p className={editor.noProperties}>Este componente não possui propriedades.</p>;
    }

    return Object.entries(fields).map(([key, field]) => (
      <div key={key} className={editor.fieldGroup}>
        <label className={editor.label}>{field.label}</label>
        <FieldRenderer
          name={key}
          field={field}
          value={selectedBlock!.props[key]}
          onChange={(val) => handleUpdateProps(selectedBlock!.id, { [key]: val })}
        />
      </div>
    ));
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
  };

  return (
    <EditorContext.Provider value={{
      config,
      SlotField,
      blocks,
      selectedBlockId,
      onSelect: setSelectedBlockId,
      onRemove: handleRemove,
      onMove: handleMove
    }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          }
        }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={editor.container}>

          {/* LEFT: Sidebar */}
          <div className={editor.sidebar}>
            <h3 className={editor.panelTitle}>Componentes</h3>
            {Object.entries(config).map(([key, item]) => (
              <DraggableSidebarItem key={key} type={key} label={item.label} />
            ))}
          </div>

          {/* CENTER: Canvas */}
          <div className={editor.canvas} onClick={() => setSelectedBlockId(null)}>
            <div className={editor.canvasContent}>
              {/* The root Canvas is a Slot with parentId='root' */}
              <BlockContext.Provider value={{ parentId: 'root' }}>
                <SlotField name="root" blocks={blocks} />
              </BlockContext.Provider>
            </div>
          </div>

          {/* RIGHT: Properties */}
          <div className={editor.properties}>
            <h3 className={editor.panelTitle}>Propriedades</h3>

            {selectedBlock && selectedBlockConfig ? (
              <div className={editor.propertiesContent}>

                {/* Breadcrumbs (Hierarchical Navigation) */}
                <div className={editor.breadcrumbs}>
                  <Layers size={12} className={editor.breadcrumbIcon} />
                  <button
                    onClick={() => setSelectedBlockId(null)}
                    className={editor.breadcrumbButton}
                  >
                    Raiz
                  </button>

                  {selectedPath.map((node) => (
                    <React.Fragment key={node.id}>
                      <ChevronRight size={10} className={editor.breadcrumbChevron} />
                      <button
                        onClick={() => setSelectedBlockId(node.id)}
                        className={clsx(
                          "breadcrumbButton",
                          node.id === selectedBlockId && "breadcrumbButtonActive"
                        )}
                        title={config[node.type]?.label || node.type}
                      >
                        {config[node.type]?.label || node.type}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* Edit Header */}
                <div className={editor.propHeaderRow}>
                  <div>
                    <p className={editor.propHeaderLabel}>Editando</p>
                    <p className={editor.propHeaderName}>{selectedBlockConfig.label}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(selectedBlock.id)}
                    className={editor.propDeleteButton}
                    title="Excluir"
                  >
                    <Trash size={16} />
                  </button>
                </div>

                {/* Input Fields */}
                {renderPropertiesForm(selectedBlockConfig)}

              </div>
            ) : (
              <p className={editor.propEmptyState}>Selecione um bloco para editar</p>
            )}

            <div className={editor.saveButtonContainer}>
              <button className={editor.saveButton} onClick={() => onSave({ blocks })}>
                Salvar Página
              </button>
            </div>
          </div>
        </div>

        {/* OVERLAY: Floating item during drag */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDragItem ? (
            <div className={clsx(editor.draggableItem, editor.overlayItem)}>
              {activeDragItem.label || "Movendo..."}
            </div>
          ) : null}
        </DragOverlay>

      </DndContext>
    </EditorContext.Provider>
  );
};