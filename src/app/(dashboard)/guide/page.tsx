// src/app/(dashboard)/guide/page.tsx
'use client';

import { useState } from 'react';
import { Typography, Steps, Card, Collapse, Tag, Table, Alert, Tabs, Space } from 'antd';
import {
  ShoppingOutlined,
  DesktopOutlined,
  CopyOutlined,
  VideoCameraOutlined,
  ThunderboltOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  BookOutlined,
  PlayCircleOutlined,
  ExpandOutlined,
  AppstoreOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useI18n } from '@/i18n';

const { Title, Paragraph, Text } = Typography;

export default function GuidePage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('quickstart');

  const tickerPositionData = [
    { key: '1', template: 'basic-ticker', name: t('guide.tickerNames.basic'), position: t('guide.positions.bottom'), size: '1920 × 120', plan: 'Free', color: 'default' },
    { key: '2', template: 'modern-ticker', name: t('guide.tickerNames.modern'), position: t('guide.positions.bottom'), size: '1920 × 100', plan: 'Free', color: 'default' },
    { key: '3', template: 'minimal-ticker', name: t('guide.tickerNames.minimal'), position: t('guide.positions.bottom'), size: '1920 × 80', plan: 'Starter', color: 'blue' },
    { key: '4', template: 'minimal-card', name: t('guide.tickerNames.minimalCard'), position: t('guide.positions.bottomRight'), size: '400 × 300', plan: 'Starter', color: 'blue' },
    { key: '5', template: 'spotlight-card', name: t('guide.tickerNames.spotlight'), position: t('guide.positions.right'), size: '500 × 600', plan: 'Pro', color: 'green' },
    { key: '6', template: 'simple-badge', name: t('guide.tickerNames.badge'), position: t('guide.positions.topCorner'), size: '200 × 80', plan: 'Free', color: 'default' },
    { key: '7', template: 'side-list', name: t('guide.tickerNames.sideList'), position: t('guide.positions.left'), size: '300 × 600', plan: 'Pro', color: 'green' },
    { key: '8', template: 'top-promo', name: t('guide.tickerNames.topPromo'), position: t('guide.positions.top'), size: '1920 × 100', plan: 'Starter', color: 'blue' },
    { key: '9', template: 'countdown-banner', name: t('guide.tickerNames.countdown'), position: t('guide.positions.top'), size: '1920 × 80', plan: 'Pro', color: 'green' },
    { key: '10', template: 'promo-countdown', name: t('guide.tickerNames.promoCountdown'), position: t('guide.positions.bottomRight'), size: '400 × 250', plan: 'Business', color: 'orange' },
  ];

  const tickerColumns = [
    { title: t('guide.colTemplateId'), dataIndex: 'template', key: 'template', render: (v: string) => <Text code>{v}</Text> },
    { title: t('guide.colName'), dataIndex: 'name', key: 'name' },
    { title: t('guide.colPosition'), dataIndex: 'position', key: 'position' },
    { title: t('guide.colSize'), dataIndex: 'size', key: 'size' },
    { title: t('guide.colMinPlan'), dataIndex: 'plan', key: 'plan', render: (v: string, record: { color: string }) => <Tag color={record.color}>{v}</Tag> },
  ];

  const planCompareData = [
    { key: '1', feature: t('guide.planFeatures.products'), free: '3', starter: '30', pro: '100', business: t('common.unlimited') },
    { key: '2', feature: t('guide.planFeatures.templates'), free: '2', starter: '5', pro: `${t('common.all')}(10)`, business: `${t('common.all')}(10)` },
    { key: '3', feature: t('guide.planFeatures.overlays'), free: '1', starter: '3', pro: '10', business: t('common.unlimited') },
    { key: '4', feature: t('guide.planFeatures.watermark'), free: <WarningOutlined style={{ color: '#faad14' }} />, starter: <CheckCircleOutlined style={{ color: '#52c41a' }} />, pro: <CheckCircleOutlined style={{ color: '#52c41a' }} />, business: <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
    { key: '5', feature: t('guide.planFeatures.liveControl'), free: <WarningOutlined style={{ color: '#faad14' }} />, starter: <WarningOutlined style={{ color: '#faad14' }} />, pro: <CheckCircleOutlined style={{ color: '#52c41a' }} />, business: <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
    { key: '6', feature: t('guide.planFeatures.stores'), free: '1', starter: '1', pro: '1', business: '5' },
    { key: '7', feature: t('guide.planFeatures.prioritySupport'), free: <WarningOutlined style={{ color: '#faad14' }} />, starter: <WarningOutlined style={{ color: '#faad14' }} />, pro: <WarningOutlined style={{ color: '#faad14' }} />, business: <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
  ];

  const planColumns = [
    { title: t('guide.colFeature'), dataIndex: 'feature', key: 'feature', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Free', dataIndex: 'free', key: 'free', align: 'center' as const },
    { title: 'Starter', dataIndex: 'starter', key: 'starter', align: 'center' as const },
    { title: 'Pro', dataIndex: 'pro', key: 'pro', align: 'center' as const },
    { title: 'Business', dataIndex: 'business', key: 'business', align: 'center' as const },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Title level={3} className="!mb-1">
          <BookOutlined className="mr-2" />
          {t('guide.title')}
        </Title>
        <Paragraph type="secondary">{t('guide.description')}</Paragraph>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'quickstart',
            label: <span><ThunderboltOutlined /> {t('guide.tabQuickstart')}</span>,
            children: (
              <div>
                <Alert
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                  title={t('guide.prerequisites')}
                  description={t('guide.prerequisitesDesc')}
                  className="mb-6"
                />

                <Steps
                  orientation="vertical"
                  size="small"
                  current={-1}
                  items={[
                    {
                      title: t('guide.step1Title'),
                      content: (
                        <div className="py-2">
                          <Paragraph>{t('guide.step1Content')}</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Space direction="vertical" size={4}>
                              <Text><Tag color="red">{t('common.required')}</Tag> {t('guide.fieldName')}</Text>
                              <Text><Tag color="red">{t('common.required')}</Tag> {t('guide.fieldPrice')}</Text>
                              <Text><Tag color="blue">{t('common.optional')}</Tag> {t('guide.fieldOriginalPrice')}</Text>
                              <Text><Tag color="blue">{t('common.optional')}</Tag> {t('guide.fieldTag')}</Text>
                              <Text><Tag color="blue">{t('common.optional')}</Tag> {t('guide.fieldBuyUrl')}</Text>
                              <Text><Tag color="blue">{t('common.optional')}</Tag> {t('guide.fieldImage')}</Text>
                            </Space>
                          </Card>
                          <Paragraph type="secondary">{t('guide.step1Note')}</Paragraph>
                        </div>
                      ),
                      icon: <ShoppingOutlined />,
                    },
                    {
                      title: t('guide.step2Title'),
                      content: (
                        <div className="py-2">
                          <Paragraph>{t('guide.step2Content')}</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Space direction="vertical" size={4}>
                              <Text>1. {t('guide.step2Name')}</Text>
                              <Text>2. {t('guide.step2Template')}</Text>
                              <Text>3. {t('guide.step2Width')}</Text>
                              <Text>4. {t('guide.step2Height')}</Text>
                            </Space>
                          </Card>
                          <Paragraph type="secondary">{t('guide.step2Note')}</Paragraph>
                        </div>
                      ),
                      icon: <DesktopOutlined />,
                    },
                    {
                      title: t('guide.step3Title'),
                      content: (
                        <div className="py-2">
                          <Paragraph>{t('guide.step3Content')}</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Text code className="text-xs">https://{t('guide.yourDomain')}/overlay/&#123;storeId&#125;/&#123;overlayId&#125;</Text>
                            <Paragraph type="secondary" className="!mb-0 mt-1">{t('guide.step3Note')}</Paragraph>
                          </Card>
                        </div>
                      ),
                      icon: <CopyOutlined />,
                    },
                    {
                      title: t('guide.step4Title'),
                      content: (
                        <div className="py-2">
                          <Paragraph>{t('guide.step4Content')}</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Space direction="vertical" size={4}>
                              <Text>1. {t('guide.step4Sub1')}</Text>
                              <Text>2. {t('guide.step4Sub2')}</Text>
                              <Text>3. {t('guide.step4Sub3')}</Text>
                              <Text className="pl-4">{t('guide.step4Sub3a')}</Text>
                              <Text className="pl-4">{t('guide.step4Sub3b')}</Text>
                              <Text className="pl-4">{t('guide.step4Sub3c')}</Text>
                              <Text className="pl-4">{t('guide.step4Sub3d')}</Text>
                              <Text className="pl-4">{t('guide.step4Sub3e')}</Text>
                              <Text>4. {t('guide.step4Sub4')}</Text>
                            </Space>
                          </Card>
                        </div>
                      ),
                      icon: <VideoCameraOutlined />,
                    },
                    {
                      title: t('guide.step5Title'),
                      content: (
                        <div className="py-2">
                          <Paragraph>{t('guide.step5Content')}</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Space direction="vertical" size={4}>
                              <Text>{t('guide.step5Position1')}</Text>
                              <Text>{t('guide.step5Position2')}</Text>
                              <Text>{t('guide.step5Position3')}</Text>
                              <Text>{t('guide.step5Position4')}</Text>
                            </Space>
                          </Card>
                          <Paragraph type="secondary" className="mt-2">{t('guide.step5Note')}</Paragraph>
                        </div>
                      ),
                      icon: <ExpandOutlined />,
                    },
                    {
                      title: t('guide.step6Title'),
                      content: (
                        <div className="py-2">
                          <Paragraph>{t('guide.step6Content')}</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Space direction="vertical" size={4}>
                              <Text>{t('guide.step6Feature1')}</Text>
                              <Text>{t('guide.step6Feature2')}</Text>
                              <Text>{t('guide.step6Feature3')}</Text>
                              <Text>{t('guide.step6Feature4')}</Text>
                              <Text>{t('guide.step6Feature5')}</Text>
                            </Space>
                          </Card>
                          <Alert type="warning" showIcon icon={<WarningOutlined />} title={t('guide.step6Warning')} className="mt-2" />
                        </div>
                      ),
                      icon: <PlayCircleOutlined />,
                    },
                  ]}
                />
              </div>
            ),
          },
          {
            key: 'templates',
            label: <span><AppstoreOutlined /> {t('guide.tabTemplates')}</span>,
            children: (
              <div>
                <Paragraph className="mb-4">{t('guide.templatesDesc')}</Paragraph>
                <Table dataSource={tickerPositionData} columns={tickerColumns} pagination={false} size="small" />
              </div>
            ),
          },
          {
            key: 'obs',
            label: <span><VideoCameraOutlined /> {t('guide.tabObs')}</span>,
            children: (
              <div>
                <Alert type="info" showIcon title={t('guide.obsVersion')} description={t('guide.obsVersionDesc')} className="mb-4" />
                <Collapse items={[
                  { key: '1', label: t('guide.obsAddSource'), children: <Paragraph>{t('guide.obsAddSourceDesc')}</Paragraph> },
                  { key: '2', label: t('guide.obsConfig'), children: <Paragraph>{t('guide.obsConfigDesc')}</Paragraph> },
                  { key: '3', label: t('guide.obsPosition'), children: <Paragraph>{t('guide.obsPositionDesc')}</Paragraph> },
                  { key: '4', label: t('guide.obsRefresh'), children: <Paragraph>{t('guide.obsRefreshDesc')}</Paragraph> },
                ]} />
              </div>
            ),
          },
          {
            key: 'plans',
            label: <span><CreditCardOutlined /> {t('guide.tabPlans')}</span>,
            children: (
              <div>
                <Paragraph className="mb-4">{t('guide.plansDesc')}</Paragraph>
                <Table dataSource={planCompareData} columns={planColumns} pagination={false} size="small" />
              </div>
            ),
          },
          {
            key: 'faq',
            label: <span><QuestionCircleOutlined /> {t('guide.tabFaq')}</span>,
            children: (
              <Collapse items={[
                { key: '1', label: t('guide.faq1Q'), children: <Paragraph>{t('guide.faq1A')}</Paragraph> },
                { key: '2', label: t('guide.faq2Q'), children: <Paragraph>{t('guide.faq2A')}</Paragraph> },
                { key: '3', label: t('guide.faq3Q'), children: <Paragraph>{t('guide.faq3A')}</Paragraph> },
                { key: '4', label: t('guide.faq4Q'), children: <Paragraph>{t('guide.faq4A')}</Paragraph> },
                { key: '5', label: t('guide.faq5Q'), children: <Paragraph>{t('guide.faq5A')}</Paragraph> },
                { key: '6', label: t('guide.faq6Q'), children: <Paragraph>{t('guide.faq6A')}</Paragraph> },
              ]} />
            ),
          },
        ]}
      />
    </div>
  );
}
