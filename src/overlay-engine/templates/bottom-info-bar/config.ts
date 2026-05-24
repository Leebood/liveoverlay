// overlay-engine/templates/bottom-info-bar/config.ts

import type { TemplateDefinition } from '@/types/template';

export const bottomInfoBarTemplate: TemplateDefinition = {
  id: 'bottom-info-bar',
  name: 'Bottom Info Bar',
  description: '底部信息栏，固定展示当前主推商品，含购买引导按钮',
  category: 'banner',
  minPlan: 'starter',
  previewImage: '/templates-preview/bottom-info-bar.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.85)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ffd700' },
    { key: 'ctaBgColor', label: '按钮背景色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'ctaTextColor', label: '按钮文字色', type: 'color', defaultValue: '#ffffff' },
    { key: 'barHeight', label: '条高度', type: 'number', defaultValue: 56, min: 40, max: 100 },
    { key: 'ctaText', label: '按钮文案', type: 'text', defaultValue: '立即购买' },
    { key: 'showImage', label: '显示商品图', type: 'toggle', defaultValue: true },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    textColor: '#ffffff',
    priceColor: '#ffd700',
    ctaBgColor: '#ff4d4f',
    ctaTextColor: '#ffffff',
    barHeight: 56,
    ctaText: '立即购买',
    showImage: true,
  },
  componentType: 'top_banner',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 56 },
};
