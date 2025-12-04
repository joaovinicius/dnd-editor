import React from 'react';
import { FieldDefinition } from '../types';
import editor from './editor.module.css';
import { generateDefaultProps } from '../utils/config';

interface FieldRendererProps {
  name?: string; // Name is helpful for radio groups and accessibility
  field: FieldDefinition;
  value: any;
  onChange: (newValue: any) => void;
}

export const FieldRenderer = ({ name, field, value, onChange }: FieldRendererProps) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = field.type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(val);
  };

  switch (field.type) {
    case 'text':
    case 'number':
    case 'color':
      return (
        <input
          className={editor.input}
          type={field.type}
          value={value ?? ''}
          onChange={handleInputChange}
          placeholder={field.label}
        />
      );

    case 'textarea':
      return (
        <textarea
          className={editor.textarea}
          value={value ?? ''}
          onChange={handleInputChange}
          rows={3}
        />
      );

    case 'select':
      return (
        <select className={editor.input} value={value ?? ''} onChange={handleInputChange}>
          <option value="" disabled>Selecione...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );

    case 'radio':
      return (
        <div className={editor.radioGroup}>
          {field.options?.map((opt) => (
            <label key={opt.value} className={editor.radioLabel}>
              <input
                type="radio"
                name={name} // Used for grouping radios
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      );

    case 'object':
      if (!field.objectFields) return <div className={editor.error}>Missing objectFields</div>;
      return (
        <div className={editor.nestedContainer}>
          {Object.entries(field.objectFields).map(([subKey, subField]) => (
            <div key={subKey} className={editor.fieldGroup}>
              <label className={editor.label}>{subField.label}</label>
              <FieldRenderer
                name={subKey}
                field={subField}
                value={value?.[subKey]}
                onChange={(newSubValue) => {
                  onChange({
                    ...value,
                    [subKey]: newSubValue
                  });
                }}
              />
            </div>
          ))}
        </div>
      );

    case 'slot':
      return (
        <div className={editor.slotPlaceholder}>
          Conteúdo gerenciado via Drag & Drop na área de visualização.
        </div>
      );

    case 'array':
      if (!field.arrayFields) {
        return <div className={editor.error}>Array field missing arrayFields definition.</div>;
      }

      const items: any[] = Array.isArray(value) ? value : [];

      const handleAddItem = () => {
        const newItemDefaultValue = generateDefaultProps(field.arrayFields!);
        onChange([...items, newItemDefaultValue]);
      };

      const handleRemoveItem = (indexToRemove: number) => {
        onChange(items.filter((_, index) => index !== indexToRemove));
      };

      const handleItemChange = (itemValue: any, indexToChange: number) => {
        onChange(items.map((item, index) => (index === indexToChange ? itemValue : item)));
      };

      return (
        <div className={editor.arrayContainer}>
          {items.length === 0 && (
            <p className={editor.arrayEmptyState}>Nenhum item. Adicione um para começar.</p>
          )}
          {items.map((item, index) => (
            <div key={index} className={editor.arrayItem}>
              <div className={editor.arrayItemHeader}>
                <label className={editor.arrayItemLabel}>{field.label ? `${field.label} ${index + 1}` : `Item ${index + 1}`}</label>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className={editor.arrayRemoveButton}
                  title="Remover Item"
                >
                  Remover
                </button>
              </div>
              {/* Render all fields defined in arrayFields for this item */}
              <div className={editor.arrayItemFields}>
                 {Object.entries(field.arrayFields!).map(([subKey, subField]) => (
                    <div key={subKey} className={editor.fieldGroup}>
                      <label className={editor.label}>{subField.label}</label>
                      <FieldRenderer
                        name={subKey}
                        field={subField}
                        value={item?.[subKey]}
                        onChange={(newSubVal) => {
                           // Update just this field in the item object
                           handleItemChange({ ...item, [subKey]: newSubVal }, index);
                        }}
                      />
                    </div>
                 ))}
              </div>
            </div>
          ))}
          <button onClick={handleAddItem} className={editor.arrayAddButton}>
            Adicionar Item
          </button>
        </div>
      );

    default:
      return (
        <div className={editor.error}>
          Tipo de campo desconhecido: {(field as any).type}
        </div>
      );
  }
};