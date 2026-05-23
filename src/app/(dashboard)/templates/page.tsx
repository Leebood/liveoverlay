// src/app/(dashboard)/templates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Button, Typography, Space, Tabs } from 'antd';
import { EyeOutlined, CheckOutlined, LockOutlined } from '@ant-design/icons';
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
  banner: '顶部横幅',
  countdown: '倒计时',
};

const PLAN_TAG_COLORS: Record<string, string> = {
  free: 'green',
  starter: 'blue',
  pro: 'purple',
  business: 'gold',
};

export default function TemplatesPage() {
  const { data: session } = useSession();
  const planType = ((session?.user as Record<string, unknown>)?.planType || 'free') as PlanType;
  const [templates, setTemplates] = useState<TemplateDefinition[]>([]);
  const [category, setCategory] = useState<string>('all');

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
          <Paragraph type="secondary">选择适合你直播风格的Overlay模板</Paragraph>
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
                cover={
                  <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <EyeOutlined className="text-4xl text-indigo-300" />
                  </div>
                }
                actions={[
                  allowed ? (
                    <Button type="link" icon={<CheckOutlined />} key="select">选择</Button>
                  ) : (
                    <Button type="link" icon={<LockOutlined />} disabled key="locked">需升级</Button>
                  ),
                ]}
              >
                <Card.Meta
                  title={
                    <Space>
                      {template.name}
                      <Tag color={PLAN_TAG_COLORS[template.minPlan]}>{template.minPlan.toUpperCase()}</Tag>
                    </Space>
                  }
                  description={<Text type="secondary">{template.description}</Text>}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
