// src/app/(dashboard)/templates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Button, Typography, Space, Tabs, Modal, Descriptions } from 'antd';
import { CheckOutlined, LockOutlined, InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { isTemplateAllowed } from '@/lib/plan-limits';
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
  'basic-ticker': '经典滚动条',
  'modern-ticker': '现代滚动条',
  'minimal-ticker': '极简滚动条',
  'neon-ticker': '霓虹滚动条',
  'minimal-card': '简约商品卡',
  'spotlight-card': '聚光灯商品卡',
  'dual-product-compare': '双品对比卡',
  'interaction-card': '互动商品卡',
  'simple-badge': '促销角标',
  'floating-price-tag': '浮动价格签',
  'side-list': '侧边商品列表',
  'top-promo': '顶部促销横幅',
  'bottom-info-bar': '底部信息栏',
  'countdown-banner': '倒计时横幅',
  'promo-countdown': '促销倒计时',
  'flash-sale-popup': '限时闪购弹窗',
};

/* ── 共用的直播画面背景 ── */
function LiveBackground() {
  return (
    <div
      className="absolute inset-0 opacity-20"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
    />
  );
}

/* ── CSS 实时预览组件 ── */

/** 滚动商品条 - 4种变体 */
function TickerPreview({ templateId }: { templateId: string }) {
  const isModern = templateId === 'modern-ticker';
  const isMinimal = templateId === 'minimal-ticker';
  const isNeon = templateId === 'neon-ticker';

  return (
    <div
      className="w-full h-40 overflow-hidden relative"
      style={{ background: isNeon ? '#0a0a1e' : isMinimal ? '#1a1a2e' : '#0d1117' }}
    >
      <LiveBackground />
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center"
        style={{
          height: isMinimal ? 36 : isNeon ? 44 : 44,
          background: isNeon
            ? 'rgba(10,10,30,0.92)'
            : isModern
              ? 'linear-gradient(90deg, rgba(22,119,255,0.9), rgba(114,46,209,0.9))'
              : isMinimal
                ? 'rgba(26,26,46,0.95)'
                : 'rgba(0,0,0,0.85)',
          borderBottom: isModern ? '2px solid #4096ff' : 'none',
          borderTop: isNeon ? '1px solid #00ff88' : 'none',
        }}
      >
        {isNeon ? (
          <>
            <span style={{
              color: '#00ff88', fontSize: 11, fontWeight: 700, padding: '0 8px',
              textShadow: '0 0 8px #00ff88, 0 0 16px #00ff8855',
            }}>⚡ HOT</span>
            <span style={{ color: '#fff', fontSize: 12, padding: '0 6px' }}>霓虹连衣裙</span>
            <span style={{
              color: '#ffdd00', fontSize: 14, fontWeight: 700, padding: '0 4px',
              textShadow: '0 0 8px #ffdd00, 0 0 16px #ffdd0055',
            }}>¥199</span>
            <span style={{ color: '#666', fontSize: 10, textDecoration: 'line-through', padding: '0 4px' }}>¥399</span>
            <span style={{ color: '#ff00ff', fontSize: 10, padding: '0 8px',
              textShadow: '0 0 6px #ff00ff55',
            }}>│</span>
            <span style={{ color: '#fff', fontSize: 12, padding: '0 4px' }}>夜光运动鞋</span>
            <span style={{
              color: '#ffdd00', fontSize: 14, fontWeight: 700, padding: '0 4px',
              textShadow: '0 0 8px #ffdd00',
            }}>¥299</span>
          </>
        ) : isMinimal ? (
          <>
            <span style={{ color: '#52c41a', fontSize: 11, fontWeight: 700, padding: '0 8px' }}>限时</span>
            <span style={{ color: '#fff', fontSize: 12, padding: '0 4px' }}>连衣裙</span>
            <span style={{ color: '#ff4d4f', fontSize: 13, fontWeight: 700, padding: '0 4px' }}>¥199</span>
            <span style={{ color: '#8c8c8c', fontSize: 10, textDecoration: 'line-through', padding: '0 4px' }}>¥399</span>
            <span style={{ color: '#fff', fontSize: 11, padding: '0 8px' }}>运动鞋</span>
            <span style={{ color: '#ff4d4f', fontSize: 13, fontWeight: 700, padding: '0 4px' }}>¥299</span>
          </>
        ) : (
          <>
            <div
              style={{
                background: isModern ? 'rgba(255,255,255,0.2)' : '#ff4d4f',
                color: '#fff',
                padding: '2px 10px',
                fontSize: 11,
                fontWeight: 700,
                borderRadius: isModern ? 4 : 0,
                margin: '0 8px',
              }}
            >
              HOT
            </div>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 6px' }}>限时特惠连衣裙</span>
            <span style={{ color: '#ff4d4f', fontSize: 15, fontWeight: 700, margin: '0 4px' }}>¥199</span>
            <span style={{ color: '#8c8c8c', fontSize: 11, textDecoration: 'line-through', margin: '0 6px' }}>¥399</span>
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 6px' }}>运动鞋</span>
            <span style={{ color: '#ff4d4f', fontSize: 15, fontWeight: 700, margin: '0 4px' }}>¥299</span>
          </>
        )}
        <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>→</span>
        </div>
      </div>
    </div>
  );
}

/** 主推商品卡 - 4种变体 */
function ProductCardPreview({ templateId }: { templateId: string }) {
  const isSpotlight = templateId === 'spotlight-card';
  const isDual = templateId === 'dual-product-compare';
  const isInteraction = templateId === 'interaction-card';

  if (isDual) {
    return <DualComparePreview />;
  }
  if (isInteraction) {
    return <InteractionCardPreview />;
  }

  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div
        className="absolute"
        style={{
          right: isSpotlight ? 12 : 10,
          bottom: isSpotlight ? 16 : 20,
          width: isSpotlight ? 140 : 120,
          borderRadius: 8,
          overflow: 'hidden',
          background: isSpotlight
            ? 'linear-gradient(135deg, rgba(22,119,255,0.95), rgba(114,46,209,0.95))'
            : 'rgba(255,255,255,0.95)',
          boxShadow: isSpotlight ? '0 4px 24px rgba(22,119,255,0.4)' : '0 2px 12px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            height: isSpotlight ? 50 : 40,
            background: isSpotlight ? 'linear-gradient(135deg, #f5f5f5, #e8e8e8)' : 'linear-gradient(135deg, #e8f4fd, #c3e0f5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}
        >
          {isSpotlight ? '👗' : '👟'}
        </div>
        <div style={{ padding: '6px 8px' }}>
          <div style={{
            fontSize: 10, fontWeight: 600,
            color: isSpotlight ? '#fff' : '#1a1a1a',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            限时特惠连衣裙
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: isSpotlight ? '#ffd700' : '#ff4d4f' }}>¥199</span>
            <span style={{ fontSize: 9, textDecoration: 'line-through', color: isSpotlight ? 'rgba(255,255,255,0.5)' : '#999' }}>¥399</span>
          </div>
        </div>
      </div>
      {isSpotlight && (
        <div className="absolute" style={{ right: 12, top: 20, background: 'rgba(255,77,79,0.9)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
          限时
        </div>
      )}
    </div>
  );
}

/** 双品对比卡 */
function DualComparePreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* 商品A */}
        <div style={{ width: 100, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          <div style={{ height: 40, background: 'linear-gradient(135deg, #ffeef0, #ffd6d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👗</div>
          <div style={{ padding: '4px 6px' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>优雅连衣裙</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#ff4d4f' }}>¥199</div>
          </div>
        </div>
        {/* VS */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff4d4f, #cf1322)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 8, fontWeight: 800,
          boxShadow: '0 2px 8px rgba(255,77,79,0.5)',
        }}>
          VS
        </div>
        {/* 商品B */}
        <div style={{ width: 100, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          <div style={{ height: 40, background: 'linear-gradient(135deg, #e6f7ff, #bae7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👟</div>
          <div style={{ padding: '4px 6px' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>时尚运动鞋</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#ff4d4f' }}>¥299</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 互动商品卡 */
function InteractionCardPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div
        className="absolute"
        style={{ right: 10, bottom: 14, width: 140, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
      >
        <div style={{ height: 44, background: 'linear-gradient(135deg, #fff7e6, #ffe7ba)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👗</div>
        <div style={{ padding: '5px 8px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#1a1a1a' }}>热门连衣裙</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ff4d4f' }}>¥199</span>
            <span style={{ fontSize: 9, textDecoration: 'line-through', color: '#999' }}>¥399</span>
          </div>
          {/* 互动数据 */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 8, color: '#1677ff' }}>👍 2.3k</span>
            <span style={{ fontSize: 8, color: '#8c8c8c' }}>👁 8.5k</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 促销角标 - 2种变体 */
function BadgePreview({ templateId }: { templateId: string }) {
  const isFloating = templateId === 'floating-price-tag';

  if (isFloating) {
    return <FloatingPriceTagPreview />;
  }

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

/** 浮动价格签 */
function FloatingPriceTagPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div
        className="absolute"
        style={{ right: 10, top: 16, width: 120, borderRadius: 8, overflow: 'hidden', background: 'rgba(0,0,0,0.85)', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
      >
        {/* 商品图区 */}
        <div style={{ height: 50, background: 'linear-gradient(135deg, #f5f5f5, #e8e8e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
          👗
        </div>
        <div style={{ padding: '5px 8px' }}>
          <div style={{ color: '#fff', fontSize: 10, fontWeight: 600 }}>特惠连衣裙</div>
          <div style={{ color: '#ffd700', fontSize: 16, fontWeight: 800, marginTop: 2 }}>¥199</div>
        </div>
        {/* QR区域模拟 */}
        <div style={{ height: 32, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 24, height: 24, background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 0 / 6px 6px', borderRadius: 2 }} />
          <span style={{ fontSize: 8, color: '#666', marginLeft: 4 }}>扫码购买</span>
        </div>
      </div>
    </div>
  );
}

/** 侧边面板 */
function SideListPreview() {
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

/** 横幅/底部信息栏 - 3种变体 */
function BannerPreview({ templateId }: { templateId: string }) {
  const isCountdown = templateId === 'countdown-banner' || templateId === 'promo-countdown';
  const isBottomBar = templateId === 'bottom-info-bar';

  if (isBottomBar) {
    return <BottomBarPreview />;
  }

  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{
          top: isCountdown ? 40 : 10,
          height: isCountdown ? 56 : 40,
          background: isCountdown
            ? 'linear-gradient(90deg, rgba(255,77,79,0.9), rgba(250,84,28,0.9))'
            : 'linear-gradient(90deg, rgba(22,119,255,0.9), rgba(114,46,209,0.9))',
        }}
      >
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

/** 底部信息栏 */
function BottomBarPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center"
        style={{ height: 48, background: 'rgba(0,0,0,0.85)', borderTop: '1px solid rgba(255,215,0,0.3)' }}
      >
        {/* 商品图缩略 */}
        <div style={{ width: 36, height: 36, marginLeft: 10, borderRadius: 4, background: 'linear-gradient(135deg, #f5f5f5, #e8e8e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
          👗
        </div>
        <div style={{ marginLeft: 8, flex: 1 }}>
          <div style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>当前主推 · 优雅连衣裙</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ color: '#ffd700', fontSize: 14, fontWeight: 700 }}>¥199</span>
            <span style={{ color: '#666', fontSize: 9, textDecoration: 'line-through' }}>¥399</span>
          </div>
        </div>
        {/* CTA按钮 */}
        <div style={{ marginRight: 10, background: '#ff4d4f', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 14px', borderRadius: 4 }}>
          立即购买
        </div>
      </div>
    </div>
  );
}

/** 弹窗通知 */
function NotificationPreview() {
  return (
    <div className="w-full h-40 overflow-hidden relative" style={{ background: '#0d1117' }}>
      <LiveBackground />
      {/* 居中弹窗 */}
      <div
        className="absolute"
        style={{
          left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 180, borderRadius: 12,
          background: 'rgba(0,0,0,0.92)',
          border: '2px solid #ff4d4f',
          boxShadow: '0 8px 32px rgba(255,77,79,0.3), 0 0 0 1px rgba(255,77,79,0.1)',
          overflow: 'hidden',
        }}
      >
        {/* 限时标签 */}
        <div style={{ background: 'linear-gradient(90deg, #ff4d4f, #fa541c)', padding: '4px 0', textAlign: 'center' }}>
          <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>⚡ 限时闪购</span>
        </div>
        <div style={{ padding: '8px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, marginBottom: 2 }}>👗</div>
          <div style={{ color: '#fff', fontSize: 10, fontWeight: 600 }}>优雅连衣裙</div>
          <div style={{ color: '#ffd700', fontSize: 18, fontWeight: 800, marginTop: 2 }}>¥199</div>
          <div style={{ color: '#8c8c8c', fontSize: 9, textDecoration: 'line-through' }}>¥399</div>
          {/* 倒计时进度条 */}
          <div style={{ marginTop: 6, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #ff4d4f, #fa541c)', borderRadius: 2 }} />
          </div>
          <div style={{ color: '#8c8c8c', fontSize: 8, marginTop: 2 }}>3秒后自动关闭</div>
        </div>
      </div>
    </div>
  );
}

/** 路由到对应预览组件 */
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
      return <SideListPreview />;
    case 'banner':
    case 'countdown':
      return <BannerPreview templateId={id} />;
    case 'notification':
      return <NotificationPreview />;
    default:
      return (
        <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <EyeOutlined className="text-4xl text-indigo-300" />
        </div>
      );
  }
}

export default function TemplatesPage() {
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
          <Paragraph type="secondary">选择适合你直播风格的Overlay模板，共 {templates.length} 种</Paragraph>
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
                  <Button
                    type="link"
                    icon={<InfoCircleOutlined />}
                    key="info"
                    onClick={() => setDetailTemplate(template)}
                  >
                    详情
                  </Button>,
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
                      <Tag color={PLAN_TAG_COLORS[template.minPlan]} className="text-xs">
                        {template.minPlan.toUpperCase()}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Text type="secondary" className="text-xs line-clamp-2">
                      {template.description}
                    </Text>
                  }
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
              <Descriptions.Item label="分类">
                {CATEGORY_LABELS[detailTemplate.category] || detailTemplate.category}
              </Descriptions.Item>
              <Descriptions.Item label="最低计划">
                <Tag color={PLAN_TAG_COLORS[detailTemplate.minPlan]}>
                  {detailTemplate.minPlan.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="推荐尺寸">
                {detailTemplate.recommendedSize.width} × {detailTemplate.recommendedSize.height}
              </Descriptions.Item>
              <Descriptions.Item label="支持方向">
                {detailTemplate.supportedOrientations.map(o => o === 'horizontal' ? '水平' : '垂直').join(' / ')}
              </Descriptions.Item>
              <Descriptions.Item label="说明" span={2}>
                {detailTemplate.description}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}
