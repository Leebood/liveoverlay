// overlay-engine/registry.ts
// Template registry - maps template IDs to their configs

import type { TemplateDefinition } from '@/types/template';
import { basicTickerTemplate } from './templates/basic-ticker/config';
import { modernTickerTemplate } from './templates/modern-ticker/config';
import { minimalTickerTemplate } from './templates/minimal-ticker/config';
import { minimalCardTemplate } from './templates/minimal-card/config';
import { spotlightCardTemplate } from './templates/spotlight-card/config';
import { simpleBadgeTemplate } from './templates/simple-badge/config';
import { sideListTemplate } from './templates/side-list/config';
import { topPromoTemplate } from './templates/top-promo/config';
import { countdownBannerTemplate } from './templates/countdown-banner/config';
import { promoCountdownTemplate } from './templates/promo-countdown/config';

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  'basic-ticker': basicTickerTemplate,
  'modern-ticker': modernTickerTemplate,
  'minimal-ticker': minimalTickerTemplate,
  'minimal-card': minimalCardTemplate,
  'spotlight-card': spotlightCardTemplate,
  'simple-badge': simpleBadgeTemplate,
  'side-list': sideListTemplate,
  'top-promo': topPromoTemplate,
  'countdown-banner': countdownBannerTemplate,
  'promo-countdown': promoCountdownTemplate,
};

export function getTemplateDefinition(templateId: string): TemplateDefinition | undefined {
  return TEMPLATE_REGISTRY[templateId];
}

export function getAllTemplates(): TemplateDefinition[] {
  return Object.values(TEMPLATE_REGISTRY);
}

export function getTemplatesByCategory(category: string): TemplateDefinition[] {
  return Object.values(TEMPLATE_REGISTRY).filter(t => t.category === category);
}
