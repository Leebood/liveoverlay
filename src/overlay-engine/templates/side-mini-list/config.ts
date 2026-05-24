// overlay-engine/templates/side-mini-list/config.ts
import type { TemplateDefinition } from '@/types/template';

export const sideMiniListTemplate: TemplateDefinition = {
  id: 'side-mini-list',
  name: 'Side Mini List',
  description: '超紧凑侧边迷你列表，最小空间展示最多商品',
  category: 'side_panel',
  minPlan: 'starter',
  previewImage: '/templates-preview/side-mini-list.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.75)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ffd700' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#1677ff' },
    { key: 'panelWidth', label: '面板宽度', type: 'number', defaultValue: 90, min: 70, max: 140 },
    { key: 'maxItems', label: '最大显示数', type: 'number', defaultValue: 5, min: 3, max: 8 },
    { key: 'fontSize', label: '字体大小', type: 'number', defaultValue: 9, min: 7, max: 12 },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    textColor: '#ffffff',
    priceColor: '#ffd700',
    accentColor: '#1677ff',
    panelWidth: 90,
    maxItems: 5,
    fontSize: 9,
  },
  componentType: 'side_panel',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 100, height: 400 },
};
