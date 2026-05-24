// overlay-engine/templates/gradient-ticker/config.ts
import type { TemplateDefinition } from '@/types/template';

export const gradientTickerTemplate: TemplateDefinition = {
  id: 'gradient-ticker',
  name: 'Gradient Ticker',
  description: '彩虹渐变流光滚动条，色彩流动效果，吸引眼球',
  category: 'ticker',
  minPlan: 'pro',
  previewImage: '/templates-preview/gradient-ticker.png',
  configSchema: [
    { key: 'gradientStart', label: '渐变起始色', type: 'color', defaultValue: '#ff6b6b' },
    { key: 'gradientMid', label: '渐变中间色', type: 'color', defaultValue: '#feca57' },
    { key: 'gradientEnd', label: '渐变结束色', type: 'color', defaultValue: '#48dbfb' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'scrollSpeed', label: '滚动速度', type: 'number', defaultValue: 14, min: 5, max: 30 },
    { key: 'barHeight', label: '条高度', type: 'number', defaultValue: 48, min: 36, max: 100 },
    { key: 'animationSpeed', label: '流光速度', type: 'number', defaultValue: 3, min: 1, max: 8 },
  ],
  defaultConfig: {
    gradientStart: '#ff6b6b',
    gradientMid: '#feca57',
    gradientEnd: '#48dbfb',
    textColor: '#ffffff',
    priceColor: '#ffffff',
    scrollSpeed: 14,
    barHeight: 48,
    animationSpeed: 3,
  },
  componentType: 'scrolling_ticker',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 48 },
};
