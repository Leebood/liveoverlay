// overlay-engine/templates/ribbon-badge/config.ts
import type { TemplateDefinition } from '@/types/template';

export const ribbonBadgeTemplate: TemplateDefinition = {
  id: 'ribbon-badge',
  name: 'Ribbon Badge',
  description: '缎带折角角标，立体折叠效果，适合节日/活动促销',
  category: 'badge',
  minPlan: 'free',
  previewImage: '/templates-preview/ribbon-badge.png',
  configSchema: [
    { key: 'ribbonColor', label: '缎带颜色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'ribbonWidth', label: '缎带宽度', type: 'number', defaultValue: 100, min: 60, max: 180 },
    { key: 'fontSize', label: '字体大小', type: 'number', defaultValue: 14, min: 10, max: 24 },
    { key: 'position', label: '位置', type: 'select', defaultValue: 'top-right',
      options: [
        { label: '右上角', value: 'top-right' },
        { label: '左上角', value: 'top-left' },
      ]},
    { key: 'text', label: '角标文字', type: 'text', defaultValue: '限时特惠' },
  ],
  defaultConfig: {
    ribbonColor: '#ff4d4f',
    textColor: '#ffffff',
    ribbonWidth: 100,
    fontSize: 14,
    position: 'top-right',
    text: '限时特惠',
  },
  componentType: 'corner_badge',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 1080 },
};
