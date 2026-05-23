// src/app/api/analytics/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/analytics?storeId=xxx&type=sessions|interactions
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const type = searchParams.get('type') || 'sessions';

    if (!storeId) {
      return NextResponse.json({ error: 'storeId is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    if (type === 'sessions') {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('store_id', storeId)
        .order('start_time', { ascending: false })
        .limit(30);

      if (error) throw new Error(`查询直播记录失败: ${error.message}`);
      return NextResponse.json({ sessions: data });
    }

    if (type === 'interactions') {
      const { data, error } = await supabase
        .from('product_interactions')
        .select('*')
        .eq('store_id', storeId)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw new Error(`查询互动记录失败: ${error.message}`);
      return NextResponse.json({ interactions: data });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
