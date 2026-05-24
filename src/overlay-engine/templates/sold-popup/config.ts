// overlay-engine/templates/sold-popup/config.ts
import type { TemplateDefinition } from '@/types/template';

export const soldPopupTemplate: TemplateDefinition = {
  id: 'sold-popup',
  name: 'Sold Popup',
  description: '已售通知弹窗，"刚刚有人购买了…"，社会认同促转化',
  category: 'notification',
  minPlan: 'pro',
  previewImage: '/templates-preview/sold-popup.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.85)' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#52c41a' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'popupWidth', label: '弹窗宽度', type: 'number', defaultValue: 260, min: 180, max: 380 },
    { key: 'borderRadius', label: '圆角', type: 'number', defaultValue: 8, min: 0, max: 20 },
    { key: 'autoDismiss', label: '自动消失(秒)', type: 'number', defaultValue: 4, min: 2, max: 10 },
    { key: 'position', label: '位置', type: 'select', defaultValue: 'bottom-left',
      options: [
        { label: '左下角', value: 'bottom-left' },
        { label: '右下角', value: 'bottom-right' },
        { label: '左上角', value: 'top-left' },
        { label: '右上角', value: 'top-right' },
      ]},
    { key: 'showAvatar', label: '显示头像', type: 'toggle', defaultValue: true },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    accentColor: '#52c41a',
    textColor: '#ffffff',
    popupWidth: 260,
    borderRadius: 8,
    autoDismiss: 4,
    position: 'bottom-left',
    showAvatar: true,
  },
  componentType: 'notification_popup',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 280, height: 60 },
};
