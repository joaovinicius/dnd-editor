import React from 'react';
import { FieldDefinition } from '../types';
import styles from './style.module.css';

interface FieldRendererProps {
  field: FieldDefinition;
  value: any;
  onChange: (newValue: any) => void;
}

export const FieldRenderer = ({ field, value, onChange }: FieldRendererProps) => {

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
          className={styles.input}
          type={field.type}
          value={value ?? ''}
          onChange={handleInputChange}
          placeholder={field.label}
        />
      );

    case 'textarea':
      return (
        <textarea
          className={styles.textarea}
          value={value ?? ''}
          onChange={handleInputChange}
          rows={3}
        />
      );

    case 'select':
      return (
        <select className={styles.input} value={value ?? ''} onChange={handleInputChange}>
          <option value="" disabled>Selecione...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );

    case 'radio':
      return (
        <div className={styles.radioGroup}>
          {field.options?.map((opt) => (
            <label key={opt.value} className={styles.radioLabel}>
              <input
                type="radio"
                name={field.name} // Importante para agrupar radios
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
      return (
        <div className={styles.nestedContainer}>
          {field.fields?.map((subField) => (
            <div key={subField.name} className={styles.fieldGroup}>
              <label className={styles.label}>{subField.label}</label>
              <FieldRenderer
                field={subField}
                value={value?.[subField.name]}
                onChange={(newSubValue) => {
                  onChange({
                    ...value,
                    [subField.name]: newSubValue
                  });
                }}
              />
            </div>
          ))}
        </div>
      );

    case 'slot':
      return (
        <div className={styles.slotPlaceholder}>
          Conteúdo gerenciado via Drag & Drop na área de visualização.
        </div>
      );

    default:
      return (
        <div className={styles.error}>
          Tipo de campo desconhecido: {field.type}
        </div>
      );
  }
};