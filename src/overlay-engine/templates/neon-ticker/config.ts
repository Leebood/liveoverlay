// overlay-engine/templates/neon-ticker/config.ts

import type { TemplateDefinition } from '@/types/template';

export const neonTickerTemplate: TemplateDefinition = {
  id: 'neon-ticker',
  name: 'Neon Ticker',
  description: '霓虹灯风格滚动条，发光文字效果，适合夜间/娱乐类直播',
  category: 'ticker',
  minPlan: 'pro',
  previewImage: '/templates-preview/neon-ticker.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(10,10,30,0.9)' },
    { key: 'neonColor', label: '霓虹色', type: 'color', defaultValue: '#00ff88' },
    { key: 'secondaryNeonColor', label: '副霓虹色', type: 'color', defaultValue: '#ff00ff' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ffdd00' },
    { key: 'scrollSpeed', label: '滚动速度', type: 'number', defaultValue: 12, min: 3, max: 30 },
    { key: 'barHeight', label: '条高度', type: 'number', defaultValue: 52, min: 36, max: 100 },
    { key: 'glowIntensity', label: '发光强度', type: 'number', defaultValue: 6, min: 0, max: 15 },
    { key: 'showProductImage', label: '显示商品图', type: 'toggle', defaultValue: false },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(10,10,30,0.9)',
    neonColor: '#00ff88',
    secondaryNeonColor: '#ff00ff',
    textColor: '#ffffff',
    priceColor: '#ffdd00',
    scrollSpeed: 12,
    barHeight: 52,
    glowIntensity: 6,
    showProductImage: false,
  },
  componentType: 'scrolling_ticker',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 52 },
};
