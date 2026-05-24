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
import type { PlanType } from '@/types/plan';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const planType = ((session?.user as unknown as Record<string, unknown>)?.planType || 'free') as PlanType;
  const limits = getPlanLimits(planType);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">控制台</Title>
          <Paragraph type="secondary">
            欢迎回来，{session?.user?.name || '商家'}！当前计划：{limits.displayName}
          </Paragraph>
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/products')}>
            添加商品
          </Button>
          <Button icon={<VideoCameraOutlined />} onClick={() => router.push('/live')}>
            开始直播
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="商品数量"
              value={0}
              suffix={`/ ${limits.maxProducts === -1 ? '∞' : limits.maxProducts}`}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="活跃Overlay"
              value={0}
              prefix={<DesktopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="直播场次"
              value={0}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={24}>
          <Card title="快速开始">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card.Grid className="!w-full !p-4 hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/products')}>
                  <ShoppingOutlined className="text-2xl text-indigo-500 mb-2" />
                  <Title level={5}>1. 添加商品</Title>
                  <Paragraph type="secondary">录入你的直播商品信息</Paragraph>
                </Card.Grid>
              </Col>
              <Col xs={24} md={8}>
                <Card.Grid className="!w-full !p-4 hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/templates')}>
                  <DesktopOutlined className="text-2xl text-indigo-500 mb-2" />
                  <Title level={5}>2. 选择模板</Title>
                  <Paragraph type="secondary">选择合适的Overlay模板</Paragraph>
                </Card.Grid>
              </Col>
              <Col xs={24} md={8}>
                <Card.Grid className="!w-full !p-4 hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/overlay')}>
                  <VideoCameraOutlined className="text-2xl text-indigo-500 mb-2" />
                  <Title level={5}>3. 配置并开播</Title>
                  <Paragraph type="secondary">获取Overlay URL，添加到OBS</Paragraph>
                </Card.Grid>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
