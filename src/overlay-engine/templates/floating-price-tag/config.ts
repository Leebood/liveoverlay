// overlay-engine/templates/floating-price-tag/config.ts

import type { TemplateDefinition } from '@/types/template';

export const floatingPriceTagTemplate: TemplateDefinition = {
  id: 'floating-price-tag',
  name: 'Floating Price Tag',
  description: '浮动价格标签，带二维码区域，观众扫码即可购买',
  category: 'badge',
  minPlan: 'starter',
  previewImage: '/templates-preview/floating-price-tag.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.85)' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ffd700' },
    { key: 'showQRCode', label: '显示二维码', type: 'toggle', defaultValue: true },
    { key: 'tagWidth', label: '标签宽度', type: 'number', defaultValue: 160, min: 100, max: 260 },
    { key: 'borderRadius', label: '圆角', type: 'number', defaultValue: 8, min: 0, max: 24 },
    { key: 'ctaText', label: '按钮文案', type: 'text', defaultValue: '扫码购买' },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    accentColor: '#ff4d4f',
    textColor: '#ffffff',
    priceColor: '#ffd700',
    showQRCode: true,
    tagWidth: 160,
    borderRadius: 8,
    ctaText: '扫码购买',
  },
  componentType: 'corner_badge',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 200, height: 240 },
};
