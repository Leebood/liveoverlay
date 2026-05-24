// overlay-engine/templates/flash-countdown/config.ts
import type { TemplateDefinition } from '@/types/template';

export const flashCountdownTemplate: TemplateDefinition = {
  id: 'flash-countdown',
  name: 'Flash Countdown',
  description: '闪电倒计时，脉冲闪烁效果，极限紧迫感',
  category: 'countdown',
  minPlan: 'business',
  previewImage: '/templates-preview/flash-countdown.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.9)' },
    { key: 'flashColor', label: '闪烁色', type: 'color', defaultValue: '#ffdd00' },
    { key: 'digitColor', label: '数字颜色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'labelColor', label: '标签颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'barHeight', label: '条高度', type: 'number', defaultValue: 64, min: 44, max: 100 },
    { key: 'fontSize', label: '字体大小', type: 'number', defaultValue: 28, min: 18, max: 42 },
    { key: 'flashSpeed', label: '闪烁速度', type: 'number', defaultValue: 1, min: 1, max: 5 },
    { key: 'labelText', label: '标题文案', type: 'text', defaultValue: '⚡ 闪电秒杀' },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    flashColor: '#ffdd00',
    digitColor: '#ff4d4f',
    labelColor: '#ffffff',
    barHeight: 64,
    fontSize: 28,
    flashSpeed: 1,
    labelText: '⚡ 闪电秒杀',
  },
  componentType: 'countdown',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 64 },
};
