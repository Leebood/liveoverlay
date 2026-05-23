// src/app/api/products/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isWithinLimit } from '@/lib/plan-limits';
import type { PlanType } from '@/types/plan';

// GET /api/products?storeId=xxx
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ error: 'storeId is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(`查询商品失败: ${error.message}`);

    return NextResponse.json({ products: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { storeId, name, price, description, originalPrice, images, tag, category, buyUrl } = body;

    if (!storeId || !name || price === undefined) {
      return NextResponse.json({ error: 'storeId, name, and price are required' }, { status: 400 });
    }

    // Check plan limits
    const planType = ((session.user as unknown as Record<string, unknown>).planType as PlanType) || 'free';
    const supabase = getSupabaseClient();

    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .eq('is_active', true);

    if (countError) throw new Error(`统计商品失败: ${countError.message}`);

    if (!isWithinLimit(planType, 'maxProducts', count || 0)) {
      return NextResponse.json({ error: '商品数量已达上限，请升级计划' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        store_id: storeId,
        name,
        price: String(price),
        original_price: originalPrice ? String(originalPrice) : null,
        description: description || null,
        images: JSON.stringify(images || []),
        tag: tag || null,
        category: category || null,
        buy_url: buyUrl || null,
      })
      .select()
      .single();

    if (error) throw new Error(`创建商品失败: ${error.message}`);

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
