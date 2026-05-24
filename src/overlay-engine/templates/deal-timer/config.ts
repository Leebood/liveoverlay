// overlay-engine/templates/deal-timer/config.ts
import type { TemplateDefinition } from '@/types/template';

export const dealTimerTemplate: TemplateDefinition = {
  id: 'deal-timer',
  name: 'Deal Timer',
  description: '圆形进度倒计时器，视觉冲击力强，适合秒杀场景',
  category: 'countdown',
  minPlan: 'pro',
  previewImage: '/templates-preview/deal-timer.png',
  configSchema: [
    { key: 'ringColor', label: '圆环颜色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'trackColor', label: '轨道颜色', type: 'color', defaultValue: 'rgba(255,255,255,0.15)' },
    { key: 'digitColor', label: '数字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'labelColor', label: '标签颜色', type: 'color', defaultValue: 'rgba(255,255,255,0.7)' },
    { key: 'size', label: '尺寸', type: 'number', defaultValue: 120, min: 80, max: 200 },
    { key: 'ringWidth', label: '圆环宽度', type: 'number', defaultValue: 6, min: 3, max: 12 },
    { key: 'showProductInfo', label: '显示商品信息', type: 'toggle', defaultValue: true },
  ],
  defaultConfig: {
    ringColor: '#ff4d4f',
    trackColor: 'rgba(255,255,255,0.15)',
    digitColor: '#ffffff',
    labelColor: 'rgba(255,255,255,0.7)',
    size: 120,
    ringWidth: 6,
    showProductInfo: true,
  },
  componentType: 'countdown',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 200, height: 200 },
};
