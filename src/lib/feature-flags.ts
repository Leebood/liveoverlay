// src/lib/feature-flags.ts

import type { PlanType } from '@/types/plan';
import { getPlanLimits } from './plan-limits';

export function isFeatureEnabled(planType: PlanType, feature: string): boolean {
  const limits = getPlanLimits(planType);
  const value = (limits as unknown as Record<string, unknown>)[feature];

  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === -1 || value > 0;
  if (Array.isArray(value)) return true; // empty array = all allowed
  return !!value;
}

export function getFeatureValue(planType: PlanType, feature: string): unknown {
  const limits = getPlanLimits(planType);
  return (limits as unknown as Record<string, unknown>)[feature];
}
