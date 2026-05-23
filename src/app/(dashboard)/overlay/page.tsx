// src/app/(dashboard)/overlay/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Empty, Tag, Modal, Form, Select, InputNumber, message } from 'antd';
import { PlusOutlined, CopyOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getPlanLimits } from '@/lib/plan-limits';
import type { PlanType } from '@/types/plan';

const { Title, Paragraph, Text } = Typography;

interface Overlay {
  id: string;
  name: string;
  template_id: string;
  component_type: string;
  config: string;
  is_visible: boolean;
  is_active: boolean;
  width: number;
  height: number;
  overlay_url: string | null;
}

export default function OverlayPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const planType = ((session?.user as Record<string, unknown>)?.planType || 'free') as PlanType;
  const limits = getPlanLimits(planType);

  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [templates, setTemplates] = useState<{ id: string; name: string; componentType: string }[]>([]);
  const storeId = 'default';

  useEffect(() => {
    Promise.all([
      fetch(`/api/overlay?storeId=${storeId}`).then(r => r.json()),
      fetch('/api/templates').then(r => r.json()),
    ]).then(([overlayData, templateData]) => {
      if (overlayData.overlays) setOverlays(overlayData.overlays);
      if (templateData.templates) {
        setTemplates(templateData.templates.map((t: { id: string; name: string; componentType: string }) => ({
          id: t.id,
          name: t.name,
          componentType: t.componentType,
        })));
      }
    });
  }, []);

  const handleCreate = async (values: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/overlay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, storeId }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success('Overlay已创建');
        setCreateModalOpen(false);
        form.resetFields();
        // Refresh
        const overlayData = await (await fetch(`/api/overlay?storeId=${storeId}`)).json();
        if (overlayData.overlays) setOverlays(overlayData.overlays);
      } else {
        message.error(data.error || '创建失败');
      }
    } catch {
      message.error('网络错误');
    }
  };

  const copyOverlayUrl = (overlay: Overlay) => {
    const url = `${window.location.origin}/overlay/${storeId}/${overlay.id}`;
    navigator.clipboard.writeText(url);
    message.success('Overlay URL已复制到剪贴板');
  };

  const canCreate = limits.maxSimultaneousOverlays === -1 || overlays.length < limits.maxSimultaneousOverlays;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">Overlay配置</Title>
          <Paragraph type="secondary">管理你的直播Overlay，获取OBS浏览器源URL</Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={!canCreate}
          onClick={() => setCreateModalOpen(true)}
        >
          创建Overlay
        </Button>
      </div>

      {!canCreate && (
        <div className="mb-4 p-3 bg-amber-50 rounded text-amber-700">
          Overlay数量已达上限 ({limits.maxSimultaneousOverlays})，请升级计划
        </div>
      )}

      {overlays.length === 0 ? (
        <Empty description="还没有创建Overlay，点击上方按钮创建" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overlays.map(overlay => (
            <Card key={overlay.id} hoverable>
              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <Text strong className="text-lg">{overlay.name}</Text>
                  <Tag color={overlay.is_visible ? 'green' : 'red'}>
                    {overlay.is_visible ? '显示' : '隐藏'}
                  </Tag>
                </div>
                <Text type="secondary">{overlay.template_id}</Text>
              </div>

              <div className="mb-3 text-sm text-gray-500">
                {overlay.width}x{overlay.height} | {overlay.component_type}
              </div>

              <Space direction="vertical" className="w-full">
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => copyOverlayUrl(overlay)}
                  className="w-full"
                >
                  复制Overlay URL
                </Button>
                <Space>
                  <Button icon={<EyeOutlined />} size="small">预览</Button>
                  <Button icon={<SettingOutlined />} size="small">配置</Button>
                </Space>
              </Space>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="创建Overlay"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <input className="w-full p-2 border rounded" placeholder="如：主商品滚动条" />
          </Form.Item>
          <Form.Item name="templateId" label="模板" rules={[{ required: true }]}>
            <Select placeholder="选择模板">
              {templates.map(t => (
                <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="width" label="宽度" initialValue={1920}>
            <InputNumber min={200} max={3840} className="w-full" />
          </Form.Item>
          <Form.Item name="height" label="高度" initialValue={120}>
            <InputNumber min={40} max={2160} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
