// src/app/api/overlay/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isTemplateAllowed } from '@/lib/plan-limits';
import { friendlyDbError } from '@/lib/db-errors';
import type { PlanType } from '@/types/plan';

// GET /api/overlay?storeId=xxx
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ error: '缺少店铺信息' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('overlays')
      .select('*')
      .eq('store_id', storeId)
      .eq('is_active', true);

    if (error) throw new Error(friendlyDbError('查询Overlay', error.message));

    return NextResponse.json({ overlays: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : '操作失败，请稍后再试';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/overlay
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const body = await request.json();
    const { storeId, name, templateId, componentType, config, productIds, width, height } = body;

    if (!storeId || !name || !templateId) {
      return NextResponse.json({ error: '店铺、名称和模板为必填项' }, { status: 400 });
    }

    // Check template access
    const planType = ((session.user as unknown as Record<string, unknown>).planType as PlanType) || 'free';
    if (!isTemplateAllowed(planType, templateId)) {
      return NextResponse.json({ error: '当前计划不支持此模板，请升级' }, { status: 403 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('overlays')
      .insert({
        store_id: storeId,
        name,
        template_id: templateId,
        component_type: componentType || 'scrolling_ticker',
        config: JSON.stringify(config || {}),
        product_ids: JSON.stringify(productIds || []),
        width: width || 1920,
        height: height || 120,
      })
      .select()
      .single();

    if (error) throw new Error(friendlyDbError('创建Overlay', error.message));

    return NextResponse.json({ overlay: data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : '操作失败，请稍后再试';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
