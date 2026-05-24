// overlay-engine/templates/flash-sale-popup/config.ts

import type { TemplateDefinition } from '@/types/template';

export const flashSalePopupTemplate: TemplateDefinition = {
  id: 'flash-sale-popup',
  name: 'Flash Sale Popup',
  description: '限时闪购弹窗，居中弹出后自动消失，制造紧迫感',
  category: 'notification',
  minPlan: 'pro',
  previewImage: '/templates-preview/flash-sale-popup.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.9)' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#ff4d4f' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'priceColor', label: '价格颜色', type: 'color', defaultValue: '#ffd700' },
    { key: 'popupWidth', label: '弹窗宽度', type: 'number', defaultValue: 320, min: 200, max: 500 },
    { key: 'popupHeight', label: '弹窗高度', type: 'number', defaultValue: 200, min: 120, max: 360 },
    { key: 'autoDismiss', label: '自动消失(秒)', type: 'number', defaultValue: 5, min: 2, max: 15 },
    { key: 'showCountdown', label: '显示倒计时', type: 'toggle', defaultValue: true },
    { key: 'borderRadius', label: '圆角', type: 'number', defaultValue: 12, min: 0, max: 32 },
    { key: 'borderColor', label: '边框色', type: 'color', defaultValue: '#ff4d4f' },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    accentColor: '#ff4d4f',
    textColor: '#ffffff',
    priceColor: '#ffd700',
    popupWidth: 320,
    popupHeight: 200,
    autoDismiss: 5,
    showCountdown: true,
    borderRadius: 12,
    borderColor: '#ff4d4f',
  },
  componentType: 'notification_popup',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 1080 },
};
