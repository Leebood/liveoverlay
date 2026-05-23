// overlay-engine/templates/minimal-card/config.ts

import type { TemplateDefinition } from '@/types/template';

export const minimalCardTemplate: TemplateDefinition = {
  id: 'minimal-card',
  name: 'Minimal Card',
  description: '小卡片设计，右上角固定，不遮挡主画面',
  category: 'product_card',
  minPlan: 'starter',
  previewImage: '/templates-preview/minimal-card.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(255,255,255,0.95)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#333333' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#e53e3e' },
    { key: 'cardWidth', label: '卡片宽度', type: 'number', defaultValue: 240, min: 160, max: 360 },
    { key: 'showImage', label: '显示图片', type: 'toggle', defaultValue: true },
    { key: 'borderRadius', label: '圆角', type: 'number', defaultValue: 8, min: 0, max: 24 },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    textColor: '#333333',
    priceColor: '#e53e3e',
    cardWidth: 240,
    showImage: true,
    borderRadius: 8,
  },
  componentType: 'product_card',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 300, height: 160 },
};
