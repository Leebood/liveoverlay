// src/app/api/overlay/config/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getTemplateDefinition } from '@/overlay-engine/registry';
import { friendlyDbError } from '@/lib/db-errors';

// GET /api/overlay/config?overlayId=xxx
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const overlayId = searchParams.get('overlayId');

    if (!overlayId) {
      return NextResponse.json({ error: 'overlayId is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('overlays')
      .select('*')
      .eq('id', overlayId)
      .maybeSingle();

    if (error) throw new Error(friendlyDbError('查询Overlay配置', error.message));
    if (!data) {
      return NextResponse.json({ error: 'Overlay不存在' }, { status: 404 });
    }

    // Get template schema for the config UI
    const templateDef = getTemplateDefinition(data.template_id);

    return NextResponse.json({
      overlay: data,
      templateSchema: templateDef?.configSchema || [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '操作失败，请稍后再试';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/overlay/config
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const body = await request.json();
    const { overlayId, config, productIds, name, width, height, positionX, positionY } = body;

    if (!overlayId) {
      return NextResponse.json({ error: '缺少Overlay ID' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (config !== undefined) updateData.config = JSON.stringify(config);
    if (productIds !== undefined) updateData.product_ids = JSON.stringify(productIds);
    if (name !== undefined) updateData.name = name;
    if (width !== undefined) updateData.width = width;
    if (height !== undefined) updateData.height = height;
    if (positionX !== undefined) updateData.position_x = positionX;
    if (positionY !== undefined) updateData.position_y = positionY;

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('overlays')
      .update(updateData)
      .eq('id', overlayId)
      .select()
      .single();

    if (error) throw new Error(friendlyDbError('更新Overlay配置', error.message));

    return NextResponse.json({ overlay: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : '操作失败，请稍后再试';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
