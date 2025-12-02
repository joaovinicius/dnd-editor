import { ComponentType, ReactNode } from 'react';

export type FieldType = 'text' | 'number' | 'color' | 'select' | 'textarea' | 'radio' | 'object' | 'slot';

export interface FieldDefinition {
  type: FieldType;
  label: string;
  name: string;
  defaultValue?: any;
  options?: { label: string; value: string }[];
  fields?: FieldDefinition[];
}

export interface ComponentConfig<P = any> {
  component: ComponentType<P>;
  fields: FieldDefinition[];
  label: string;
}

export type ConfigMap = Record<string, ComponentConfig>;

export interface PageDataBlock {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface PageData {
  blocks: PageDataBlock[];
}