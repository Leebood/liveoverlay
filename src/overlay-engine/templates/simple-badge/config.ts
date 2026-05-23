// overlay-engine/templates/simple-badge/config.ts

import type { TemplateDefinition } from '@/types/template';

export const simpleBadgeTemplate: TemplateDefinition = {
  id: 'simple-badge',
  name: 'Simple Badge',
  description: '左上角红底白字折扣角标',
  category: 'badge',
  minPlan: 'pro',
  previewImage: '/templates-preview/simple-badge.png',
  configSchema: [
    { key: 'badgeColor', label: '角标颜色', type: 'color', defaultValue: '#ef4444' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'fontSize', label: '字体大小', type: 'number', defaultValue: 18, min: 12, max: 36 },
    { key: 'position', label: '位置', type: 'select', defaultValue: 'top-left',
      options: [
        { label: '左上角', value: 'top-left' },
        { label: '右上角', value: 'top-right' },
        { label: '左下角', value: 'bottom-left' },
        { label: '右下角', value: 'bottom-right' },
      ]},
  ],
  defaultConfig: {
    badgeColor: '#ef4444',
    textColor: '#ffffff',
    fontSize: 18,
    position: 'top-left',
  },
  componentType: 'corner_badge',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 200, height: 80 },
};
