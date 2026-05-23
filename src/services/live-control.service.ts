// src/services/live-control.service.ts

import { getSupabaseServerClient, getControlChannel } from '@/lib/supabase';
import type { ControlAction, ControlPayload } from '@/types/live';

export async function sendControlCommand(
  storeId: string,
  action: ControlAction,
  payload?: Record<string, unknown>
): Promise<void> {
  const supabase = getSupabaseServerClient();
  const channel = getControlChannel(storeId);

  const controlPayload: ControlPayload = {
    action,
    timestamp: Date.now(),
    ...payload,
  } as ControlPayload;

  await supabase.channel(channel).send({
    type: 'broadcast',
    event: 'control',
    payload: controlPayload,
  });
}

export async function highlightProduct(storeId: string, productId: string): Promise<void> {
  await sendControlCommand(storeId, 'highlight_product', { productId });
}

export async function unhighlightProduct(storeId: string): Promise<void> {
  await sendControlCommand(storeId, 'unhighlight_product');
}

export async function toggleOverlayVisibility(storeId: string, visible: boolean): Promise<void> {
  await sendControlCommand(storeId, 'toggle_visibility', { visible });
}

export async function showCountdown(storeId: string, seconds: number, text: string): Promise<void> {
  await sendControlCommand(storeId, 'show_countdown', { seconds, text });
}

export async function hideCountdown(storeId: string): Promise<void> {
  await sendControlCommand(storeId, 'hide_countdown');
}

export async function flashDeal(storeId: string, productId: string, price: number, duration: number): Promise<void> {
  await sendControlCommand(storeId, 'flash_deal', { productId, price, duration });
}
