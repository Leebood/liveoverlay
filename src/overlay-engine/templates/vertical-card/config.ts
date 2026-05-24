// overlay-engine/templates/vertical-card/config.ts
import type { TemplateDefinition } from '@/types/template';

export const verticalCardTemplate: TemplateDefinition = {
  id: 'vertical-card',
  name: 'Vertical Card',
  description: '竖版商品卡，大图展示，适合竖屏直播和手机端',
  category: 'product_card',
  minPlan: 'starter',
  previewImage: '/templates-preview/vertical-card.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.85)' },
    { key: 'cardBackgroundColor', label: '卡片背景色', type: 'color', defaultValue: '#ffffff' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#333333' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'cardWidth', label: '卡片宽度', type: 'number', defaultValue: 180, min: 120, max: 280 },
    { key: 'imageRatio', label: '图片占比', type: 'number', defaultValue: 60, min: 40, max: 80 },
    { key: 'showDescription', label: '显示描述', type: 'toggle', defaultValue: true },
    { key: 'borderRadius', label: '圆角', type: 'number', defaultValue: 10, min: 0, max: 24 },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    cardBackgroundColor: '#ffffff',
    textColor: '#333333',
    priceColor: '#ff4d4f',
    cardWidth: 180,
    imageRatio: 60,
    showDescription: true,
    borderRadius: 10,
  },
  componentType: 'product_card',
  supportedOrientations: ['horizontal', 'vertical'],
  recommendedSize: { width: 200, height: 320 },
};
