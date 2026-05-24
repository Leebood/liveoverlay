// overlay-engine/templates/glass-ticker/config.ts
import type { TemplateDefinition } from '@/types/template';

export const glassTickerTemplate: TemplateDefinition = {
  id: 'glass-ticker',
  name: 'Glass Ticker',
  description: '毛玻璃质感滚动条，磨砂半透明效果，高级感十足',
  category: 'ticker',
  minPlan: 'starter',
  previewImage: '/templates-preview/glass-ticker.png',
  configSchema: [
    { key: 'blurAmount', label: '模糊度', type: 'number', defaultValue: 12, min: 4, max: 30 },
    { key: 'tintColor', label: '着色颜色', type: 'color', defaultValue: 'rgba(255,255,255,0.15)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ffd700' },
    { key: 'borderColor', label: '边框色', type: 'color', defaultValue: 'rgba(255,255,255,0.2)' },
    { key: 'scrollSpeed', label: '滚动速度', type: 'number', defaultValue: 10, min: 3, max: 25 },
    { key: 'barHeight', label: '条高度', type: 'number', defaultValue: 50, min: 36, max: 100 },
    { key: 'showProductImage', label: '显示商品图', type: 'toggle', defaultValue: true },
  ],
  defaultConfig: {
    blurAmount: 12,
    tintColor: 'rgba(255,255,255,0.15)',
    textColor: '#ffffff',
    priceColor: '#ffd700',
    borderColor: 'rgba(255,255,255,0.2)',
    scrollSpeed: 10,
    barHeight: 50,
    showProductImage: true,
  },
  componentType: 'scrolling_ticker',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 50 },
};
