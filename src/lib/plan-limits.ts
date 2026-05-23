// src/lib/plan-limits.ts

import type { PlanType, PlanLimits, OverlayComponent } from '@/types/plan';

export type { PlanType, PlanLimits };

const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    displayName: 'Free',
    price: 0,
    yearlyPrice: 0,
    stripePriceId: '',
    stripeYearlyPriceId: '',
    maxProducts: 3,
    maxImagesPerProduct: 1,
    allowCsvImport: false,
    allowShopifySync: false,
    maxTemplates: 1,
    allowedTemplateIds: ['basic-ticker'],
    allowCustomColors: false,
    customColorPresets: 0,
    allowCustomFonts: false,
    allowBrandLogo: false,
    showWatermark: true,
    allowedComponents: ['scrolling_ticker'],
    allowLiveControl: false,
    allowMultiOverlay: false,
    maxSimultaneousOverlays: 1,
    allowLivePreview: false,
    maxLiveSessionHistory: 0,
    allowClickTracking: false,
    allowAdvancedAnalytics: false,
    maxStores: 1,
    maxTeamMembers: 1,
    allowApiAccess: false,
    allowWhiteLabel: false,
  },
  starter: {
    displayName: 'Starter',
    price: 9,
    yearlyPrice: 84,
    stripePriceId: 'price_starter_monthly',
    stripeYearlyPriceId: 'price_starter_yearly',
    maxProducts: 20,
    maxImagesPerProduct: 3,
    allowCsvImport: true,
    allowShopifySync: false,
    maxTemplates: 3,
    allowedTemplateIds: ['basic-ticker', 'modern-ticker', 'minimal-card'],
    allowCustomColors: true,
    customColorPresets: 3,
    allowCustomFonts: false,
    allowBrandLogo: false,
    showWatermark: false,
    allowedComponents: ['scrolling_ticker', 'product_card'],
    allowLiveControl: true,
    allowMultiOverlay: false,
    maxSimultaneousOverlays: 1,
    allowLivePreview: true,
    maxLiveSessionHistory: 5,
    allowClickTracking: false,
    allowAdvancedAnalytics: false,
    maxStores: 1,
    maxTeamMembers: 1,
    allowApiAccess: false,
    allowWhiteLabel: false,
  },
  pro: {
    displayName: 'Pro',
    price: 19,
    yearlyPrice: 180,
    stripePriceId: 'price_pro_monthly',
    stripeYearlyPriceId: 'price_pro_yearly',
    maxProducts: -1,
    maxImagesPerProduct: 5,
    allowCsvImport: true,
    allowShopifySync: true,
    maxTemplates: -1,
    allowedTemplateIds: [],
    allowCustomColors: true,
    customColorPresets: -1,
    allowCustomFonts: true,
    allowBrandLogo: true,
    showWatermark: false,
    allowedComponents: ['scrolling_ticker', 'product_card', 'corner_badge', 'side_panel', 'top_banner', 'countdown'],
    allowLiveControl: true,
    allowMultiOverlay: true,
    maxSimultaneousOverlays: 3,
    allowLivePreview: true,
    maxLiveSessionHistory: 30,
    allowClickTracking: true,
    allowAdvancedAnalytics: false,
    maxStores: 3,
    maxTeamMembers: 2,
    allowApiAccess: false,
    allowWhiteLabel: false,
  },
  business: {
    displayName: 'Business',
    price: 39,
    yearlyPrice: 348,
    stripePriceId: 'price_business_monthly',
    stripeYearlyPriceId: 'price_business_yearly',
    maxProducts: -1,
    maxImagesPerProduct: 10,
    allowCsvImport: true,
    allowShopifySync: true,
    maxTemplates: -1,
    allowedTemplateIds: [],
    allowCustomColors: true,
    customColorPresets: -1,
    allowCustomFonts: true,
    allowBrandLogo: true,
    showWatermark: false,
    allowedComponents: ['scrolling_ticker', 'product_card', 'corner_badge', 'side_panel', 'top_banner', 'countdown'],
    allowLiveControl: true,
    allowMultiOverlay: true,
    maxSimultaneousOverlays: -1,
    allowLivePreview: true,
    maxLiveSessionHistory: -1,
    allowClickTracking: true,
    allowAdvancedAnalytics: true,
    maxStores: 10,
    maxTeamMembers: 5,
    allowApiAccess: true,
    allowWhiteLabel: true,
  },
};

export function getPlanLimits(planType: PlanType): PlanLimits {
  return PLAN_LIMITS[planType];
}

export function isWithinLimit(planType: PlanType, feature: keyof PlanLimits, current: number): boolean {
  const limit = PLAN_LIMITS[planType][feature] as number;
  if (limit === -1) return true;
  return current < limit;
}

export function isFeatureAllowed(planType: PlanType, feature: keyof PlanLimits): boolean {
  const value = PLAN_LIMITS[planType][feature];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0 && value !== -1 ? true : value === -1;
  if (Array.isArray(value)) return true;
  return !!value;
}

export function isComponentAllowed(planType: PlanType, component: OverlayComponent): boolean {
  const limits = PLAN_LIMITS[planType];
  if (limits.allowedComponents.length === 0) return true; // empty means all
  return limits.allowedComponents.includes(component);
}

export function isTemplateAllowed(planType: PlanType, templateId: string): boolean {
  const limits = PLAN_LIMITS[planType];
  if (limits.allowedTemplateIds.length === 0) return true; // empty means all
  return limits.allowedTemplateIds.includes(templateId);
}
