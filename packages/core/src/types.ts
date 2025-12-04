import { ComponentType, ReactNode } from 'react';

export type FieldType = 'text' | 'number' | 'color' | 'select' | 'textarea' | 'radio' | 'object' | 'slot' | 'array';

export interface BaseFieldDefinition {
  label?: string;
  defaultValue?: any;
  options?: { label: string; value: string }[];
}

export interface TextFieldDefinition extends BaseFieldDefinition {
  type: 'text' | 'number' | 'color' | 'textarea' | 'radio' | 'select';
}

export interface SlotFieldDefinition extends BaseFieldDefinition {
  type: 'slot';
}

export interface ObjectFieldDefinition extends BaseFieldDefinition {
  type: 'object';
  objectFields: Record<string, FieldDefinition>;
}

export interface ArrayFieldDefinition extends BaseFieldDefinition {
  type: 'array';
  arrayFields: Record<string, FieldDefinition>;
}

export type FieldDefinition = TextFieldDefinition | SlotFieldDefinition | ObjectFieldDefinition | ArrayFieldDefinition;

export interface BaseComponentConfig<P = any> {
  component: ComponentType<P>;
  label: string;
}

export interface StandardComponentConfig<P = any> extends BaseComponentConfig<P> {
  type?: never;
  fields: Record<string, FieldDefinition>;
}

export interface ObjectComponentConfig<P = any> extends BaseComponentConfig<P> {
  type: 'object';
  objectFields: Record<string, FieldDefinition>;
}

export interface ArrayComponentConfig<P = any> extends BaseComponentConfig<P> {
  type: 'array';
  arrayFields: Record<string, FieldDefinition>;
}

export type ComponentConfig<P = any> = StandardComponentConfig<P> | ObjectComponentConfig<P> | ArrayComponentConfig<P>;

export type ConfigMap = Record<string, ComponentConfig>;

export interface PageDataBlock {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface PageData {
  blocks: PageDataBlock[];
}