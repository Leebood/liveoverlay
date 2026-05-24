// overlay-engine/templates/dual-product-compare/config.ts

import type { TemplateDefinition } from '@/types/template';

export const dualProductCompareTemplate: TemplateDefinition = {
  id: 'dual-product-compare',
  name: 'Dual Product Compare',
  description: '双品对比卡，左右并排展示两款商品，适合推荐对比场景',
  category: 'product_card',
  minPlan: 'pro',
  previewImage: '/templates-preview/dual-product-compare.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.8)' },
    { key: 'cardBackgroundColor', label: '卡片背景色', type: 'color', defaultValue: 'rgba(255,255,255,0.95)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#333333' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'vsColor', label: 'VS标志色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'cardWidth', label: '单卡宽度', type: 'number', defaultValue: 200, min: 140, max: 300 },
    { key: 'showImage', label: '显示商品图', type: 'toggle', defaultValue: true },
    { key: 'borderRadius', label: '圆角', type: 'number', defaultValue: 8, min: 0, max: 24 },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    cardBackgroundColor: 'rgba(255,255,255,0.95)',
    textColor: '#333333',
    priceColor: '#ff4d4f',
    vsColor: '#ff4d4f',
    cardWidth: 200,
    showImage: true,
    borderRadius: 8,
  },
  componentType: 'product_card',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 480, height: 200 },
};
