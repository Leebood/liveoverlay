// overlay-engine/templates/interaction-card/config.ts

import type { TemplateDefinition } from '@/types/template';

export const interactionCardTemplate: TemplateDefinition = {
  id: 'interaction-card',
  name: 'Interaction Card',
  description: '互动商品卡，带点赞数/观看数，营造抢购氛围',
  category: 'product_card',
  minPlan: 'pro',
  previewImage: '/templates-preview/interaction-card.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.85)' },
    { key: 'cardBackgroundColor', label: '卡片背景色', type: 'color', defaultValue: 'rgba(255,255,255,0.95)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#333333' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#1677ff' },
    { key: 'cardWidth', label: '卡片宽度', type: 'number', defaultValue: 280, min: 200, max: 400 },
    { key: 'showLikes', label: '显示点赞数', type: 'toggle', defaultValue: true },
    { key: 'showViewers', label: '显示观看数', type: 'toggle', defaultValue: true },
    { key: 'showImage', label: '显示商品图', type: 'toggle', defaultValue: true },
    { key: 'borderRadius', label: '圆角', type: 'number', defaultValue: 10, min: 0, max: 24 },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    cardBackgroundColor: 'rgba(255,255,255,0.95)',
    textColor: '#333333',
    priceColor: '#ff4d4f',
    accentColor: '#1677ff',
    cardWidth: 280,
    showLikes: true,
    showViewers: true,
    showImage: true,
    borderRadius: 10,
  },
  componentType: 'product_card',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 320, height: 200 },
};
