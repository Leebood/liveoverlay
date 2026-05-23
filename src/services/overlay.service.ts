// src/services/overlay.service.ts

import { getSupabaseClient } from '@/storage/database/supabase-client';
import { buildOverlayHtml } from '@/overlay-engine/builder';
import { getControlChannel } from '@/lib/supabase';
import { getTemplateDefinition } from '@/overlay-engine/registry';
import { isTemplateAllowed } from '@/lib/plan-limits';
import type { PlanType } from '@/types/plan';
import type { OverlayProduct } from '@/types/product';

export async function getOverlays(storeId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('overlays')
    .select('*')
    .eq('store_id', storeId)
    .eq('is_active', true);

  if (error) throw new Error(`查询Overlay失败: ${error.message}`);
  return data;
}

export async function createOverlay(
  storeId: string,
  overlayData: {
    name: string;
    template_id: string;
    component_type: string;
    config?: Record<string, unknown>;
    product_ids?: string[];
    width?: number;
    height?: number;
  },
  planType: PlanType
) {
  if (!isTemplateAllowed(planType, overlayData.template_id)) {
    throw new Error('当前计划不支持此模板');
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('overlays')
    .insert({
      store_id: storeId,
      ...overlayData,
      config: JSON.stringify(overlayData.config || {}),
      product_ids: JSON.stringify(overlayData.product_ids || []),
    })
    .select()
    .single();

  if (error) throw new Error(`创建Overlay失败: ${error.message}`);
  return data;
}

export async function renderOverlay(storeId: string, overlayId: string): Promise<string> {
  const supabase = getSupabaseClient();

  const { data: overlay, error: overlayError } = await supabase
    .from('overlays')
    .select('*')
    .eq('id', overlayId)
    .eq('store_id', storeId)
    .maybeSingle();

  if (overlayError || !overlay) throw new Error('Overlay not found');

  // Get store owner plan
  const { data: store } = await supabase
    .from('stores')
    .select('owner_id')
    .eq('id', storeId)
    .maybeSingle();

  let planType: PlanType = 'free';
  if (store?.owner_id) {
    const { data: owner } = await supabase
      .from('users')
      .select('plan_type')
      .eq('id', store.owner_id)
      .maybeSingle();
    if (owner?.plan_type) planType = owner.plan_type as PlanType;
  }

  // Get products
  const productIds: string[] = JSON.parse(overlay.product_ids || '[]');
  let products: OverlayProduct[] = [];

  if (overlay.show_all_products) {
    const { data: allProducts } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .eq('is_active', true);

    if (allProducts) {
      products = allProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
        imageUrl: JSON.parse(p.images || '[]')[0] || '',
        tag: p.tag || undefined,
        buyUrl: p.buy_url || undefined,
      }));
    }
  } else if (productIds.length > 0) {
    const { data: selectedProducts } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (selectedProducts) {
      products = selectedProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
        imageUrl: JSON.parse(p.images || '[]')[0] || '',
        tag: p.tag || undefined,
        buyUrl: p.buy_url || undefined,
      }));
    }
  }

  const config = JSON.parse(overlay.config || '{}');
  const controlChannel = getControlChannel(storeId);

  return buildOverlayHtml({
    storeId,
    overlayId,
    templateId: overlay.template_id,
    config,
    products,
    planType,
    controlChannel,
  });
}
