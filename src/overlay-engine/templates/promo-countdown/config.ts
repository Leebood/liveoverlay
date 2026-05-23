// overlay-engine/templates/promo-countdown/config.ts

import type { TemplateDefinition } from '@/types/template';

export const promoCountdownTemplate: TemplateDefinition = {
  id: 'promo-countdown',
  name: 'Promo Countdown',
  description: '独立促销倒计时组件',
  category: 'countdown',
  minPlan: 'pro',
  previewImage: '/templates-preview/promo-countdown.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(17,24,39,0.9)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#f59e0b' },
    { key: 'cardWidth', label: '宽度', type: 'number', defaultValue: 300, min: 200, max: 500 },
    { key: 'position', label: '位置', type: 'select', defaultValue: 'bottom-right',
      options: [
        { label: '右下角', value: 'bottom-right' },
        { label: '左下角', value: 'bottom-left' },
        { label: '右上角', value: 'top-right' },
        { label: '左上角', value: 'top-left' },
      ]},
  ],
  defaultConfig: {
    backgroundColor: 'rgba(17,24,39,0.9)',
    textColor: '#ffffff',
    accentColor: '#f59e0b',
    cardWidth: 300,
    position: 'bottom-right',
  },
  componentType: 'countdown',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 340, height: 120 },
};
