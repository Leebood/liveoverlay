// overlay-engine/templates/minimal-ticker/config.ts

import type { TemplateDefinition } from '@/types/template';

export const minimalTickerTemplate: TemplateDefinition = {
  id: 'minimal-ticker',
  name: 'Minimal Ticker',
  description: '细线条+大量留白，极简主义设计',
  category: 'ticker',
  minPlan: 'starter',
  previewImage: '/templates-preview/minimal-ticker.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(255,255,255,0.9)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#111111' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#000000' },
    { key: 'borderColor', label: '边框色', type: 'color', defaultValue: '#e5e5e5' },
    { key: 'scrollSpeed', label: '滚动速度', type: 'number', defaultValue: 8, min: 3, max: 25 },
    { key: 'showProductImage', label: '显示商品图', type: 'toggle', defaultValue: false },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    textColor: '#111111',
    priceColor: '#000000',
    borderColor: '#e5e5e5',
    scrollSpeed: 8,
    showProductImage: false,
  },
  componentType: 'scrolling_ticker',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 48 },
};
