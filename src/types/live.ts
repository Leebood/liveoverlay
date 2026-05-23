// src/types/live.ts

export interface LiveSession {
  id: string;
  store_id: string;
  title: string | null;
  platform: string;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  peak_viewers: number;
  total_interactions: number;
  product_stats: string; // JSON string
  overlay_ids: string; // JSON string of string[]
  created_at: string;
}

export type ControlAction =
  | 'highlight_product'
  | 'unhighlight_product'
  | 'toggle_visibility'
  | 'show_countdown'
  | 'hide_countdown'
  | 'flash_deal'
  | 'update_config';

export interface ControlPayload {
  action: ControlAction;
  timestamp: number;
  productId?: string;
  visible?: boolean;
  seconds?: number;
  text?: string;
  price?: number;
  duration?: number;
  config?: Record<string, unknown>;
}
