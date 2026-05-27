// src/app/(dashboard)/test-plan/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Button, Tag, Space, message, Descriptions, Alert, Divider, Table } from 'antd';
import {
  CrownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SwapOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { getPlanLimits } from '@/lib/plan-limits';
import { useI18n } from '@/i18n';
import type { PlanType, PlanLimits } from '@/types/plan';

export default function TestPlanPage() {
  const { t } = useI18n();
  const { data: session, update: updateSession } = useSession();
  const [switching, setSwitching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [limits, setLimits] = useState<PlanLimits | null>(null);

  const PLAN_CONFIG: Record<PlanType, { color: string; label: string; desc: string }> = {
    free: { color: 'default', label: `Free ${t('planTest.free')}`, desc: t('planTest.freeDesc') },
    starter: { color: 'green', label: `Starter ${t('planTest.starter')}`, desc: t('planTest.starterDesc') },
    pro: { color: 'blue', label: `Pro ${t('planTest.pro')}`, desc: t('planTest.proDesc') },
    business: { color: 'gold', label: `Business ${t('planTest.business')}`, desc: t('planTest.businessDesc') },
  };

  useEffect(() => {
    const plan = ((session?.user as unknown as Record<string, unknown>)?.planType || 'free') as PlanType;
    setCurrentPlan(plan);
    setLimits(getPlanLimits(plan));
    setLoading(false);
  }, [session]);

  const handleSwitch = async (plan: PlanType) => {
    if (!session?.user?.email) {
      message.error(t('planTest.loginFirst'));
      return;
    }

    setSwitching(true);
    try {
      const res = await fetch('/api/admin/switch-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, plan }),
      });

      const data = await res.json() as { success?: boolean; message?: string; error?: string };

      if (data.success) {
        message.success(data.message || t('planTest.switched', { plan }));
        setCurrentPlan(plan);
        setLimits(getPlanLimits(plan));
        await updateSession();
      } else {
        message.error(data.error || t('planTest.switchFailed'));
      }
    } catch {
      message.error(t('planTest.requestFailed'));
    } finally {
      setSwitching(false);
    }
  };

  const handleRefresh = async () => {
    await updateSession();
    message.success(t('planTest.sessionRefreshed'));
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">{t('common.loading')}</div>;
  }

  const planConfig = PLAN_CONFIG[currentPlan];

  const featureData = [
    { feature: t('planTest.featProducts'), free: '3', starter: '30', pro: '100', business: t('planTest.unlimited') },
    { feature: t('planTest.featTemplates'), free: '1', starter: '5', pro: t('planTest.all'), business: t('planTest.all') },
    { feature: t('planTest.featOverlays'), free: '1', starter: '3', pro: '10', business: t('planTest.unlimited') },
    { feature: t('planTest.featWatermark'), free: t('planTest.yes'), starter: t('planTest.no'), pro: t('planTest.no'), business: t('planTest.no') },
    { feature: t('planTest.featCustomColor'), free: t('planTest.no'), starter: t('planTest.yes'), pro: t('planTest.yes'), business: t('planTest.yes') },
    { feature: t('planTest.featLiveControl'), free: t('planTest.no'), starter: t('planTest.no'), pro: t('planTest.yes'), business: t('planTest.yes') },
    { feature: t('planTest.featAdvancedAnalytics'), free: t('planTest.no'), starter: t('planTest.no'), pro: t('planTest.yes'), business: t('planTest.yes') },
    { feature: t('planTest.featMultiStore'), free: t('planTest.no'), starter: t('planTest.no'), pro: t('planTest.no'), business: '5' },
    { feature: t('planTest.featApiAccess'), free: t('planTest.no'), starter: t('planTest.no'), pro: t('planTest.no'), business: t('planTest.yes') },
    { feature: t('planTest.featWhiteLabel'), free: t('planTest.no'), starter: t('planTest.no'), pro: t('planTest.no'), business: t('planTest.yes') },
  ];

  const columns = [
    { title: t('planTest.feature'), dataIndex: 'feature', key: 'feature', width: 120 },
    {
      title: 'Free',
      dataIndex: 'free',
      key: 'free',
      render: (val: string) => (val === t('planTest.no') || val === t('planTest.yes')) ? (
        <span className={val === t('planTest.yes') ? 'text-orange-500' : 'text-gray-400'}>{val}</span>
      ) : <span className="font-medium">{val}</span>,
    },
    {
      title: 'Starter',
      dataIndex: 'starter',
      key: 'starter',
      render: (val: string) => (val === t('planTest.no') ? <CloseCircleOutlined className="text-gray-300" /> : <CheckCircleOutlined className="text-green-500" />),
    },
    {
      title: 'Pro',
      dataIndex: 'pro',
      key: 'pro',
      render: (val: string) => (val === t('planTest.no') ? <CloseCircleOutlined className="text-gray-300" /> : <CheckCircleOutlined className="text-blue-500" />),
    },
    {
      title: 'Business',
      dataIndex: 'business',
      key: 'business',
      render: (val: string) => (val === t('planTest.no') ? <CloseCircleOutlined className="text-gray-300" /> : <CheckCircleOutlined className="text-amber-500" />),
    },
  ];

  const featureSwitches = limits ? [
    { label: t('planTest.featCustomColor'), value: limits.allowCustomColors },
    { label: t('planTest.featCustomFont'), value: limits.allowCustomFonts },
    { label: t('planTest.featBrandLogo'), value: limits.allowBrandLogo },
    { label: t('planTest.featLiveControl'), value: limits.allowLiveControl },
    { label: t('planTest.featLivePreview'), value: limits.allowLivePreview },
    { label: t('planTest.featMultiOverlay'), value: limits.allowMultiOverlay },
    { label: t('planTest.featClickTracking'), value: limits.allowClickTracking },
    { label: t('planTest.featAdvancedAnalytics'), value: limits.allowAdvancedAnalytics },
    { label: t('planTest.featCsvImport'), value: limits.allowCsvImport },
    { label: t('planTest.featApiAccess'), value: limits.allowApiAccess },
    { label: t('planTest.featWhiteLabel'), value: limits.allowWhiteLabel },
    { label: t('planTest.featNoWatermark'), value: !limits.showWatermark },
  ] : [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CrownOutlined /> {t('planTest.title')}
        </h1>
        <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
          {t('planTest.refreshSession')}
        </Button>
      </div>

      <Alert
        type="warning"
        message={t('planTest.testTool')}
        description={t('planTest.testToolDesc')}
        showIcon
      />

      <Card>
        <Descriptions title={t('planTest.currentPlan')} column={3}>
          <Descriptions.Item label={t('planTest.plan')}>
            <Tag color={planConfig.color} className="text-base px-3 py-1">
              {planConfig.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('planTest.description')}>{planConfig.desc}</Descriptions.Item>
          <Descriptions.Item label={t('planTest.user')}>
            {session?.user?.email || t('planTest.notLoggedIn')}
          </Descriptions.Item>
        </Descriptions>

        {limits && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {limits.maxProducts === -1 ? '∞' : limits.maxProducts}
              </div>
              <div className="text-xs text-gray-500">{t('planTest.productCount')}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {limits.maxTemplates === -1 ? t('planTest.all') : limits.maxTemplates}
              </div>
              <div className="text-xs text-gray-500">{t('planTest.templateCount')}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {limits.maxSimultaneousOverlays === -1 ? '∞' : limits.maxSimultaneousOverlays}
              </div>
              <div className="text-xs text-gray-500">{t('planTest.overlayCount')}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {limits.maxStores === -1 ? '∞' : limits.maxStores}
              </div>
              <div className="text-xs text-gray-500">{t('planTest.storeCount')}</div>
            </div>
          </div>
        )}
      </Card>

      <Card title={t('planTest.quickSwitch')}>
        <Space size="middle" wrap>
          {(Object.keys(PLAN_CONFIG) as PlanType[]).map((plan) => {
            const cfg = PLAN_CONFIG[plan];
            const isCurrent = plan === currentPlan;
            return (
              <Button
                key={plan}
                type={isCurrent ? 'primary' : 'default'}
                danger={plan === 'free' && isCurrent}
                icon={isCurrent ? <CheckCircleOutlined /> : <SwapOutlined />}
                loading={switching}
                onClick={() => handleSwitch(plan)}
                size="large"
                style={{ minWidth: 180 }}
              >
                {cfg.label}
                {isCurrent ? ` (${t('planTest.current')})` : ''}
              </Button>
            );
          })}
        </Space>
      </Card>

      {limits && (
        <Card title={t('planTest.featureSwitches')}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {featureSwitches.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  item.value
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                {item.value ? (
                  <CheckCircleOutlined className="text-green-500" />
                ) : (
                  <CloseCircleOutlined />
                )}
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Divider />

      <Card title={t('planTest.comparisonTable')}>
        <Table
          dataSource={featureData}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="feature"
        />
      </Card>

      <Alert
        type="info"
        message={t('planTest.testNotes')}
        description={
          <div className="space-y-1 text-sm">
            <p>{t('planTest.note1')}</p>
            <p>{t('planTest.note2')}</p>
            <p>{t('planTest.note3')}</p>
            <p>{t('planTest.note4')}</p>
            <p>{t('planTest.note5')}</p>
            <p>{t('planTest.note6')}</p>
          </div>
        }
      />
    </div>
  );
}
