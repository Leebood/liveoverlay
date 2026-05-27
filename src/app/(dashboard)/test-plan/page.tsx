// src/app/(dashboard)/test-plan/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Button, Tag, Space, message, Descriptions, Alert, Divider, Table, Progress } from 'antd';
import {
  CrownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SwapOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { getPlanLimits } from '@/lib/plan-limits';
import type { PlanType, PlanLimits } from '@/types/plan';

const PLAN_CONFIG: Record<PlanType, { color: string; label: string; desc: string }> = {
  free: { color: 'default', label: 'Free 免费版', desc: '基础功能，有水印' },
  starter: { color: 'green', label: 'Starter 入门版', desc: '适合个人直播，¥59/月' },
  pro: { color: 'blue', label: 'Pro 专业版', desc: '专业直播，全模板，¥129/月' },
  business: { color: 'gold', label: 'Business 商业版', desc: '无限商品，多店铺，¥269/月' },
};

export default function TestPlanPage() {
  const { data: session, update: updateSession } = useSession();
  const [switching, setSwitching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [limits, setLimits] = useState<PlanLimits | null>(null);

  useEffect(() => {
    const plan = ((session?.user as unknown as Record<string, unknown>)?.planType || 'free') as PlanType;
    setCurrentPlan(plan);
    setLimits(getPlanLimits(plan));
    setLoading(false);
  }, [session]);

  const handleSwitch = async (plan: PlanType) => {
    if (!session?.user?.email) {
      message.error('请先登录');
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
        message.success(data.message || `已切换为 ${plan}`);
        setCurrentPlan(plan);
        setLimits(getPlanLimits(plan));
        // 刷新 session
        await updateSession();
      } else {
        message.error(data.error || '切换失败');
      }
    } catch (err) {
      message.error('请求失败');
    } finally {
      setSwitching(false);
    }
  };

  const handleRefresh = async () => {
    await updateSession();
    message.success('已刷新会话');
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">加载中...</div>;
  }

  const planConfig = PLAN_CONFIG[currentPlan];

  // 功能对比表数据
  const featureData = [
    { feature: '商品数量', free: '3', starter: '30', pro: '100', business: '无限' },
    { feature: '可用模板', free: '1', starter: '5', pro: '全部', business: '全部' },
    { feature: 'Overlay 数量', free: '1', starter: '3', pro: '10', business: '无限' },
    { feature: '水印', free: '有', starter: '无', pro: '无', business: '无' },
    { feature: '自定义颜色', free: '否', starter: '是', pro: '是', business: '是' },
    { feature: '直播控制', free: '否', starter: '否', pro: '是', business: '是' },
    { feature: '高级分析', free: '否', starter: '否', pro: '是', business: '是' },
    { feature: '多店铺', free: '否', starter: '否', pro: '否', business: '5 个' },
    { feature: 'API 访问', free: '否', starter: '否', pro: '否', business: '是' },
    { feature: '白标品牌', free: '否', starter: '否', pro: '否', business: '是' },
  ];

  const columns = [
    { title: '功能', dataIndex: 'feature', key: 'feature', width: 120 },
    {
      title: 'Free',
      dataIndex: 'free',
      key: 'free',
      render: (val: string) => (val === '否' || val === '有') ? (
        <span className={val === '有' ? 'text-orange-500' : 'text-gray-400'}>{val}</span>
      ) : <span className="font-medium">{val}</span>,
    },
    {
      title: 'Starter',
      dataIndex: 'starter',
      key: 'starter',
      render: (val: string) => (val === '否' ? <CloseCircleOutlined className="text-gray-300" /> : <CheckCircleOutlined className="text-green-500" />),
    },
    {
      title: 'Pro',
      dataIndex: 'pro',
      key: 'pro',
      render: (val: string) => (val === '否' ? <CloseCircleOutlined className="text-gray-300" /> : <CheckCircleOutlined className="text-blue-500" />),
    },
    {
      title: 'Business',
      dataIndex: 'business',
      key: 'business',
      render: (val: string) => (val === '否' ? <CloseCircleOutlined className="text-gray-300" /> : <CheckCircleOutlined className="text-amber-500" />),
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CrownOutlined /> 计划测试工具
        </h1>
        <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
          刷新会话
        </Button>
      </div>

      <Alert
        type="warning"
        message="测试工具"
        description="此页面用于测试各会员计划的功能差异。切换计划后，全站功能限制会立即生效。正式运营前请删除此页面。"
        showIcon
      />

      {/* 当前计划状态 */}
      <Card>
        <Descriptions title="当前计划" column={3}>
          <Descriptions.Item label="计划">
            <Tag color={planConfig.color} className="text-base px-3 py-1">
              {planConfig.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="说明">{planConfig.desc}</Descriptions.Item>
          <Descriptions.Item label="用户">
            {session?.user?.email || '未登录'}
          </Descriptions.Item>
        </Descriptions>

        {limits && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {limits.maxProducts === -1 ? '∞' : limits.maxProducts}
              </div>
              <div className="text-xs text-gray-500">商品数量</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {limits.maxTemplates === -1 ? '全部' : limits.maxTemplates}
              </div>
              <div className="text-xs text-gray-500">可用模板</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {limits.maxSimultaneousOverlays === -1 ? '∞' : limits.maxSimultaneousOverlays}
              </div>
              <div className="text-xs text-gray-500">Overlay 数</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {limits.maxStores === -1 ? '∞' : limits.maxStores}
              </div>
              <div className="text-xs text-gray-500">店铺数量</div>
            </div>
          </div>
        )}
      </Card>

      {/* 快速切换 */}
      <Card title="快速切换计划">
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
                {isCurrent ? ' (当前)' : ''}
              </Button>
            );
          })}
        </Space>
      </Card>

      {/* 功能启用状态 */}
      {limits && (
        <Card title="当前计划功能开关">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: '自定义颜色', value: limits.allowCustomColors },
              { label: '自定义字体', value: limits.allowCustomFonts },
              { label: '品牌 Logo', value: limits.allowBrandLogo },
              { label: '直播控制', value: limits.allowLiveControl },
              { label: '直播预览', value: limits.allowLivePreview },
              { label: '多 Overlay', value: limits.allowMultiOverlay },
              { label: '点击追踪', value: limits.allowClickTracking },
              { label: '高级分析', value: limits.allowAdvancedAnalytics },
              { label: 'CSV 导入', value: limits.allowCsvImport },
              { label: 'API 访问', value: limits.allowApiAccess },
              { label: '白标品牌', value: limits.allowWhiteLabel },
              { label: '无水印', value: !limits.showWatermark },
            ].map((item) => (
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

      {/* 功能对比表 */}
      <Card title="全部计划功能对比">
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
        message="测试说明"
        description={
          <div className="space-y-1 text-sm">
            <p>1. 点击上方按钮切换计划，全站功能限制立即生效</p>
            <p>2. 切换后去「商品管理」「模板」「Overlay」等页面验证功能差异</p>
            <p>3. Free 计划：3 个商品、1 个模板、有水印</p>
            <p>4. Starter 计划：30 个商品、5 个模板、无水印</p>
            <p>5. Pro 计划：100 个商品、全部模板、直播控制</p>
            <p>6. Business 计划：无限商品、全部功能、5 个店铺</p>
          </div>
        }
      />
    </div>
  );
}
