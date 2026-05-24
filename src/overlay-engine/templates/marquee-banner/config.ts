// overlay-engine/templates/marquee-banner/config.ts
import type { TemplateDefinition } from '@/types/template';

export const marqueeBannerTemplate: TemplateDefinition = {
  id: 'marquee-banner',
  name: 'Marquee Banner',
  description: '经典跑马灯横幅，文字循环滚动，适合公告和活动通知',
  category: 'banner',
  minPlan: 'free',
  previewImage: '/templates-preview/marquee-banner.png',
  configSchema: [
    { key: 'backgroundColor', label: '背景色', type: 'color', defaultValue: 'rgba(0,0,0,0.8)' },
    { key: 'textColor', label: '文字颜色', type: 'color', defaultValue: '#ffffff' },
    { key: 'accentColor', label: '强调色', type: 'color', defaultValue: '#ffd700' },
    { key: 'bannerHeight', label: '横幅高度', type: 'number', defaultValue: 36, min: 28, max: 60 },
    { key: 'fontSize', label: '字体大小', type: 'number', defaultValue: 14, min: 10, max: 20 },
    { key: 'scrollSpeed', label: '滚动速度', type: 'number', defaultValue: 8, min: 3, max: 20 },
    { key: 'prefixIcon', label: '前缀图标', type: 'select', defaultValue: '📢',
      options: [
        { label: '喇叭', value: '📢' },
        { label: '火焰', value: '🔥' },
        { label: '星星', value: '⭐' },
        { label: '无', value: '' },
      ]},
  ],
  defaultConfig: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    textColor: '#ffffff',
    accentColor: '#ffd700',
    bannerHeight: 36,
    fontSize: 14,
    scrollSpeed: 8,
    prefixIcon: '📢',
  },
  componentType: 'top_banner',
  supportedOrientations: ['horizontal'],
  recommendedSize: { width: 1920, height: 36 },
};
