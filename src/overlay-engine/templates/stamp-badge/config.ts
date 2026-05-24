// overlay-engine/templates/stamp-badge/config.ts
import type { TemplateDefinition } from '@/types/template';

export const stampBadgeTemplate: TemplateDefinition = {
  id: 'stamp-badge',
  name: 'Stamp Badge',
  description: '圆形印章角标，官方认证风格，适合品牌直播',
  category: 'badge',
  minPlan: 'starter',
  previewImage: '/templates-preview/stamp-badge.png',
  configSchema: [
    { key: 'stampColor', label: '印章颜色', type: 'color', defaultValue: '#cf1322' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#cf1322' },
    { key: 'bgColor', label: '背景色', type: 'color', defaultValue: 'rgba(255,255,255,0.95)' },
    { key: 'size', label: '印章大小', type: 'number', defaultValue: 80, min: 50, max: 140 },
    { key: 'borderWidth', label: '边框宽度', type: 'number', defaultValue: 3, min: 1, max: 6 },
    { key: 'outerText', label: '外圈文字', type: 'text', defaultValue: 'OFFICIAL' },
    { key: 'innerText', label: '内圈文字', type: 'text', defaultValue: '正品' },
  ],
  defaultConfig: {
    stampColor: '#cf1322',
    textColor: '#cf1322',
    bgColor: 'rgba(255,255,255,0.95)',
    size: 80,
    borderWidth: 3,
    outerText: 'OFFICIAL',
    innerText: '正品',
  },
  componentType: 'corner_badge',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 120, height: 120 },
};
