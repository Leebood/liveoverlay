// src/app/api/settings/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { friendlyDbError } from '@/lib/db-errors';

// GET /api/settings?storeId=xxx
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ error: 'Missing storeId' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('stores')
      .select('id, name, currency, brand_logo')
      .eq('id', storeId)
      .maybeSingle();

    if (error) throw new Error(friendlyDbError('查询设置', error.message));

    return NextResponse.json({
      settings: data ? {
        storeName: data.name,
        currency: (data as Record<string, unknown>).currency || 'CNY',
        brandLogo: (data as Record<string, unknown>).brand_logo || null,
      } : null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT /api/settings
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { storeId, storeName, currency, brandLogo } = body;

    if (!storeId) {
      return NextResponse.json({ error: 'Missing storeId' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (storeName !== undefined) updateData.name = storeName;
    if (currency !== undefined) updateData.currency = currency;
    if (brandLogo !== undefined) updateData.brand_logo = brandLogo;

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('stores')
      .update(updateData)
      .eq('id', storeId)
      .select()
      .single();

    if (error) throw new Error(friendlyDbError('保存设置', error.message));

    return NextResponse.json({ settings: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to save settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
