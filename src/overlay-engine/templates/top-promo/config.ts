// overlay-engine/templates/top-promo/config.ts

import type { TemplateDefinition } from '@/types/template';

export const topPromoTemplate: TemplateDefinition = {
  id: 'top-promo',
  name: 'Top Promo',
  description: '全宽渐变顶部促销横幅，文字动画',
  category: 'banner',
  minPlan: 'pro',
  previewImage: '/templates-preview/top-promo.png',
  configSchema: [
    { key: 'gradientStart', label: '渐变起始色', type: 'color', defaultValue: '#6366f1' },
    { key: 'gradientEnd', label: '渐变结束色', type: 'color', defaultValue: '#8b5cf6' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'bannerHeight', label: '横幅高度', type: 'number', defaultValue: 50, min: 36, max: 80 },
    { key: 'fontSize', label: '字体大小', type: 'number', defaultValue: 16, min: 12, max: 24 },
    { key: 'scrollSpeed', label: '滚动速度', type: 'number', defaultValue: 10, min: 3, max: 25 },
  ],
  defaultConfig: {
    gradientStart: '#6366f1',
    gradientEnd: '#8b5cf6',
    textColor: '#ffffff',
    bannerHeight: 50,
    fontSize: 16,
    scrollSpeed: 10,
  },
  componentType: 'top_banner',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 50 },
};
