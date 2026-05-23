// src/app/overlay/[storeId]/[overlayId]/route.ts
// Public endpoint - serves overlay HTML for OBS browser source (no auth required)

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { buildOverlayHtml } from '@/overlay-engine/builder';
import { getControlChannel } from '@/lib/supabase';
import type { PlanType } from '@/types/plan';
import type { OverlayProduct } from '@/types/product';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; overlayId: string }> }
) {
  try {
    const { storeId, overlayId } = await params;

    const supabase = getSupabaseClient();

    // Get overlay
    const { data: overlay, error: overlayError } = await supabase
      .from('overlays')
      .select('*')
      .eq('id', overlayId)
      .eq('store_id', storeId)
      .eq('is_active', true)
      .maybeSingle();

    if (overlayError || !overlay) {
      return NextResponse.json({ error: 'Overlay not found' }, { status: 404 });
    }

    // Get store owner's plan type
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
      if (owner?.plan_type) {
        planType = owner.plan_type as PlanType;
      }
    }

    // Get products
    const productIds: string[] = JSON.parse(overlay.product_ids || '[]');
    let products: OverlayProduct[] = [];

    if (overlay.show_all_products) {
      const { data: allProducts } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

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

    const config: Record<string, unknown> = JSON.parse(overlay.config || '{}');
    const controlChannel = getControlChannel(storeId);

    const html = buildOverlayHtml({
      storeId,
      overlayId,
      templateId: overlay.template_id,
      config,
      products,
      planType,
      controlChannel,
    });

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
