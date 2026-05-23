// overlay-engine/templates/side-list/config.ts

import type { TemplateDefinition } from '@/types/template';

export const sideListTemplate: TemplateDefinition = {
  id: 'side-list',
  name: 'Side List',
  description: '右侧竖排3-5个商品列表',
  category: 'side_panel',
  minPlan: 'pro',
  previewImage: '/templates-preview/side-list.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.8)' },
    { key: 'cardBackgroundColor', label: '卡片背景色', type: 'color', defaultValue: 'rgba(255,255,255,0.1)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#fbbf24' },
    { key: 'maxItems', label: '显示数量', type: 'number', defaultValue: 4, min: 2, max: 8 },
    { key: 'panelWidth', label: '面板宽度', type: 'number', defaultValue: 280, min: 200, max: 400 },
    { key: 'position', label: '位置', type: 'select', defaultValue: 'right',
      options: [
        { label: '右侧', value: 'right' },
        { label: '左侧', value: 'left' },
      ]},
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    cardBackgroundColor: 'rgba(255,255,255,0.1)',
    textColor: '#ffffff',
    priceColor: '#fbbf24',
    maxItems: 4,
    panelWidth: 280,
    position: 'right',
  },
  componentType: 'side_panel',
  supportedOrientations: ['vertical'],
  recommendedSize: { width: 300, height: 1080 },
};
