// src/app/api/admin/switch-plan/route.ts
import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { PlanType } from '@/types/plan';

const VALID_PLANS: PlanType[] = ['free', 'starter', 'pro', 'business'];

/**
 * 测试用：切换用户计划
 * POST /api/admin/switch-plan
 * Body: { email, plan }
 * 
 * ⚠️ 仅用于测试，生产环境应删除此接口或添加管理员权限校验
 */
export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; plan?: string };
    const { email, plan } = body;

    if (!email || !plan) {
      return NextResponse.json(
        { error: '请提供 email 和 plan 参数' },
        { status: 400 }
      );
    }

    if (!VALID_PLANS.includes(plan as PlanType)) {
      return NextResponse.json(
        { error: `无效的计划类型，可选值：${VALID_PLANS.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // 更新用户计划
    const { error } = await supabase
      .from('users')
      .update({
        plan_type: plan,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (error) {
      return NextResponse.json(
        { error: '更新失败：' + error.message },
        { status: 500 }
      );
    }

    // 同时更新或创建订阅记录
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userData) {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1年后过期

      // 检查是否已有订阅记录
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userData.id)
        .maybeSingle();

      if (existingSub) {
        await supabase
          .from('subscriptions')
          .update({
            plan: plan,
            status: plan === 'free' ? 'canceled' : 'active',
            current_period_start: now.toISOString(),
            current_period_end: plan === 'free' ? now.toISOString() : expiresAt.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('id', existingSub.id);
      } else if (plan !== 'free') {
        await supabase
          .from('subscriptions')
          .insert({
            user_id: userData.id,
            plan: plan,
            status: 'active',
            current_period_start: now.toISOString(),
            current_period_end: expiresAt.toISOString(),
          });
      }
    }

    return NextResponse.json({
      success: true,
      message: `用户 ${email} 的计划已切换为 ${plan}`,
      plan,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '未知错误';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
