// overlay-engine/templates/side-cards/config.ts
import type { TemplateDefinition } from '@/types/template';

export const sideCardsTemplate: TemplateDefinition = {
  id: 'side-cards',
  name: 'Side Cards',
  description: '侧边大图卡片流，每个商品独立卡片，纵向排列',
  category: 'side_panel',
  minPlan: 'pro',
  previewImage: '/templates-preview/side-cards.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.8)' },
    { key: 'cardBackgroundColor', label: '卡片背景色', type: 'color', defaultValue: '#ffffff' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#333333' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'panelWidth', label: '面板宽度', type: 'number', defaultValue: 160, min: 120, max: 240 },
    { key: 'cardGap', label: '卡片间距', type: 'number', defaultValue: 8, min: 4, max: 16 },
    { key: 'maxCards', label: '最大显示数', type: 'number', defaultValue: 3, min: 2, max: 5 },
    { key: 'borderRadius', label: '圆角', type: 'number', defaultValue: 8, min: 0, max: 20 },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    cardBackgroundColor: '#ffffff',
    textColor: '#333333',
    priceColor: '#ff4d4f',
    panelWidth: 160,
    cardGap: 8,
    maxCards: 3,
    borderRadius: 8,
  },
  componentType: 'side_panel',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 180, height: 600 },
};
