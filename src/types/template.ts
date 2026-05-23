// src/types/template.ts

import type { PlanType } from './plan';

export type TemplateCategory = 'ticker' | 'product_card' | 'badge' | 'side_panel' | 'banner' | 'countdown';
export type OverlayComponent = 'scrolling_ticker' | 'product_card' | 'corner_badge' | 'side_panel' | 'top_banner' | 'countdown';

export interface TemplateConfigField {
  key: string;
  label: string;
  type: 'color' | 'font' | 'number' | 'select' | 'toggle' | 'text';
  defaultValue: unknown;
  minPlan?: PlanType;
  options?: { label: string; value: unknown }[];
  min?: number;
  max?: number;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  minPlan: PlanType;
  previewImage: string;
  configSchema: TemplateConfigField[];
  defaultConfig: Record<string, unknown>;
  componentType: OverlayComponent;
  supportedOrientations: ('horizontal' | 'vertical')[];
  recommendedSize: { width: number; height: number };
}
