// src/components/common/PlanBadge.tsx
'use client';

import { Tag } from 'antd';
import type { PlanType } from '@/types/plan';

const PLAN_COLORS: Record<PlanType, string> = {
  free: 'default',
  starter: 'blue',
  pro: 'purple',
  business: 'gold',
};

const PLAN_LABELS: Record<PlanType, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
};

interface PlanBadgeProps {
  planType: PlanType;
  showPrice?: boolean;
}

export default function PlanBadge({ planType, showPrice = false }: PlanBadgeProps) {
  const label = showPrice
    ? `${PLAN_LABELS[planType]}`
    : PLAN_LABELS[planType];

  return (
    <Tag color={PLAN_COLORS[planType]} className="font-medium">
      {label}
    </Tag>
  );
}
