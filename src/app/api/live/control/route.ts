// src/app/api/live/control/route.ts
// Live session control - start/end sessions, track metrics

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/live/control
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { storeId, action, title, overlayIds } = body;

    if (!storeId || !action) {
      return NextResponse.json({ error: 'storeId and action are required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    if (action === 'start') {
      const { data, error } = await supabase
        .from('live_sessions')
        .insert({
          store_id: storeId,
          title: title || null,
          overlay_ids: JSON.stringify(overlayIds || []),
          start_time: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw new Error(`开始直播失败: ${error.message}`);
      return NextResponse.json({ session: data }, { status: 201 });
    }

    if (action === 'end') {
      const { sessionId } = body;
      if (!sessionId) {
        return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('live_sessions')
        .update({
          end_time: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw new Error(`结束直播失败: ${error.message}`);
      return NextResponse.json({ session: data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
