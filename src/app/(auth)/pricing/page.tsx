// src/app/(auth)/pricing/page.tsx
'use client';

import { useState } from 'react';
import { Row, Col, Card, Button, Typography, Tag, Divider, Radio, Tooltip, Space } from 'antd';
import { CheckOutlined, CrownOutlined, WechatOutlined, AlipayCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { getPlanLimits } from '@/lib/plan-limits';
import type { PlanType } from '@/types/plan';

const { Title, Paragraph, Text } = Typography;

const PLAN_ORDER: PlanType[] = ['free', 'starter', 'pro', 'business'];

export default function PricingPage() {
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
        <Title level={1}>选择你的计划</Title>
        <Paragraph className="text-lg text-gray-500">从免费开始，随时升级</Paragraph>
      </div>

      {/* Payment Methods Banner */}
      <div className="text-center mb-8">
        <Space size="large">
          <Tooltip title="微信扫码支付，即时到账">
            <Tag color="green" className="text-base px-3 py-1 cursor-pointer">
              <WechatOutlined style={{ fontSize: 18 }} /> 微信支付
            </Tag>
          </Tooltip>
          <Tooltip title="支付宝扫码支付">
            <Tag color="blue" className="text-base px-3 py-1 cursor-pointer">
              <AlipayCircleOutlined style={{ fontSize: 18 }} /> 支付宝
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
                  <Tag color="purple" className="absolute -top-3 left-1/2 -translate-x-1/2">最受欢迎</Tag>
                )}
                <div className="text-center mb-4">
                  <Title level={4}>{limits.displayName}</Title>
                  <div>
                    <Title level={1} className="!mt-0 !mb-0 inline">
                      {price === 0 ? '¥0' : `¥${price}`}
                    </Title>
                    {price > 0 && <Text type="secondary">/月</Text>}
                  </div>
                  {price > 0 && (
                    <Text type="secondary" className="text-xs">
                      年付 ¥{yearlyMonthly}/月（省20%）
                    </Text>
                  )}
                </div>

                <Divider />

                <div className="space-y-3 mb-6">
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxProducts === -1 ? '无限' : limits.maxProducts}个商品</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxTemplates === -1 ? '全部' : limits.maxTemplates}套模板</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.allowedComponents.length}种组件</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxStores}个店铺</div>
                  {limits.allowCustomColors && <div><CheckOutlined className="text-green-500 mr-2" />自定义颜色</div>}
                  {limits.allowLiveControl && <div><CheckOutlined className="text-green-500 mr-2" />实时控制</div>}
                  {limits.allowBrandLogo && <div><CheckOutlined className="text-green-500 mr-2" />品牌Logo</div>}
                  {limits.showWatermark && <div><Tag color="orange">含水印</Tag></div>}
                </div>

                <Link href="/register">
                  <Button block type={plan === 'pro' ? 'primary' : 'default'} size="large" icon={<CrownOutlined />}>
                    {price === 0 ? '免费开始' : '选择计划'}
                  </Button>
                </Link>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Bottom Payment Info */}
      <div className="text-center mt-12 text-gray-400 text-sm space-y-2">
        <div>
          支持微信支付、支付宝扫码支付
        </div>
        <div>所有计划均支持 7 天无理由退款 | 支付安全由微信支付/支付宝官方保障</div>
      </div>
    </div>
  );
}
