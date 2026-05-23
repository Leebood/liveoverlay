// src/components/common/FeatureGate.tsx
'use client';

import { useSession } from 'next-auth/react';
import { getPlanLimits } from '@/lib/plan-limits';
import type { PlanType } from '@/types/plan';
import { LockOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export default function FeatureGate({ feature, children, fallback, showUpgrade = true }: FeatureGateProps) {
  const { data: session } = useSession();
  const planType = ((session?.user as unknown as Record<string, unknown>)?.planType || 'free') as PlanType;
  const limits = getPlanLimits(planType);

  const value = (limits as unknown as Record<string, unknown>)[feature];
  const allowed = typeof value === 'boolean' ? value
    : typeof value === 'number' ? (value === -1 || value > 0)
    : Array.isArray(value) ? true
    : !!value;

  if (allowed) return <>{children}</>;
  if (fallback) return <>{fallback}</>;

  if (showUpgrade) {
    return (
      <Tooltip title="升级到更高级计划解锁此功能">
        <div className="relative opacity-60 pointer-events-none select-none">
          {children}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
            <Button type="primary" size="small" icon={<LockOutlined />}
                    className="pointer-events-auto">
              升级解锁
            </Button>
          </div>
        </div>
      </Tooltip>
    );
  }
  return null;
}
