// overlay-engine/templates/countdown-banner/config.ts

import type { TemplateDefinition } from '@/types/template';

export const countdownBannerTemplate: TemplateDefinition = {
  id: 'countdown-banner',
  name: 'Countdown Banner',
  description: '限时+倒计时数字跳动，营造紧迫感',
  category: 'countdown',
  minPlan: 'pro',
  previewImage: '/templates-preview/countdown-banner.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(220,38,38,0.9)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'digitColor', label: '数字颜色', type: 'color', defaultValue: '#fbbf24' },
    { key: 'bannerHeight', label: '横幅高度', type: 'number', defaultValue: 60, min: 40, max: 100 },
    { key: 'fontSize', label: '字体大小', type: 'number', defaultValue: 22, min: 14, max: 36 },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(220,38,38,0.9)',
    textColor: '#ffffff',
    digitColor: '#fbbf24',
    bannerHeight: 60,
    fontSize: 22,
  },
  componentType: 'countdown',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 60 },
};
