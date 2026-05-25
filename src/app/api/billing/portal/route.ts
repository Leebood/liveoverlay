// src/app/api/billing/portal/route.ts
// 国内支付模式下的订阅管理

import { NextResponse } from 'next/server';
import { isWechatPayEnabled } from '@/lib/wechat-pay';
import { isAlipayEnabled } from '@/lib/alipay';

// POST /api/billing/portal
export async function POST() {
  try {
    const wechatEnabled = isWechatPayEnabled();
    const alipayEnabled = isAlipayEnabled();

    if (!wechatEnabled && !alipayEnabled) {
      return NextResponse.json({
        url: '/billing?demo=true',
        demo: true,
        message: '演示模式：可直接在页面上管理订阅',
      });
    }

    // 国内支付模式：直接跳转到账单页面管理
    return NextResponse.json({
      url: '/billing',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
