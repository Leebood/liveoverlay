// src/app/(dashboard)/billing/page.tsx
'use client';

import { useState } from 'react';
import { Card, Row, Col, Button, Typography, Tag, Space, Divider, Modal, Radio, message } from 'antd';
import { CheckOutlined, CrownOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { getPlanLimits } from '@/lib/plan-limits';
import PlanBadge from '@/components/common/PlanBadge';
import type { PlanType } from '@/types/plan';

const { Title, Paragraph, Text } = Typography;

const PLAN_ORDER: PlanType[] = ['free', 'starter', 'pro', 'business'];

export default function BillingPage() {
  const { data: session } = useSession();
  const planType = ((session?.user as Record<string, unknown>)?.planType || 'free') as PlanType;
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleUpgrade = async (targetPlan: PlanType) => {
    setCheckoutLoading(targetPlan);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: targetPlan, billingPeriod }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        message.error(data.error || '创建支付链接失败');
      }
    } catch {
      message.error('网络错误');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      message.error('打开管理页面失败');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">订阅管理</Title>
          <Paragraph type="secondary">
            当前计划：<PlanBadge planType={planType} showPrice />
          </Paragraph>
        </div>
        <Space>
          <Radio.Group value={billingPeriod} onChange={e => setBillingPeriod(e.target.value)} optionType="button">
            <Radio.Button value="monthly">月付</Radio.Button>
            <Radio.Button value="yearly">年付（省20%）</Radio.Button>
          </Radio.Group>
          {planType !== 'free' && (
            <Button onClick={handleManageSubscription}>管理订阅</Button>
          )}
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {PLAN_ORDER.map(plan => {
          const limits = getPlanLimits(plan);
          const isCurrent = plan === planType;
          const price = billingPeriod === 'yearly'
            ? Math.round(limits.yearlyPrice / 12)
            : limits.price;

          return (
            <Col xs={24} sm={12} md={6} key={plan}>
              <Card className={`h-full ${isCurrent ? 'ring-2 ring-indigo-500' : ''}`}>
                <div className="text-center mb-4">
                  <PlanBadge planType={plan} />
                  <Title level={2} className="!mt-2 !mb-0">
                    {limits.price === 0 ? '免费' : `$${price}`}
                  </Title>
                  {limits.price > 0 && (
                    <Text type="secondary">/月 {billingPeriod === 'yearly' ? '(年付)' : ''}</Text>
                  )}
                </div>

                <Divider />

                <div className="space-y-2 mb-6">
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxProducts === -1 ? '无限' : limits.maxProducts}个商品</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />每商品{limits.maxImagesPerProduct}张图片</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxTemplates === -1 ? '全部' : limits.maxTemplates}套模板</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.allowedComponents.length}种组件</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxStores}个店铺</div>
                  {limits.allowLiveControl && <div><CheckOutlined className="text-green-500 mr-2" />实时控制</div>}
                  {limits.allowCustomColors && <div><CheckOutlined className="text-green-500 mr-2" />自定义颜色</div>}
                  {limits.allowBrandLogo && <div><CheckOutlined className="text-green-500 mr-2" />品牌Logo</div>}
                  {limits.showWatermark && <div><Tag color="orange">含水印</Tag></div>}
                </div>

                {isCurrent ? (
                  <Button block disabled>当前计划</Button>
                ) : (
                  <Button
                    block
                    type={PLAN_ORDER.indexOf(plan) > PLAN_ORDER.indexOf(planType) ? 'primary' : 'default'}
                    icon={<CrownOutlined />}
                    loading={checkoutLoading === plan}
                    onClick={() => handleUpgrade(plan)}
                  >
                    {PLAN_ORDER.indexOf(plan) > PLAN_ORDER.indexOf(planType) ? '升级' : '降级'}
                  </Button>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
