// overlay-engine/templates/floating-card/config.ts
import type { TemplateDefinition } from '@/types/template';

export const floatingCardTemplate: TemplateDefinition = {
  id: 'floating-card',
  name: 'Floating Card',
  description: '浮动气泡商品卡，圆润可爱风格，适合生活/亲子类直播',
  category: 'product_card',
  minPlan: 'starter',
  previewImage: '/templates-preview/floating-card.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(255,255,255,0.95)' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#722ed1' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#333333' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'cardWidth', label: '卡片宽度', type: 'number', defaultValue: 200, min: 140, max: 300 },
    { key: 'bubbleSize', label: '气泡大小', type: 'number', defaultValue: 48, min: 32, max: 72 },
    { key: 'showImage', label: '显示商品图', type: 'toggle', defaultValue: true },
    { key: 'borderRadius', label: '圆角', type: 'number', defaultValue: 20, min: 8, max: 36 },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    accentColor: '#722ed1',
    textColor: '#333333',
    priceColor: '#ff4d4f',
    cardWidth: 200,
    bubbleSize: 48,
    showImage: true,
    borderRadius: 20,
  },
  componentType: 'product_card',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 240, height: 140 },
};
