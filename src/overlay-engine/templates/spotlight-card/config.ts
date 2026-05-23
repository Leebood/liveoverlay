// overlay-engine/templates/spotlight-card/config.ts

import type { TemplateDefinition } from '@/types/template';

export const spotlightCardTemplate: TemplateDefinition = {
  id: 'spotlight-card',
  name: 'Spotlight Card',
  description: '大卡片+背景模糊+弹出动画，强烈聚焦效果',
  category: 'product_card',
  minPlan: 'pro',
  previewImage: '/templates-preview/spotlight-card.png',
  configSchema: [
    { key: 'overlayColor', label: '遮罩色', type: 'color', defaultValue: 'rgba(0,0,0,0.6)' },
    { key: 'cardBackgroundColor', label: '卡片背景色', type: 'color', defaultValue: '#ffffff' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#6366f1' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#111827' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ef4444' },
    { key: 'cardWidth', label: '卡片宽度', type: 'number', defaultValue: 380, min: 240, max: 600 },
    { key: 'blurAmount', label: '模糊程度', type: 'number', defaultValue: 8, min: 0, max: 20 },
    { key: 'fontFamily', label: '字体', type: 'select', defaultValue: 'system-ui', minPlan: 'pro',
      options: [
        { label: '系统默认', value: 'system-ui' },
        { label: 'Inter', value: 'Inter' },
        { label: 'Poppins', value: 'Poppins' },
      ]},
  ],
  defaultConfig: {
    overlayColor: 'rgba(0,0,0,0.6)',
    cardBackgroundColor: '#ffffff',
    accentColor: '#6366f1',
    textColor: '#111827',
    priceColor: '#ef4444',
    cardWidth: 380,
    blurAmount: 8,
    fontFamily: 'system-ui',
  },
  componentType: 'product_card',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 1080 },
};
