// src/app/api/overlay/control/route.ts
// Real-time control commands sent via Supabase Realtime

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseServerClient, getControlChannel } from '@/lib/supabase';
import type { ControlAction } from '@/types/live';

// POST /api/overlay/control
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { storeId, action, ...payload } = body;

    if (!storeId || !action) {
      return NextResponse.json({ error: 'storeId and action are required' }, { status: 400 });
    }

    const validActions: ControlAction[] = [
      'highlight_product', 'unhighlight_product', 'toggle_visibility',
      'show_countdown', 'hide_countdown', 'flash_deal', 'update_config',
    ];

    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const channel = getControlChannel(storeId);

    const controlPayload = {
      action,
      timestamp: Date.now(),
      ...payload,
    };

    await supabase.channel(channel).send({
      type: 'broadcast',
      event: 'control',
      payload: controlPayload,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
