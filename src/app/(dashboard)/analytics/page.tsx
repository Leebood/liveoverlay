'use client';

import { Card, Typography, Empty } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import FeatureGate from '@/components/common/FeatureGate';
import { useI18n } from '@/i18n';

const { Title, Paragraph } = Typography;

export default function AnalyticsPage() {
  const { t } = useI18n();

  return (
    <div>
      <div className="mb-6">
        <Title level={3} className="!mb-1">{t('analytics.title')}</Title>
        <Paragraph type="secondary">{t('analytics.subtitle')}</Paragraph>
      </div>

      <FeatureGate
        feature="allowClickTracking"
        fallback={
          <div className="text-center py-20">
            <BarChartOutlined className="text-6xl text-gray-300 mb-4" />
            <Title level={4} type="secondary">{t('analytics.needPro')}</Title>
            <Paragraph type="secondary">{t('analytics.upgradeHint')}</Paragraph>
          </div>
        }
      >
        <Empty description={t('analytics.noData')} />
      </FeatureGate>
    </div>
  );
}
