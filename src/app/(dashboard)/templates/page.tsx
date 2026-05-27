// src/app/(dashboard)/templates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Button, Typography, Space, Tabs, Modal, Descriptions } from 'antd';
import { CheckOutlined, LockOutlined, InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { isTemplateAllowed } from '@/lib/plan-limits';
import { useI18n } from '@/i18n';
import type { PlanType } from '@/types/plan';
import type { TemplateDefinition } from '@/types/template';

const { Title, Paragraph, Text } = Typography;

const CATEGORY_LABELS: Record<string, string> = {
  ticker: '滚动商品条',
  product_card: '主推商品卡',
  badge: '促销角标',
  side_panel: '侧边面板',
  banner: '横幅信息栏',
  countdown: '倒计时',
  notification: '弹窗通知',
};

const PLAN_TAG_COLORS: Record<string, string> = {
  free: 'green',
  starter: 'blue',
  pro: 'purple',
  business: 'gold',
};

const TEMPLATE_DISPLAY_NAMES: Record<string, string> = {
  // Ticker
  'basic-ticker': '经典滚动条',
  'modern-ticker': '现代滚动条',
  'minimal-ticker': '极简滚动条',
  'neon-ticker': '霓虹滚动条',
  'glass-ticker': '毛玻璃滚动条',
  'gradient-ticker': '渐变流光条',
  // Product Card
  'minimal-card': '简约商品卡',
  'spotlight-card': '聚光灯商品卡',
  'dual-product-compare': '双品对比卡',
  'interaction-card': '互动商品卡',
  'vertical-card': '竖版商品卡',
  'floating-card': '浮动气泡卡',
  // Badge
  'simple-badge': '促销角标',
  'floating-price-tag': '浮动价格签',
  'ribbon-badge': '缎带折角标',
  'stamp-badge': '印章角标',
  // Side Panel
  'side-list': '侧边商品列表',
  'side-cards': '侧边大图卡片',
  'side-mini-list': '侧边迷你列表',
  // Banner
  'top-promo': '顶部促销横幅',
  'bottom-info-bar': '底部信息栏',
  'marquee-banner': '跑马灯横幅',
  'announcement-bar': '公告栏横幅',
  // Countdown
  'countdown-banner': '倒计时横幅',
  'promo-countdown': '促销倒计时',
  'deal-timer': '圆形秒杀计时器',
  'flash-countdown': '闪电倒计时',
  // Notification
  'flash-sale-popup': '限时闪购弹窗',
  'sold-popup': '已售通知弹窗',
  'viewer-popup': '观众互动弹窗',
};

/* ════════════════════════════════════════════
   CSS 实时预览组件 — 28 种模板
   ════════════════════════════════════════════ */

function LiveBackground() {
  return (
    <div
      className="absolute inset-0 opacity-20"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
    />
  );
}

/* ── 滚动商品条 (6种) ── */
function TickerPreview({ templateId }: { templateId: string }) {
  const variant = templateId as string;
  const isModern = variant === 'modern-ticker';
  const isMinimal = variant === 'minimal-ticker';
  const isNeon = variant === 'neon-ticker';
  const isGlass = variant === 'glass-ticker';
  const isGradient = variant === 'gradient-ticker';

  const bgColor = isNeon ? '#0a0a1e'
    : isGlass ? '#0d1117'
    : isGradient ? '#0d1117'
    : isMinimal ? '#1a1a2e' : '#0d1117';

  const barBg = isGradient
    ? 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)'
    : isNeon
      ? 'rgba(10,10,30,0.92)'
      : isGlass
        ? 'rgba(255,255,255,0.12)'
        : isModern
          ? 'linear-gradient(90deg, rgba(22,119,255,0.9), rgba(114,46,209,0.9))'
          : isMinimal
            ? 'rgba(26,26,46,0.95)'
            : 'rgba(0,0,0,0.85)';

  const barHeight = isMinimal ? 36 : isGlass ? 46 : 44;

  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: bgColor }}>
      <LiveBackground />
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center"
        style={{
          height: barHeight,
          background: barBg,
          borderBottom: isModern ? '2px solid #4096ff' : 'none',
          borderTop: isNeon ? '1px solid #00ff88' : 'none',
          backdropFilter: isGlass ? 'blur(12px)' : 'none',
          border: isGlass ? '1px solid rgba(255,255,255,0.15)' : 'none',
          backgroundSize: isGradient ? '200% 100%' : 'auto',
        }}
      >
        {isGradient ? (
          <>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, padding: '0 8px' }}>🔥 HOT</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, padding: '0 4px' }}>彩虹连衣裙</span>
            <span style={{ color: '#fff', fontSize: 15, fontWeight: 800, padding: '0 4px' }}>¥199</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, textDecoration: 'line-through', padding: '0 4px' }}>¥399</span>
          </>
        ) : isNeon ? (
          <>
            <span style={{ color: '#00ff88', fontSize: 11, fontWeight: 700, padding: '0 8px', textShadow: '0 0 8px #00ff88, 0 0 16px #00ff8855' }}>⚡ HOT</span>
            <span style={{ color: '#fff', fontSize: 12, padding: '0 6px' }}>霓虹连衣裙</span>
            <span style={{ color: '#ffdd00', fontSize: 14, fontWeight: 700, padding: '0 4px', textShadow: '0 0 8px #ffdd00' }}>¥199</span>
            <span style={{ color: '#666', fontSize: 10, textDecoration: 'line-through', padding: '0 4px' }}>¥399</span>
          </>
        ) : isGlass ? (
          <>
            <span style={{ color: '#ffd700', fontSize: 11, fontWeight: 700, padding: '0 8px' }}>✨ HOT</span>
            <span style={{ color: '#fff', fontSize: 12, padding: '0 4px' }}>毛玻璃连衣裙</span>
            <span style={{ color: '#ffd700', fontSize: 14, fontWeight: 700, padding: '0 4px' }}>¥199</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, textDecoration: 'line-through', padding: '0 4px' }}>¥399</span>
          </>
        ) : isMinimal ? (
          <>
            <span style={{ color: '#52c41a', fontSize: 11, fontWeight: 700, padding: '0 8px' }}>限时</span>
            <span style={{ color: '#fff', fontSize: 12, padding: '0 4px' }}>连衣裙</span>
            <span style={{ color: '#ff4d4f', fontSize: 13, fontWeight: 700, padding: '0 4px' }}>¥199</span>
            <span style={{ color: '#8c8c8c', fontSize: 10, textDecoration: 'line-through', padding: '0 4px' }}>¥399</span>
          </>
        ) : (
          <>
            <div style={{ background: isModern ? 'rgba(255,255,255,0.2)' : '#ff4d4f', color: '#fff', padding: '2px 10px', fontSize: 11, fontWeight: 700, borderRadius: isModern ? 4 : 0, margin: '0 8px' }}>HOT</div>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 6px' }}>限时特惠连衣裙</span>
            <span style={{ color: '#ff4d4f', fontSize: 15, fontWeight: 700, margin: '0 4px' }}>¥199</span>
            <span style={{ color: '#8c8c8c', fontSize: 11, textDecoration: 'line-through', margin: '0 6px' }}>¥399</span>
          </>
        )}
        <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>→</span>
        </div>
      </div>
    </div>
  );
}

/* ── 主推商品卡 (6种) ── */
function ProductCardPreview({ templateId }: { templateId: string }) {
  if (templateId === 'dual-product-compare') return <DualComparePreview />;
  if (templateId === 'interaction-card') return <InteractionCardPreview />;
  if (templateId === 'vertical-card') return <VerticalCardPreview />;
  if (templateId === 'floating-card') return <FloatingCardPreview />;

  const isSpotlight = templateId === 'spotlight-card';
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div
        className="absolute"
        style={{
          right: isSpotlight ? 12 : 10, bottom: isSpotlight ? 16 : 20,
          width: isSpotlight ? 140 : 120, borderRadius: 8, overflow: 'hidden',
          background: isSpotlight ? 'linear-gradient(135deg, rgba(22,119,255,0.95), rgba(114,46,209,0.95))' : 'rgba(255,255,255,0.95)',
          boxShadow: isSpotlight ? '0 4px 24px rgba(22,119,255,0.4)' : '0 2px 12px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ height: isSpotlight ? 50 : 40, background: isSpotlight ? 'linear-gradient(135deg, #f5f5f5, #e8e8e8)' : 'linear-gradient(135deg, #e8f4fd, #c3e0f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
          {isSpotlight ? '👗' : '👟'}
        </div>
        <div style={{ padding: '6px 8px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: isSpotlight ? '#fff' : '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>限时特惠连衣裙</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: isSpotlight ? '#ffd700' : '#ff4d4f' }}>¥199</span>
            <span style={{ fontSize: 9, textDecoration: 'line-through', color: isSpotlight ? 'rgba(255,255,255,0.5)' : '#999' }}>¥399</span>
          </div>
        </div>
      </div>
      {isSpotlight && (
        <div className="absolute" style={{ right: 12, top: 20, background: 'rgba(255,77,79,0.9)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>限时</div>
      )}
    </div>
  );
}

function DualComparePreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 100, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          <div style={{ height: 40, background: 'linear-gradient(135deg, #ffeef0, #ffd6d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👗</div>
          <div style={{ padding: '4px 6px' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#333' }}>优雅连衣裙</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#ff4d4f' }}>¥199</div>
          </div>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #ff4d4f, #cf1322)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, fontWeight: 800, boxShadow: '0 2px 8px rgba(255,77,79,0.5)' }}>VS</div>
        <div style={{ width: 100, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          <div style={{ height: 40, background: 'linear-gradient(135deg, #e6f7ff, #bae7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👟</div>
          <div style={{ padding: '4px 6px' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#333' }}>时尚运动鞋</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#ff4d4f' }}>¥299</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InteractionCardPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ right: 10, bottom: 14, width: 140, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
        <div style={{ height: 44, background: 'linear-gradient(135deg, #fff7e6, #ffe7ba)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👗</div>
        <div style={{ padding: '5px 8px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#1a1a1a' }}>热门连衣裙</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ff4d4f' }}>¥199</span>
            <span style={{ fontSize: 9, textDecoration: 'line-through', color: '#999' }}>¥399</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 8, color: '#1677ff' }}>👍 2.3k</span>
            <span style={{ fontSize: 8, color: '#8c8c8c' }}>👁 8.5k</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerticalCardPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ right: 16, top: '50%', transform: 'translateY(-50%)', width: 90, borderRadius: 10, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
        <div style={{ height: 60, background: 'linear-gradient(135deg, #f9f0ff, #efdbff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👗</div>
        <div style={{ padding: '5px 7px' }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: '#333' }}>优雅连衣裙</div>
          <div style={{ fontSize: 8, color: '#8c8c8c', marginTop: 1 }}>夏季新款</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#ff4d4f', marginTop: 2 }}>¥199</div>
        </div>
      </div>
    </div>
  );
}

function FloatingCardPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ right: 14, bottom: 20, borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.95)', boxShadow: '0 6px 24px rgba(114,46,209,0.3)', width: 130 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #f9f0ff, #efdbff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>👗</div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#333' }}>可爱连衣裙</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#722ed1' }}>¥199</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 促销角标 (4种) ── */
function BadgePreview({ templateId }: { templateId: string }) {
  if (templateId === 'floating-price-tag') return <FloatingPriceTagPreview />;
  if (templateId === 'ribbon-badge') return <RibbonBadgePreview />;
  if (templateId === 'stamp-badge') return <StampBadgePreview />;

  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ top: 12, right: 12, background: 'linear-gradient(135deg, #ff4d4f, #cf1322)', borderRadius: 6, padding: '4px 12px', boxShadow: '0 2px 12px rgba(255,77,79,0.5)' }}>
        <div style={{ color: '#fff', fontSize: 9, fontWeight: 600, opacity: 0.8 }}>限时</div>
        <div style={{ color: '#ffd700', fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>5折</div>
      </div>
      <div className="absolute" style={{ bottom: 30, left: 20, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '4px 10px' }}>
        <div style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>连衣裙</div>
        <div style={{ color: '#ff4d4f', fontSize: 14, fontWeight: 700 }}>¥199</div>
      </div>
    </div>
  );
}

function FloatingPriceTagPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ right: 10, top: 16, width: 120, borderRadius: 8, overflow: 'hidden', background: 'rgba(0,0,0,0.85)', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}>
        <div style={{ height: 50, background: 'linear-gradient(135deg, #f5f5f5, #e8e8e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👗</div>
        <div style={{ padding: '5px 8px' }}>
          <div style={{ color: '#fff', fontSize: 10, fontWeight: 600 }}>特惠连衣裙</div>
          <div style={{ color: '#ffd700', fontSize: 16, fontWeight: 800, marginTop: 2 }}>¥199</div>
        </div>
        <div style={{ height: 32, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 24, height: 24, background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 0 / 6px 6px', borderRadius: 2 }} />
          <span style={{ fontSize: 8, color: '#666', marginLeft: 4 }}>扫码购买</span>
        </div>
      </div>
    </div>
  );
}

function RibbonBadgePreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      {/* 缎带折角 */}
      <div className="absolute" style={{ top: 0, right: 0, width: 0, height: 0 }}>
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <div style={{
            background: '#ff4d4f', color: '#fff',
            padding: '4px 16px', fontSize: 10, fontWeight: 700,
            transform: 'rotate(45deg)', transformOrigin: 'center',
            boxShadow: '0 2px 8px rgba(255,77,79,0.5)',
            whiteSpace: 'nowrap',
          }}>
            限时特惠
          </div>
        </div>
      </div>
      {/* 缎带阴影三角 */}
      <div className="absolute" style={{ top: 0, right: 0 }}>
        <div style={{ width: 0, height: 0, borderTop: '14px solid #cf1322', borderRight: '14px solid transparent' }} />
      </div>
      <div className="absolute" style={{ bottom: 24, left: 16, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '4px 10px' }}>
        <div style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>连衣裙</div>
        <div style={{ color: '#ff4d4f', fontSize: 14, fontWeight: 700 }}>¥199</div>
      </div>
    </div>
  );
}

function StampBadgePreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      {/* 印章 */}
      <div className="absolute" style={{ right: 16, top: '50%', transform: 'translateY(-50%)' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: '3px solid #cf1322',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.95)',
          transform: 'rotate(-15deg)',
          boxShadow: '0 2px 8px rgba(207,19,34,0.3)',
        }}>
          <div style={{ fontSize: 7, color: '#cf1322', fontWeight: 700, letterSpacing: 1 }}>OFFICIAL</div>
          <div style={{ width: 40, height: 1, background: '#cf1322', margin: '2px 0' }} />
          <div style={{ fontSize: 14, color: '#cf1322', fontWeight: 800 }}>正品</div>
        </div>
      </div>
    </div>
  );
}

/* ── 侧边面板 (3种) ── */
function SidePanelPreview({ templateId }: { templateId: string }) {
  if (templateId === 'side-cards') return <SideCardsPreview />;
  if (templateId === 'side-mini-list') return <SideMiniListPreview />;

  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ left: 8, top: 10, bottom: 10, width: 110, background: 'rgba(0,0,0,0.8)', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {['连衣裙 ¥199', '运动鞋 ¥299', '手提包 ¥159'].map((item, i) => (
          <div key={i} style={{ background: i === 0 ? 'rgba(22,119,255,0.3)' : 'rgba(255,255,255,0.05)', borderRadius: 4, padding: '3px 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 18, height: 18, borderRadius: 3, background: 'linear-gradient(135deg, #f0f0f0, #d9d9d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>
              {['👗', '👟', '👜'][i]}
            </div>
            <span style={{ color: i === 0 ? '#4096ff' : '#ccc', fontSize: 9, fontWeight: i === 0 ? 600 : 400 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SideCardsPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ left: 6, top: 6, bottom: 6, width: 120, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          { emoji: '👗', name: '连衣裙', price: '¥199', bg: 'linear-gradient(135deg, #fff0f6, #ffd6e7)' },
          { emoji: '👟', name: '运动鞋', price: '¥299', bg: 'linear-gradient(135deg, #e6f7ff, #bae7ff)' },
        ].map((item, i) => (
          <div key={i} style={{ flex: 1, borderRadius: 6, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            <div style={{ height: 28, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{item.emoji}</div>
            <div style={{ padding: '3px 5px' }}>
              <div style={{ fontSize: 8, fontWeight: 600, color: '#333' }}>{item.name}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ff4d4f' }}>{item.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SideMiniListPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ left: 6, top: 8, bottom: 8, width: 80, background: 'rgba(0,0,0,0.75)', borderRadius: 6, padding: '4px 5px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[
          { n: '连衣裙', p: '¥199', hot: true },
          { n: '运动鞋', p: '¥299', hot: false },
          { n: '手提包', p: '¥159', hot: false },
          { n: '太阳镜', p: '¥89', hot: false },
          { n: '帽子', p: '¥69', hot: false },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1px 3px', borderRadius: 2, background: i === 0 ? 'rgba(22,119,255,0.2)' : 'transparent' }}>
            <span style={{ color: item.hot ? '#4096ff' : '#ccc', fontSize: 8, fontWeight: item.hot ? 600 : 400, maxWidth: 36, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.n}</span>
            <span style={{ color: '#ffd700', fontSize: 8, fontWeight: 700 }}>{item.p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 横幅信息栏 (4种) ── */
function BannerPreview({ templateId }: { templateId: string }) {
  if (templateId === 'bottom-info-bar') return <BottomBarPreview />;
  if (templateId === 'marquee-banner') return <MarqueeBannerPreview />;
  if (templateId === 'announcement-bar') return <AnnouncementBarPreview />;

  const isCountdown = templateId === 'countdown-banner' || templateId === 'promo-countdown';
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute left-0 right-0 flex items-center justify-center" style={{ top: isCountdown ? 40 : 10, height: isCountdown ? 56 : 40, background: isCountdown ? 'linear-gradient(90deg, rgba(255,77,79,0.9), rgba(250,84,28,0.9))' : 'linear-gradient(90deg, rgba(22,119,255,0.9), rgba(114,46,209,0.9))' }}>
        {isCountdown ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>限时抢购</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['02', '15', '38'].map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <span style={{ background: 'rgba(0,0,0,0.3)', color: '#ffd700', fontSize: 16, fontWeight: 800, padding: '2px 6px', borderRadius: 3 }}>{n}</span>
                  {i < 2 && <span style={{ color: '#ffd700', fontSize: 12 }}>:</span>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#ffd700', fontSize: 10, fontWeight: 700 }}>NEW</span>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>新品上市 全场5折起</span>
            <span style={{ color: '#fff', fontSize: 10, border: '1px solid rgba(255,255,255,0.6)', borderRadius: 10, padding: '1px 8px' }}>立即抢购</span>
          </div>
        )}
      </div>
    </div>
  );
}

function BottomBarPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute bottom-0 left-0 right-0 flex items-center" style={{ height: 48, background: 'rgba(0,0,0,0.85)', borderTop: '1px solid rgba(255,215,0,0.3)' }}>
        <div style={{ width: 36, height: 36, marginLeft: 10, borderRadius: 4, background: 'linear-gradient(135deg, #f5f5f5, #e8e8e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👗</div>
        <div style={{ marginLeft: 8, flex: 1 }}>
          <div style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>当前主推 · 优雅连衣裙</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ color: '#ffd700', fontSize: 14, fontWeight: 700 }}>¥199</span>
            <span style={{ color: '#666', fontSize: 9, textDecoration: 'line-through' }}>¥399</span>
          </div>
        </div>
        <div style={{ marginRight: 10, background: '#ff4d4f', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 14px', borderRadius: 4 }}>立即购买</div>
      </div>
    </div>
  );
}

function MarqueeBannerPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute left-0 right-0 flex items-center" style={{ top: 30, height: 32, background: 'rgba(0,0,0,0.8)' }}>
        <span style={{ color: '#ffd700', fontSize: 12, margin: '0 8px' }}>📢</span>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>全场满200减50 · 限时特惠 · 新品上市 · 全场包邮</span>
        <span style={{ color: '#ffd700', fontSize: 11, margin: '0 8px' }}>→</span>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>爆款秒杀中 · 限时特惠</span>
      </div>
    </div>
  );
}

function AnnouncementBarPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute left-0 right-0 flex items-center justify-center" style={{ top: 30, height: 36, background: 'rgba(22,119,255,0.9)' }}>
        <span style={{ color: '#ffd700', fontSize: 12, margin: '0 8px' }}>📦</span>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>全场包邮 · 7天无理由退换</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 8px', cursor: 'pointer' }}>✕</span>
      </div>
    </div>
  );
}

/* ── 倒计时 (4种) ── */
function CountdownPreview({ templateId }: { templateId: string }) {
  if (templateId === 'deal-timer') return <DealTimerPreview />;
  if (templateId === 'flash-countdown') return <FlashCountdownPreview />;

  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute left-0 right-0 flex items-center justify-center" style={{ top: 40, height: 56, background: 'linear-gradient(90deg, rgba(255,77,79,0.9), rgba(250,84,28,0.9))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>限时抢购</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['02', '15', '38'].map((n, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span style={{ background: 'rgba(0,0,0,0.3)', color: '#ffd700', fontSize: 16, fontWeight: 800, padding: '2px 6px', borderRadius: 3 }}>{n}</span>
                {i < 2 && <span style={{ color: '#ffd700', fontSize: 12 }}>:</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DealTimerPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        {/* 圆形进度 */}
        <div style={{ position: 'relative', width: 72, height: 72 }}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
            <circle cx="36" cy="36" r="30" fill="none" stroke="#ff4d4f" strokeWidth="4" strokeDasharray="188" strokeDashoffset="47" strokeLinecap="round" transform="rotate(-90 36 36)" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>75%</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 7 }}>已售</span>
          </div>
        </div>
        <div style={{ color: '#ff4d4f', fontSize: 9, fontWeight: 700 }}>仅剩 02:38</div>
      </div>
    </div>
  );
}

function FlashCountdownPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute left-0 right-0 flex items-center justify-center" style={{ top: '50%', transform: 'translateY(-50%)', height: 52, background: 'rgba(0,0,0,0.9)', borderTop: '2px solid #ffdd00', borderBottom: '2px solid #ffdd00' }}>
        <span style={{ color: '#ffdd00', fontSize: 12, fontWeight: 800, margin: '0 12px' }}>⚡ 闪电秒杀</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['00', '05', '22'].map((n, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span style={{ background: '#ff4d4f', color: '#fff', fontSize: 18, fontWeight: 900, padding: '2px 6px', borderRadius: 3, boxShadow: '0 0 12px rgba(255,77,79,0.6)' }}>{n}</span>
              {i < 2 && <span style={{ color: '#ffdd00', fontSize: 14, fontWeight: 800 }}>:</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 弹窗通知 (3种) ── */
function NotificationPreview({ templateId }: { templateId: string }) {
  if (templateId === 'sold-popup') return <SoldPopupPreview />;
  if (templateId === 'viewer-popup') return <ViewerPopupPreview />;

  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 180, borderRadius: 12, background: 'rgba(0,0,0,0.92)', border: '2px solid #ff4d4f', boxShadow: '0 8px 32px rgba(255,77,79,0.3)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(90deg, #ff4d4f, #fa541c)', padding: '4px 0', textAlign: 'center' }}>
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>⚡ 限时闪购</span>
        </div>
        <div style={{ padding: '8px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, marginBottom: 2 }}>👗</div>
          <div style={{ color: '#fff', fontSize: 10, fontWeight: 600 }}>优雅连衣裙</div>
          <div style={{ color: '#ffd700', fontSize: 18, fontWeight: 800, marginTop: 2 }}>¥199</div>
          <div style={{ color: '#8c8c8c', fontSize: 9, textDecoration: 'line-through' }}>¥399</div>
          <div style={{ marginTop: 6, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #ff4d4f, #fa541c)', borderRadius: 2 }} />
          </div>
          <div style={{ color: '#8c8c8c', fontSize: 8, marginTop: 2 }}>3秒后自动关闭</div>
        </div>
      </div>
    </div>
  );
}

function SoldPopupPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ left: 10, bottom: 12, width: 180, borderRadius: 8, background: 'rgba(0,0,0,0.85)', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #87e8de, #36cfc9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>👤</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#52c41a', fontSize: 9, fontWeight: 600 }}>✓ 已购买</div>
          <div style={{ color: '#fff', fontSize: 10, fontWeight: 500 }}>用户 ***28 刚刚购买了 连衣裙</div>
        </div>
      </div>
    </div>
  );
}

function ViewerPopupPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ left: 10, bottom: 12, borderRadius: 24, background: 'rgba(22,119,255,0.9)', padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(22,119,255,0.4)' }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #ffd6e7, #ff85c0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>👤</div>
        <div>
          <span style={{ color: '#ffd700', fontSize: 10, fontWeight: 700 }}>Lisa</span>
          <span style={{ color: '#fff', fontSize: 9, marginLeft: 4 }}>关注了直播间</span>
        </div>
        <span style={{ fontSize: 10 }}>🎉</span>
      </div>
    </div>
  );
}

/* ── 路由到对应预览组件 ── */
function TemplatePreview({ template }: { template: TemplateDefinition }) {
  const { category, id } = template;
  switch (category) {
    case 'ticker':
      return <TickerPreview templateId={id} />;
    case 'product_card':
      return <ProductCardPreview templateId={id} />;
    case 'badge':
      return <BadgePreview templateId={id} />;
    case 'side_panel':
      return <SidePanelPreview templateId={id} />;
    case 'banner':
      return <BannerPreview templateId={id} />;
    case 'countdown':
      return <CountdownPreview templateId={id} />;
    case 'notification':
      return <NotificationPreview templateId={id} />;
    default:
      return (
        <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <EyeOutlined className="text-4xl text-indigo-300" />
        </div>
      );
  }
}

/* ── 页面主体 ── */
export default function TemplatesPage() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const planType = ((session?.user as Record<string, unknown>)?.planType || 'free') as PlanType;
  const [templates, setTemplates] = useState<TemplateDefinition[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [detailTemplate, setDetailTemplate] = useState<TemplateDefinition | null>(null);

  useEffect(() => {
    fetch(`/api/templates${category !== 'all' ? `?category=${category}` : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.templates) setTemplates(data.templates);
      })
      .catch(() => {});
  }, [category]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">模板选择</Title>
          <Paragraph type="secondary">{t('templates.subtitle')} {templates.length} {t('templates.countUnit')}</Paragraph>
        </div>
      </div>

      <Tabs
        activeKey={category}
        onChange={setCategory}
        items={[
          { key: 'all', label: '全部' },
          ...Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label })),
        ]}
      />

      <Row gutter={[16, 16]}>
        {templates.map(template => {
          const allowed = isTemplateAllowed(planType, template.id);
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={template.id}>
              <Card
                hoverable
                className={allowed ? '' : 'opacity-60'}
                styles={{ body: { padding: 12 } }}
                cover={<TemplatePreview template={template} />}
                actions={[
                  <Button type="link" icon={<InfoCircleOutlined />} key="info" onClick={() => setDetailTemplate(template)}>{t('templates.detail')}</Button>,
                  allowed ? (
                    <Button type="link" icon={<CheckOutlined />} key="select">选择</Button>
                  ) : (
                    <Button type="link" icon={<LockOutlined />} disabled key="locked">需升级</Button>
                  ),
                ]}
              >
                <Card.Meta
                  title={
                    <Space size={4}>
                      <span className="text-sm">{TEMPLATE_DISPLAY_NAMES[template.id] || template.name}</span>
                      <Tag color={PLAN_TAG_COLORS[template.minPlan]} className="text-xs">{template.minPlan.toUpperCase()}</Tag>
                    </Space>
                  }
                  description={<Text type="secondary" className="text-xs line-clamp-2">{template.description}</Text>}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal
        title={detailTemplate ? (TEMPLATE_DISPLAY_NAMES[detailTemplate.id] || detailTemplate.name) : ''}
        open={!!detailTemplate}
        onCancel={() => setDetailTemplate(null)}
        footer={null}
        width={520}
      >
        {detailTemplate && (
          <div>
            <div className="mb-4 rounded-lg overflow-hidden">
              <TemplatePreview template={detailTemplate} />
            </div>
            <Descriptions column={2} size="small">
              <Descriptions.Item label={t('templates.category')}>{CATEGORY_LABELS[detailTemplate.category] || detailTemplate.category}</Descriptions.Item>
              <Descriptions.Item label={t('templates.minPlan')}><Tag color={PLAN_TAG_COLORS[detailTemplate.minPlan]}>{detailTemplate.minPlan.toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label={t('templates.recommendedSize')}>{detailTemplate.recommendedSize.width} × {detailTemplate.recommendedSize.height}</Descriptions.Item>
              <Descriptions.Item label="支持方向">{detailTemplate.supportedOrientations.map(o => o === 'horizontal' ? '水平' : '垂直').join(' / ')}</Descriptions.Item>
              <Descriptions.Item label="说明" span={2}>{detailTemplate.description}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}
