// src/types/plan.ts

export type PlanType = 'free' | 'starter' | 'pro' | 'business';

export type OverlayComponent =
  | 'scrolling_ticker'
  | 'product_card'
  | 'corner_badge'
  | 'side_panel'
  | 'top_banner'
  | 'countdown';

export interface PlanLimits {
  displayName: string;
  price: number;
  yearlyPrice: number;
  stripePriceId: string;
  stripeYearlyPriceId: string;

  maxProducts: number;
  maxImagesPerProduct: number;
  allowCsvImport: boolean;
  allowShopifySync: boolean;

  maxTemplates: number;
  allowedTemplateIds: string[];
  allowCustomColors: boolean;
  customColorPresets: number;
  allowCustomFonts: boolean;
  allowBrandLogo: boolean;
  showWatermark: boolean;

  allowedComponents: OverlayComponent[];

  allowLiveControl: boolean;
  allowMultiOverlay: boolean;
  maxSimultaneousOverlays: number;
  allowLivePreview: boolean;

  maxLiveSessionHistory: number;
  allowClickTracking: boolean;
  allowAdvancedAnalytics: boolean;

  maxStores: number;
  maxTeamMembers: number;
  allowApiAccess: boolean;
  allowWhiteLabel: boolean;
}
