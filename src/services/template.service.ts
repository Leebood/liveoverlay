// src/services/template.service.ts

import { getAllTemplates, getTemplateDefinition, getTemplatesByCategory } from '@/overlay-engine/registry';
import type { TemplateDefinition } from '@/types/template';
import { isTemplateAllowed } from '@/lib/plan-limits';
import type { PlanType } from '@/types/plan';

export function getAvailableTemplates(planType: PlanType): TemplateDefinition[] {
  return getAllTemplates().filter(t => isTemplateAllowed(planType, t.id));
}

export function getTemplateById(templateId: string): TemplateDefinition | undefined {
  return getTemplateDefinition(templateId);
}

export function getTemplatesByCategoryFiltered(category: string, planType: PlanType): TemplateDefinition[] {
  return getTemplatesByCategory(category).filter(t => isTemplateAllowed(planType, t.id));
}
