// src/app/(dashboard)/billing/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Tag, Space, Divider, Alert, Radio, message, Tooltip } from 'antd';
import { CheckOutlined, CrownOutlined, ExperimentOutlined, WechatOutlined, AlipayCircleOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { getPlanLimits } from '@/lib/plan-limits';
import PlanBadge from '@/components/common/PlanBadge';
import type { PlanType } from '@/types/plan';

const { Title, Paragraph, Text } = Typography;

const PLAN_ORDER: PlanType[] = ['free', 'starter', 'pro', 'business'];

type PaymentMethod = 'card' | 'wechat_pay' | 'alipay';

export default function BillingPage() {
  const { data: session, update: updateSession } = useSession();
  const planType = ((session?.user as Record<string, unknown>)?.planType || 'free') as PlanType;
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wechat_pay');
  const [currency, setCurrency] = useState<'CNY' | 'USD'>('CNY');

  useEffect(() => {
    // Check if running in demo mode (no Stripe configured)
    fetch('/api/billing/checkout', { method: 'OPTIONS' }).catch(() => {});
  }, []);

  const handleUpgrade = async (targetPlan: PlanType) => {
    setCheckoutLoading(targetPlan);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: targetPlan, billingPeriod, paymentMethod }),
      });
      const data = await res.json();
      if (data.demo) {
        // Demo mode: plan was upgraded directly
        setIsDemo(true);
        message.success(`已切换到 ${getPlanLimits(targetPlan).displayName} 计划（演示模式）`);
        await updateSession();
        window.location.reload();
      } else if (data.url) {
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
      if (data.demo) {
        message.info('演示模式：可直接在页面上切换计划');
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      message.error('打开管理页面失败');
    }
  };

  const getPrice = (plan: PlanType) => {
    const limits = getPlanLimits(plan);
    if (currency === 'CNY') {
      return billingPeriod === 'yearly'
        ? Math.round(limits.yearlyPriceCNY / 12)
        : limits.priceCNY;
    }
    return billingPeriod === 'yearly'
      ? Math.round(limits.yearlyPrice / 12)
      : limits.price;
  };

  const currencySymbol = currency === 'CNY' ? '¥' : '$';

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={3} className="!mb-1">订阅管理</Title>
          <Paragraph type="secondary">
            当前计划：<PlanBadge planType={planType} showPrice />
          </Paragraph>
        </div>
        <Space wrap>
          <Radio.Group
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="CNY">¥ 人民币</Radio.Button>
            <Radio.Button value="USD">$ 美元</Radio.Button>
          </Radio.Group>
          <Radio.Group value={billingPeriod} onChange={e => setBillingPeriod(e.target.value)} optionType="button" size="small">
            <Radio.Button value="monthly">月付</Radio.Button>
            <Radio.Button value="yearly">年付（省20%）</Radio.Button>
          </Radio.Group>
          {planType !== 'free' && (
            <Button onClick={handleManageSubscription}>管理订阅</Button>
          )}
        </Space>
      </div>

      <Alert
        type="info"
        showIcon
        icon={<ExperimentOutlined />}
        message="演示模式"
        description="当前未配置 Stripe 密钥，切换计划将直接生效无需支付。配置 STRIPE_SECRET_KEY 后可启用真实支付。"
        className="mb-6"
      />

      {/* Payment Method Selection */}
      <Card className="mb-6" size="small">
        <div className="flex items-center gap-4 flex-wrap">
          <Text strong>选择支付方式：</Text>
          <Radio.Group
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="wechat_pay">
              <WechatOutlined style={{ color: '#07C160', fontSize: 18, marginRight: 6, verticalAlign: 'middle' }} />
              微信支付
            </Radio.Button>
            <Radio.Button value="alipay">
              <AlipayCircleOutlined style={{ color: '#1677FF', fontSize: 18, marginRight: 6, verticalAlign: 'middle' }} />
              支付宝
            </Radio.Button>
            <Radio.Button value="card">
              <CreditCardOutlined style={{ fontSize: 16, marginRight: 6, verticalAlign: 'middle' }} />
              银行卡
            </Radio.Button>
          </Radio.Group>

          <div className="flex gap-3 ml-auto">
            <Tooltip title="微信扫码支付，即时到账">
              <Tag color="green" className="cursor-pointer">
                <WechatOutlined /> 微信支付支持扫码和APP支付
              </Tag>
            </Tooltip>
            <Tooltip title="支付宝扫码或账号支付">
              <Tag color="blue" className="cursor-pointer">
                <AlipayCircleOutlined /> 支付宝支持扫码和账号支付
              </Tag>
            </Tooltip>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {PLAN_ORDER.map(plan => {
          const limits = getPlanLimits(plan);
          const isCurrent = plan === planType;
          const price = getPrice(plan);

          return (
            <Col xs={24} sm={12} md={6} key={plan}>
              <Card className={`h-full ${isCurrent ? 'ring-2 ring-indigo-500' : ''}`}>
                <div className="text-center mb-4">
                  <PlanBadge planType={plan} />
                  <Title level={2} className="!mt-2 !mb-0">
                    {limits.price === 0 ? '免费' : `${currencySymbol}${price}`}
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

      {/* Payment Security Notice */}
      <div className="mt-8 text-center text-gray-400 text-sm space-y-1">
        <div>
          <WechatOutlined style={{ color: '#07C160' }} /> 微信支付
          <span className="mx-2">|</span>
          <AlipayCircleOutlined style={{ color: '#1677FF' }} /> 支付宝
          <span className="mx-2">|</span>
          <CreditCardOutlined /> 银行卡支付
        </div>
        <div>支付由 Stripe 安全处理，支持 HTTPS 加密传输</div>
        <div>年付计划可节省 20% 费用，随时可取消订阅</div>
      </div>
    </div>
  );
}
