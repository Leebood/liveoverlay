// overlay-engine/registry.ts
// Template registry - maps template IDs to their configs

import type { TemplateDefinition } from '@/types/template';

// Ticker
import { basicTickerTemplate } from './templates/basic-ticker/config';
import { modernTickerTemplate } from './templates/modern-ticker/config';
import { minimalTickerTemplate } from './templates/minimal-ticker/config';
import { neonTickerTemplate } from './templates/neon-ticker/config';
import { glassTickerTemplate } from './templates/glass-ticker/config';
import { gradientTickerTemplate } from './templates/gradient-ticker/config';

// Product Card
import { minimalCardTemplate } from './templates/minimal-card/config';
import { spotlightCardTemplate } from './templates/spotlight-card/config';
import { dualProductCompareTemplate } from './templates/dual-product-compare/config';
import { interactionCardTemplate } from './templates/interaction-card/config';
import { verticalCardTemplate } from './templates/vertical-card/config';
import { floatingCardTemplate } from './templates/floating-card/config';

// Badge
import { simpleBadgeTemplate } from './templates/simple-badge/config';
import { floatingPriceTagTemplate } from './templates/floating-price-tag/config';
import { ribbonBadgeTemplate } from './templates/ribbon-badge/config';
import { stampBadgeTemplate } from './templates/stamp-badge/config';

// Side Panel
import { sideListTemplate } from './templates/side-list/config';
import { sideCardsTemplate } from './templates/side-cards/config';
import { sideMiniListTemplate } from './templates/side-mini-list/config';

// Banner
import { topPromoTemplate } from './templates/top-promo/config';
import { bottomInfoBarTemplate } from './templates/bottom-info-bar/config';
import { marqueeBannerTemplate } from './templates/marquee-banner/config';
import { announcementBarTemplate } from './templates/announcement-bar/config';

// Countdown
import { countdownBannerTemplate } from './templates/countdown-banner/config';
import { promoCountdownTemplate } from './templates/promo-countdown/config';
import { dealTimerTemplate } from './templates/deal-timer/config';
import { flashCountdownTemplate } from './templates/flash-countdown/config';

// Notification
import { flashSalePopupTemplate } from './templates/flash-sale-popup/config';
import { soldPopupTemplate } from './templates/sold-popup/config';
import { viewerPopupTemplate } from './templates/viewer-popup/config';

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  // Ticker (6)
  'basic-ticker': basicTickerTemplate,
  'modern-ticker': modernTickerTemplate,
  'minimal-ticker': minimalTickerTemplate,
  'neon-ticker': neonTickerTemplate,
  'glass-ticker': glassTickerTemplate,
  'gradient-ticker': gradientTickerTemplate,
  // Product Card (6)
  'minimal-card': minimalCardTemplate,
  'spotlight-card': spotlightCardTemplate,
  'dual-product-compare': dualProductCompareTemplate,
  'interaction-card': interactionCardTemplate,
  'vertical-card': verticalCardTemplate,
  'floating-card': floatingCardTemplate,
  // Badge (4)
  'simple-badge': simpleBadgeTemplate,
  'floating-price-tag': floatingPriceTagTemplate,
  'ribbon-badge': ribbonBadgeTemplate,
  'stamp-badge': stampBadgeTemplate,
  // Side Panel (3)
  'side-list': sideListTemplate,
  'side-cards': sideCardsTemplate,
  'side-mini-list': sideMiniListTemplate,
  // Banner (4)
  'top-promo': topPromoTemplate,
  'bottom-info-bar': bottomInfoBarTemplate,
  'marquee-banner': marqueeBannerTemplate,
  'announcement-bar': announcementBarTemplate,
  // Countdown (4)
  'countdown-banner': countdownBannerTemplate,
  'promo-countdown': promoCountdownTemplate,
  'deal-timer': dealTimerTemplate,
  'flash-countdown': flashCountdownTemplate,
  // Notification (3)
  'flash-sale-popup': flashSalePopupTemplate,
  'sold-popup': soldPopupTemplate,
  'viewer-popup': viewerPopupTemplate,
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
