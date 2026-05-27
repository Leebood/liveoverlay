// src/app/(dashboard)/page.tsx
'use client';

import { Card, Row, Col, Statistic, Button, Typography, Space } from 'antd';
import {
  ShoppingOutlined,
  DesktopOutlined,
  VideoCameraOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getPlanLimits } from '@/lib/plan-limits';
import { useI18n } from '@/i18n';
import type { PlanType } from '@/types/plan';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useI18n();
  const planType = ((session?.user as unknown as Record<string, unknown>)?.planType || 'free') as PlanType;
  const limits = getPlanLimits(planType);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">{t('dashboard.title')}</Title>
          <Paragraph type="secondary">
            {t('dashboard.welcome')}{session?.user?.name || t('dashboard.merchant')}！{t('dashboard.currentPlan')}{limits.displayName}
          </Paragraph>
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/products')}>
            {t('dashboard.addProduct')}
          </Button>
          <Button icon={<VideoCameraOutlined />} onClick={() => router.push('/live')}>
            {t('dashboard.startLive')}
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title={t('dashboard.productCount')}
              value={0}
              suffix={`/ ${limits.maxProducts === -1 ? '∞' : limits.maxProducts}`}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title={t('dashboard.activeOverlay')}
              value={0}
              prefix={<DesktopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title={t('dashboard.liveSessions')}
              value={0}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={24}>
          <Card title={t('dashboard.quickStart')}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card.Grid className="!w-full !p-4 hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/products')}>
                  <ShoppingOutlined className="text-2xl text-indigo-500 mb-2" />
                  <Title level={5}>{t('dashboard.step1Title')}</Title>
                  <Paragraph type="secondary">{t('dashboard.step1Desc')}</Paragraph>
                </Card.Grid>
              </Col>
              <Col xs={24} md={8}>
                <Card.Grid className="!w-full !p-4 hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/templates')}>
                  <DesktopOutlined className="text-2xl text-indigo-500 mb-2" />
                  <Title level={5}>{t('dashboard.step2Title')}</Title>
                  <Paragraph type="secondary">{t('dashboard.step2Desc')}</Paragraph>
                </Card.Grid>
              </Col>
              <Col xs={24} md={8}>
                <Card.Grid className="!w-full !p-4 hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/overlay')}>
                  <VideoCameraOutlined className="text-2xl text-indigo-500 mb-2" />
                  <Title level={5}>{t('dashboard.step3Title')}</Title>
                  <Paragraph type="secondary">{t('dashboard.step3Desc')}</Paragraph>
                </Card.Grid>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
