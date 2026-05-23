// overlay-engine/templates/modern-ticker/config.ts

import type { TemplateDefinition } from '@/types/template';

export const modernTickerTemplate: TemplateDefinition = {
  id: 'modern-ticker',
  name: 'Modern Ticker',
  description: '圆角卡片设计，渐变背景，适合时尚/美妆类直播',
  category: 'ticker',
  minPlan: 'starter',
  previewImage: '/templates-preview/modern-ticker.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.75)' },
    { key: 'cardBackgroundColor', label: '卡片背景色', type: 'color', defaultValue: '#ffffff' },
    { key: 'productNameColor', label: '商品名颜色', type: 'color', defaultValue: '#333333' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ff4444' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#6366f1' },
    { key: 'fontFamily', label: '字体', type: 'select', defaultValue: 'system-ui', minPlan: 'pro',
      options: [
        { label: '系统默认', value: 'system-ui' },
        { label: 'Inter', value: 'Inter' },
        { label: 'Poppins', value: 'Poppins' },
        { label: 'Noto Sans SC', value: 'Noto Sans SC' },
      ]},
    { key: 'scrollSpeed', label: '滚动速度', type: 'number', defaultValue: 12, min: 5, max: 30 },
    { key: 'cardWidth', label: '卡片宽度', type: 'number', defaultValue: 200, min: 120, max: 400 },
    { key: 'showProductImage', label: '显示商品图', type: 'toggle', defaultValue: true },
    { key: 'showOriginalPrice', label: '显示原价', type: 'toggle', defaultValue: true },
    { key: 'borderRadius', label: '圆角大小', type: 'number', defaultValue: 12, min: 0, max: 30 },
    { key: 'brandLogoUrl', label: '品牌Logo', type: 'text', defaultValue: '', minPlan: 'pro' },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    cardBackgroundColor: '#ffffff',
    productNameColor: '#333333',
    priceColor: '#ff4444',
    accentColor: '#6366f1',
    fontFamily: 'system-ui',
    scrollSpeed: 12,
    cardWidth: 200,
    showProductImage: true,
    showOriginalPrice: true,
    borderRadius: 12,
    brandLogoUrl: '',
  },
  componentType: 'scrolling_ticker',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 120 },
};
