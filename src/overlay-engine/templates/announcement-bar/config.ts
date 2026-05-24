// overlay-engine/templates/announcement-bar/config.ts
import type { TemplateDefinition } from '@/types/template';

export const announcementBarTemplate: TemplateDefinition = {
  id: 'announcement-bar',
  name: 'Announcement Bar',
  description: '公告栏横幅，图标+文字+按钮，适合店铺公告和物流通知',
  category: 'banner',
  minPlan: 'free',
  previewImage: '/templates-preview/announcement-bar.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(22,119,255,0.9)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'iconColor', label: '图标颜色', type: 'color', defaultValue: '#ffd700' },
    { key: 'bannerHeight', label: '横幅高度', type: 'number', defaultValue: 40, min: 30, max: 60 },
    { key: 'fontSize', label: '字体大小', type: 'number', defaultValue: 13, min: 10, max: 18 },
    { key: 'showClose', label: '显示关闭按钮', type: 'toggle', defaultValue: true },
    { key: 'announcementText', label: '公告内容', type: 'text', defaultValue: '全场包邮 · 7天无理由退换' },
  ],
  defaultConfig: {
    backgroundColor: 'rgba(22,119,255,0.9)',
    textColor: '#ffffff',
    iconColor: '#ffd700',
    bannerHeight: 40,
    fontSize: 13,
    showClose: true,
    announcementText: '全场包邮 · 7天无理由退换',
  },
  componentType: 'top_banner',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 40 },
};
