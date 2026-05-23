// src/app/(dashboard)/analytics/page.tsx
'use client';

import { useState } from 'react';
import { Card, Typography, Empty, Table, Tag, DatePicker, Space } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import FeatureGate from '@/components/common/FeatureGate';

const { Title, Paragraph } = Typography;

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-6">
        <Title level={3} className="!mb-1">数据分析</Title>
        <Paragraph type="secondary">查看直播数据和商品互动统计</Paragraph>
      </div>

      <FeatureGate
        feature="allowClickTracking"
        fallback={
          <div className="text-center py-20">
            <BarChartOutlined className="text-6xl text-gray-300 mb-4" />
            <Title level={4} type="secondary">数据分析需要Pro及以上计划</Title>
            <Paragraph type="secondary">升级到Pro计划，解锁直播数据分析和商品点击统计</Paragraph>
          </div>
        }
      >
        <Empty description="暂无数据，开始直播后将自动收集" />
      </FeatureGate>
    </div>
  );
}
