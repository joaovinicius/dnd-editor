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
  useDraggable
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { GripVertical, Trash, ChevronRight, Layers } from 'lucide-react';
import { clsx } from 'clsx';

// Internal Imports
import { ConfigMap, PageData, PageDataBlock, FieldDefinition } from '../types';
import { FieldRenderer } from './FieldRenderer';
import { EditorContext } from './EditorContext';
import { SlotField } from './SlotField';
import { BlockContext } from './BlockContext';
import styles from './style.module.css';

// Tree utilities (ensure they exist at src/utils/tree.ts)
import { findContainer, findPathToNode, findBlockById } from '../utils/tree';

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

const generateDefaultProps = (fields: FieldDefinition[]): Record<string, any> => {
  return fields.reduce((acc, field) => {
    if (field.type === 'object' && field.fields) {
      acc[field.name] = generateDefaultProps(field.fields);
    } else if (field.type === 'slot') {
      acc[field.name] = [];
    } else {
      acc[field.name] = field.defaultValue;
    }
    return acc;
  }, {} as Record<string, any>);
};

/* --- Sidebar Item Component --- */
const DraggableSidebarItem = ({ type, label }: { type: string, label: string }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `sidebar-${type}`,
    data: { type, label, isSidebar: true }
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className={styles.draggableItem}>
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
    const info = findContainer(blocks, id);
    if (!info) return;

    const index = info.container.findIndex(b => b.id === id);
    if (index === -1) return;

    let newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= info.container.length) return;

    // Simplified deep clone
    const newBlocks = JSON.parse(JSON.stringify(blocks));
    // Re-locate in the cloned array
    const targetInfo = findContainer(newBlocks, id);

    if (targetInfo) {
      targetInfo.container = arrayMove(targetInfo.container, index, newIndex);

      if (targetInfo.parent && targetInfo.propName) {
        targetInfo.parent.props[targetInfo.propName] = targetInfo.container;
      } else {
        setBlocks(targetInfo.container);
        return;
      }
      setBlocks(newBlocks);
    }
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
    setActiveDragItem(null);
    const { active, over } = event;

    if (!over) return;

    // 1. Sidebar Drop (New Item)
    if (active.data.current?.isSidebar) {
      const type = active.data.current.type;
      const newBlock: PageDataBlock = {
        id: nanoid(),
        type,
        props: generateDefaultProps(config[type].fields)
      };

      setBlocks(prev => {
        const clone = JSON.parse(JSON.stringify(prev));

        if (over.data.current?.isSlot) {
          // Dropped directly into an empty Slot area
          const { parentId, slotName } = over.data.current;
          if (parentId === 'root') {
            clone.push(newBlock);
          } else {
            const parentBlock = findBlockById(clone, parentId);
            if (parentBlock && Array.isArray(parentBlock.props[slotName])) {
              parentBlock.props[slotName].push(newBlock);
            }
          }
        } else {
          // Dropped on an existing item
          const overInfo = findContainer(clone, over.id as string);
          if (overInfo) {
            const idx = overInfo.container.findIndex(b => b.id === over.id);
            overInfo.container.splice(idx + 1, 0, newBlock);
          } else {
            clone.push(newBlock);
          }
        }
        return clone;
      });
      setSelectedBlockId(newBlock.id);
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
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.container}>

          {/* LEFT: Sidebar */}
          <div className={styles.sidebar}>
            <h3 className={styles.panelTitle}>Componentes</h3>
            {Object.entries(config).map(([key, item]) => (
              <DraggableSidebarItem key={key} type={key} label={item.label} />
            ))}
          </div>

          {/* CENTER: Canvas */}
          <div className={styles.canvas} onClick={() => setSelectedBlockId(null)}>
            <div className={styles.canvasContent}>
              {/* The root Canvas is a Slot with parentId='root' */}
              <BlockContext.Provider value={{ parentId: 'root' }}>
                <SlotField name="root" blocks={blocks} />
              </BlockContext.Provider>
            </div>
          </div>

          {/* RIGHT: Properties */}
          <div className={styles.properties}>
            <h3 className={styles.panelTitle}>Propriedades</h3>

            {selectedBlock ? (
              <div className={styles.propertiesContent}>

                {/* Breadcrumbs (Hierarchical Navigation) */}
                <div className={styles.breadcrumbs}>
                  <Layers size={12} className={styles.breadcrumbIcon} />
                  <button
                    onClick={() => setSelectedBlockId(null)}
                    className={styles.breadcrumbButton}
                  >
                    Raiz
                  </button>

                  {selectedPath.map((node) => (
                    <React.Fragment key={node.id}>
                      <ChevronRight size={10} className={styles.breadcrumbChevron} />
                      <button
                        onClick={() => setSelectedBlockId(node.id)}
                        className={clsx(
                          styles.breadcrumbButton,
                          node.id === selectedBlockId && styles.breadcrumbButtonActive
                        )}
                        title={config[node.type]?.label || node.type}
                      >
                        {config[node.type]?.label || node.type}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* Edit Header */}
                <div className={styles.propHeaderRow}>
                  <div>
                    <p className={styles.propHeaderLabel}>Editando</p>
                    <p className={styles.propHeaderName}>{config[selectedBlock.type].label}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(selectedBlock.id)}
                    className={styles.propDeleteButton}
                    title="Excluir"
                  >
                    <Trash size={16} />
                  </button>
                </div>

                {/* Input Fields */}
                {config[selectedBlock.type].fields.map(field => (
                  <div key={field.name} className={styles.fieldGroup}>
                    <label className={styles.label}>{field.label}</label>
                    <FieldRenderer
                      field={field}
                      value={selectedBlock.props[field.name]}
                      onChange={(val) => handleUpdateProps(selectedBlock.id, { [field.name]: val })}
                    />
                  </div>
                ))}

                {config[selectedBlock.type].fields.length === 0 && (
                  <p className={styles.noProperties}>Este componente não possui propriedades.</p>
                )}
              </div>
            ) : (
              <p className={styles.propEmptyState}>Selecione um bloco para editar</p>
            )}

            <div className={styles.saveButtonContainer}>
              <button className={styles.saveButton} onClick={() => onSave({ blocks })}>
                Salvar Página
              </button>
            </div>
          </div>
        </div>

        {/* OVERLAY: Floating item during drag */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDragItem ? (
            <div className={clsx(styles.draggableItem, styles.overlayItem)}>
              {activeDragItem.label || "Movendo..."}
            </div>
          ) : null}
        </DragOverlay>

      </DndContext>
    </EditorContext.Provider>
  );
};