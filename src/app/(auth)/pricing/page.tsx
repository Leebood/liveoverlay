// src/app/(auth)/pricing/page.tsx
'use client';

import { Row, Col, Card, Button, Typography, Tag, Divider, Tooltip, Space } from 'antd';
import { CheckOutlined, CrownOutlined, WechatOutlined, AlipayCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { getPlanLimits } from '@/lib/plan-limits';
import { useI18n } from '@/i18n';
import type { PlanType } from '@/types/plan';

const { Title, Paragraph, Text } = Typography;

const PLAN_ORDER: PlanType[] = ['free', 'starter', 'pro', 'business'];

export default function PricingPage() {
  const { t } = useI18n();

  const getPrice = (plan: PlanType) => {
    const limits = getPlanLimits(plan);
    return limits.priceCNY;
  };

  const getYearlyMonthly = (plan: PlanType) => {
    const limits = getPlanLimits(plan);
    return Math.round(limits.yearlyPriceCNY / 12);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-16 px-4">
      <div className="text-center mb-8">
        <Title level={1}>{t('pricing.title')}</Title>
        <Paragraph className="text-lg text-gray-500">{t('pricing.subtitle')}</Paragraph>
      </div>

      {/* Payment Methods Banner */}
      <div className="text-center mb-8">
        <Space size="large">
          <Tooltip title={t('pricing.wechatTip')}>
            <Tag color="green" className="text-base px-3 py-1 cursor-pointer">
              <WechatOutlined style={{ fontSize: 18 }} /> {t('pricing.wechatPay')}
            </Tag>
          </Tooltip>
          <Tooltip title={t('pricing.alipayTip')}>
            <Tag color="blue" className="text-base px-3 py-1 cursor-pointer">
              <AlipayCircleOutlined style={{ fontSize: 18 }} /> {t('pricing.alipay')}
            </Tag>
          </Tooltip>
        </Space>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {PLAN_ORDER.map(plan => {
          const limits = getPlanLimits(plan);
          const price = getPrice(plan);
          const yearlyMonthly = getYearlyMonthly(plan);

          return (
            <Col xs={24} sm={12} md={6} key={plan}>
              <Card className={`h-full ${plan === 'pro' ? 'ring-2 ring-indigo-500 shadow-xl' : ''}`}>
                {plan === 'pro' && (
                  <Tag color="purple" className="absolute -top-3 left-1/2 -translate-x-1/2">{t('pricing.mostPopular')}</Tag>
                )}
                <div className="text-center mb-4">
                  <Title level={4}>{limits.displayName}</Title>
                  <div>
                    <Title level={1} className="!mt-0 !mb-0 inline">
                      {price === 0 ? '¥0' : `¥${price}`}
                    </Title>
                    {price > 0 && <Text type="secondary">/{t('pricing.month')}</Text>}
                  </div>
                  {price > 0 && (
                    <Text type="secondary" className="text-xs">
                      {t('pricing.yearlyMonthly', { price: yearlyMonthly })}
                    </Text>
                  )}
                </div>

                <Divider />

                <div className="space-y-3 mb-6">
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxProducts === -1 ? t('pricing.unlimited') : limits.maxProducts}{t('pricing.productsUnit')}</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxTemplates === -1 ? t('pricing.allTemplates') : limits.maxTemplates}{t('pricing.templatesUnit')}</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.allowedComponents.length}{t('pricing.componentsUnit')}</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxStores}{t('pricing.storesUnit')}</div>
                  {limits.allowCustomColors && <div><CheckOutlined className="text-green-500 mr-2" />{t('pricing.customColors')}</div>}
                  {limits.allowLiveControl && <div><CheckOutlined className="text-green-500 mr-2" />{t('pricing.liveControl')}</div>}
                  {limits.allowBrandLogo && <div><CheckOutlined className="text-green-500 mr-2" />{t('pricing.brandLogo')}</div>}
                  {limits.showWatermark && <div><Tag color="orange">{t('pricing.withWatermark')}</Tag></div>}
                </div>

                <Link href="/register">
                  <Button block type={plan === 'pro' ? 'primary' : 'default'} size="large" icon={<CrownOutlined />}>
                    {price === 0 ? t('pricing.startFree') : t('pricing.selectPlan')}
                  </Button>
                </Link>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Bottom Payment Info */}
      <div className="text-center mt-12 text-gray-400 text-sm space-y-2">
        <div>{t('pricing.paymentSupport')}</div>
        <div>{t('pricing.refundPolicy')}</div>
      </div>
    </div>
  );
}
