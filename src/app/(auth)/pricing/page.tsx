// src/app/(auth)/pricing/page.tsx
'use client';

import { Row, Col, Card, Button, Typography, Tag, Divider } from 'antd';
import { CheckOutlined, CrownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { getPlanLimits } from '@/lib/plan-limits';
import type { PlanType } from '@/types/plan';

const { Title, Paragraph, Text } = Typography;

const PLAN_ORDER: PlanType[] = ['free', 'starter', 'pro', 'business'];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-16 px-4">
      <div className="text-center mb-12">
        <Title level={1}>选择你的计划</Title>
        <Paragraph className="text-lg text-gray-500">从免费开始，随时升级</Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {PLAN_ORDER.map(plan => {
          const limits = getPlanLimits(plan);
          return (
            <Col xs={24} sm={12} md={6} key={plan}>
              <Card className={`h-full ${plan === 'pro' ? 'ring-2 ring-indigo-500 shadow-xl' : ''}`}>
                {plan === 'pro' && (
                  <Tag color="purple" className="absolute -top-3 left-1/2 -translate-x-1/2">最受欢迎</Tag>
                )}
                <div className="text-center mb-4">
                  <Title level={4}>{limits.displayName}</Title>
                  <Title level={1} className="!mt-0">
                    {limits.price === 0 ? '$0' : `$${limits.price}`}
                  </Title>
                  {limits.price > 0 && <Text type="secondary">/月</Text>}
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
                    {limits.price === 0 ? '免费开始' : '选择计划'}
                  </Button>
                </Link>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
