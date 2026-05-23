// overlay-engine/templates/basic-ticker/config.ts

import type { TemplateDefinition } from '@/types/template';

export const basicTickerTemplate: TemplateDefinition = {
  id: 'basic-ticker',
  name: 'Basic Ticker',
  description: '最简水平滚动条，白底黑字，适合所有类型直播',
  category: 'ticker',
  minPlan: 'free',
  previewImage: '/templates-preview/basic-ticker.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(255,255,255,0.95)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#333333' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ff4444' },
    { key: 'scrollSpeed', label: '滚动速度', type: 'number', defaultValue: 10, min: 3, max: 30 },
    { key: 'barHeight', label: '条高度', type: 'number', defaultValue: 60, min: 40, max: 120 },
    { key: 'showProductImage', label: '显示商品图', type: 'toggle', defaultValue: false },
    { key: 'separator', label: '分隔符', type: 'text', defaultValue: '•' },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    textColor: '#333333',
    priceColor: '#ff4444',
    scrollSpeed: 10,
    barHeight: 60,
    showProductImage: false,
    separator: '•',
  },
  componentType: 'scrolling_ticker',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 60 },
};
