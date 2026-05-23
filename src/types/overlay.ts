// src/types/overlay.ts

import type { OverlayComponent } from './template';

export interface Overlay {
  id: string;
  store_id: string;
  name: string;
  template_id: string;
  component_type: OverlayComponent;
  config: string; // JSON string
  product_ids: string; // JSON string of string[]
  show_all_products: boolean;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  orientation: string;
  is_visible: boolean;
  is_active: boolean;
  highlighted_product_id: string | null;
  overlay_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface OverlayFormData {
  name: string;
  templateId: string;
  productIds?: string[];
  showAllProducts?: boolean;
  config?: Record<string, unknown>;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  orientation?: string;
}
