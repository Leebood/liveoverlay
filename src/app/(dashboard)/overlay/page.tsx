// src/app/(dashboard)/overlay/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Empty, Tag, Modal, Form, Select, Input, InputNumber, message } from 'antd';
import { PlusOutlined, CopyOutlined, EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getPlanLimits } from '@/lib/plan-limits';
import { useStore } from '@/hooks/useStore';
import { useI18n } from '@/i18n';
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
  const { t } = useI18n();
  const { data: session } = useSession();
  const router = useRouter();
  const planType = ((session?.user as Record<string, unknown>)?.planType || 'free') as PlanType;
  const limits = getPlanLimits(planType);
  const { storeId, loading: storeLoading } = useStore();

  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [templates, setTemplates] = useState<{ id: string; name: string; componentType: string }[]>([]);

  useEffect(() => {
    if (!storeId) return;
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
  }, [storeId]);

  const handleCreate = async (values: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/overlay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, storeId }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success(t('overlay.created'));
        setCreateModalOpen(false);
        form.resetFields();
        const overlayData = await (await fetch(`/api/overlay?storeId=${storeId}`)).json();
        if (overlayData.overlays) setOverlays(overlayData.overlays);
      } else {
        message.error(data.error || t('overlay.createFailed'));
      }
    } catch {
      message.error(t('common.networkError'));
    }
  };

  if (storeLoading) return <div className="p-6 text-gray-500">{t('common.loading')}</div>;
  if (!storeId) return <div className="p-6 text-gray-500">{t('common.noStore')}</div>;

  const copyOverlayUrl = (overlay: Overlay) => {
    const url = `${window.location.origin}/overlay/${storeId}/${overlay.id}`;
    navigator.clipboard.writeText(url);
    message.success(t('overlay.urlCopied'));
  };

  const canCreate = limits.maxSimultaneousOverlays === -1 || overlays.length < limits.maxSimultaneousOverlays;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">{t('overlay.title')}</Title>
          <Paragraph type="secondary">{t('overlay.description')}</Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={!canCreate}
          onClick={() => setCreateModalOpen(true)}
        >
          {t('overlay.create')}
        </Button>
      </div>

      {!canCreate && (
        <div className="mb-4 p-3 bg-amber-50 rounded text-amber-700">
          {t('overlay.limitReached', { count: limits.maxSimultaneousOverlays })}
        </div>
      )}

      {overlays.length === 0 ? (
        <Empty description={t('overlay.empty')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overlays.map(overlay => (
            <Card key={overlay.id} hoverable>
              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <Text strong className="text-lg">{overlay.name}</Text>
                  <Tag color={overlay.is_visible ? 'green' : 'red'}>
                    {overlay.is_visible ? t('overlay.visible') : t('overlay.hidden')}
                  </Tag>
                </div>
                <Text type="secondary">{overlay.template_id}</Text>
              </div>

              <div className="mb-3 text-sm text-gray-500">
                {overlay.width}x{overlay.height} | {overlay.component_type}
              </div>

              <div className="mb-3 text-xs text-blue-500 bg-blue-50 p-2 rounded">
                {t('overlay.buyLinkEnabled')}
              </div>

              <Space direction="vertical" className="w-full">
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => copyOverlayUrl(overlay)}
                  className="w-full"
                >
                  {t('overlay.copyUrl')}
                </Button>
                <Space>
                  <Button icon={<EyeOutlined />} size="small">{t('overlay.preview')}</Button>
                  <Button icon={<SettingOutlined />} size="small">{t('overlay.config')}</Button>
                </Space>
              </Space>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={t('overlay.createOverlay')}
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label={t('overlay.name')} rules={[{ required: true }]}>
            <Input placeholder={t('overlay.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="templateId" label={t('overlay.template')} rules={[{ required: true }]}>
            <Select placeholder={t('overlay.selectTemplate')}>
              {templates.map(t => (
                <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="width" label={t('overlay.width')} initialValue={1920}>
            <InputNumber min={200} max={3840} className="w-full" />
          </Form.Item>
          <Form.Item name="height" label={t('overlay.height')} initialValue={120}>
            <InputNumber min={40} max={2160} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
