// overlay-engine/templates/viewer-popup/config.ts
import type { TemplateDefinition } from '@/types/template';

export const viewerPopupTemplate: TemplateDefinition = {
  id: 'viewer-popup',
  name: 'Viewer Popup',
  description: '观众互动弹窗，新粉丝/新关注通知，增强直播间氛围',
  category: 'notification',
  minPlan: 'starter',
  previewImage: '/templates-preview/viewer-popup.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(22,119,255,0.9)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#ffd700' },
    { key: 'popupWidth', label: '弹窗宽度', type: 'number', defaultValue: 240, min: 160, max: 340 },
    { key: 'borderRadius', label: '圆角', type: 'number', defaultValue: 24, min: 0, max: 36 },
    { key: 'autoDismiss', label: '自动消失(秒)', type: 'number', defaultValue: 3, min: 1, max: 8 },
    { key: 'showAvatar', label: '显示头像', type: 'toggle', defaultValue: true },
    { key: 'animationType', label: '动画类型', type: 'select', defaultValue: 'slide',
      options: [
        { label: '滑入', value: 'slide' },
        { label: '淡入', value: 'fade' },
        { label: '弹入', value: 'bounce' },
      ]},
  ],
  defaultConfig: {
    backgroundColor: 'rgba(22,119,255,0.9)',
    textColor: '#ffffff',
    accentColor: '#ffd700',
    popupWidth: 240,
    borderRadius: 24,
    autoDismiss: 3,
    showAvatar: true,
    animationType: 'slide',
  },
  componentType: 'notification_popup',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 260, height: 50 },
};
