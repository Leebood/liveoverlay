// src/app/(dashboard)/overlay/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Typography, Space, Empty, Tag, Modal, Form, Select, Input, InputNumber, message, Popconfirm, Switch, Spin } from 'antd';
import { PlusOutlined, CopyOutlined, EyeOutlined, SettingOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getPlanLimits } from '@/lib/plan-limits';
import { useStore } from '@/hooks/useStore';
import { useI18n } from '@/i18n';
import type { PlanType } from '@/types/plan';

const { Title, Paragraph, Text } = Typography;

interface TemplateInfo {
  id: string;
  name: string;
  nameZh: string;
  componentType: string;
  category: string;
}

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

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
  product_ids: string | null;
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewOverlay, setPreviewOverlay] = useState<Overlay | null>(null);
  const [editingOverlay, setEditingOverlay] = useState<Overlay | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const locale = typeof window !== 'undefined' ? localStorage.getItem('liveoverlay-locale') || 'zh' : 'zh';

  const loadOverlays = useCallback(async () => {
    if (!storeId) return;
    try {
      const res = await fetch(`/api/overlay?storeId=${storeId}`);
      const data = await res.json();
      if (data.overlays) setOverlays(data.overlays);
    } catch { /* ignore */ }
  }, [storeId]);

  useEffect(() => {
    if (!storeId) return;
    Promise.all([
      fetch(`/api/overlay?storeId=${storeId}`).then(r => r.json()),
      fetch('/api/templates').then(r => r.json()),
      fetch(`/api/products?storeId=${storeId}`).then(r => r.json()),
    ]).then(([overlayData, templateData, productData]) => {
      if (overlayData.overlays) setOverlays(overlayData.overlays);
      if (templateData.templates) {
        setTemplates(templateData.templates.map((tp: { id: string; name: string; componentType: string; category: string }) => ({
          id: tp.id,
          name: tp.name,
          nameZh: t(`template.${tp.id}`) || tp.name,
          componentType: tp.componentType,
          category: tp.category,
        })));
      }
      if (productData.products) {
        setProducts(productData.products.map((p: { id: string; name: string; price: number; image_url: string | null }) => ({
          id: p.id, name: p.name, price: p.price, image_url: p.image_url,
        })));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  const handleCreate = async (values: Record<string, unknown>) => {
    setSubmitting(true);
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
        await loadOverlays();
      } else {
        message.error(data.error || t('overlay.createFailed'));
      }
    } catch {
      message.error(t('common.networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (values: Record<string, unknown>) => {
    if (!editingOverlay) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/overlay/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          overlayId: editingOverlay.id,
          name: values.name,
          width: values.width,
          height: values.height,
          productIds: values.productIds,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success(t('overlay.updated'));
        setEditModalOpen(false);
        setEditingOverlay(null);
        editForm.resetFields();
        await loadOverlays();
      } else {
        message.error(data.error || t('overlay.updateFailed'));
      }
    } catch {
      message.error(t('common.networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (overlayId: string) => {
    try {
      const res = await fetch('/api/overlay/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overlayId, is_active: false }),
      });
      if (res.ok) {
        message.success(t('overlay.deleted'));
        await loadOverlays();
      } else {
        const data = await res.json();
        message.error(data.error || t('overlay.deleteFailed'));
      }
    } catch {
      message.error(t('common.networkError'));
    }
  };

  const handleToggleVisible = async (overlay: Overlay, visible: boolean) => {
    try {
      const res = await fetch('/api/overlay/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overlayId: overlay.id, isVisible: visible }),
      });
      if (res.ok) {
        message.success(visible ? t('overlay.shown') : t('overlay.hiddenDone'));
        await loadOverlays();
      }
    } catch {
      message.error(t('common.networkError'));
    }
  };

  const openEdit = (overlay: Overlay) => {
    setEditingOverlay(overlay);
    const productIds = overlay.product_ids ? JSON.parse(overlay.product_ids) : [];
    editForm.setFieldsValue({
      name: overlay.name,
      width: overlay.width,
      height: overlay.height,
      productIds,
    });
    setEditModalOpen(true);
  };

  const openPreview = (overlay: Overlay) => {
    setPreviewOverlay(overlay);
    setPreviewModalOpen(true);
  };

  const copyOverlayUrl = (overlay: Overlay) => {
    const url = `${window.location.origin}/overlay/${storeId}/${overlay.id}`;
    navigator.clipboard.writeText(url);
    message.success(t('overlay.urlCopied'));
  };

  const getTemplateName = (templateId: string) => {
    const tpl = templates.find(t => t.id === templateId);
    if (!tpl) return templateId;
    return locale === 'zh' ? tpl.nameZh : tpl.name;
  };

  if (storeLoading) return <div className="p-6 text-center"><Spin /></div>;
  if (!storeId) return <div className="p-6 text-gray-500">{t('common.noStore')}</div>;

  const canCreate = limits.maxSimultaneousOverlays === -1 || overlays.length < limits.maxSimultaneousOverlays;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">{t('overlay.title')}</Title>
          <Paragraph type="secondary">{t('overlay.description')}</Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />} disabled={!canCreate} onClick={() => setCreateModalOpen(true)}>
          {t('overlay.create')}
        </Button>
      </div>

      {!canCreate && (
        <div className="mb-4 p-3 bg-amber-50 rounded text-amber-700">
          {t('overlay.limitReached', { count: String(limits.maxSimultaneousOverlays) })}
        </div>
      )}

      {overlays.length === 0 ? (
        <Empty description={t('overlay.empty')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overlays.map(overlay => (
            <Card key={overlay.id} hoverable className="relative">
              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <Text strong className="text-lg">{overlay.name}</Text>
                  <Space size={4}>
                    <Tag color={overlay.is_visible ? 'green' : 'red'}>
                      {overlay.is_visible ? t('overlay.visible') : t('overlay.hidden')}
                    </Tag>
                    <Switch size="small" checked={overlay.is_visible} onChange={(v) => handleToggleVisible(overlay, v)} />
                  </Space>
                </div>
                <Text type="secondary">{getTemplateName(overlay.template_id)}</Text>
              </div>

              <div className="mb-3 text-sm text-gray-500">
                {overlay.width}x{overlay.height} | {overlay.component_type}
              </div>

              <Space direction="vertical" className="w-full">
                <Button icon={<CopyOutlined />} onClick={() => copyOverlayUrl(overlay)} className="w-full">
                  {t('overlay.copyUrl')}
                </Button>
                <Space className="w-full justify-between">
                  <Button icon={<EyeOutlined />} size="small" onClick={() => openPreview(overlay)}>{t('overlay.preview')}</Button>
                  <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(overlay)}>{t('overlay.edit')}</Button>
                  <Popconfirm title={t('overlay.confirmDelete')} onConfirm={() => handleDelete(overlay.id)} okText={t('common.confirm')} cancelText={t('common.cancel')}>
                    <Button icon={<DeleteOutlined />} size="small" danger>{t('overlay.delete')}</Button>
                  </Popconfirm>
                </Space>
              </Space>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal title={t('overlay.createOverlay')} open={createModalOpen} onCancel={() => setCreateModalOpen(false)} onOk={() => form.submit()} confirmLoading={submitting}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label={t('overlay.name')} rules={[{ required: true }]}>
            <Input placeholder={t('overlay.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="templateId" label={t('overlay.template')} rules={[{ required: true }]}>
            <Select placeholder={t('overlay.selectTemplate')} showSearch optionFilterProp="label">
              {templates.map(tp => (
                <Select.Option key={tp.id} value={tp.id} label={locale === 'zh' ? tp.nameZh : tp.name}>
                  {locale === 'zh' ? tp.nameZh : tp.name}
                </Select.Option>
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

      {/* Edit Modal */}
      <Modal title={t('overlay.editOverlay')} open={editModalOpen} onCancel={() => { setEditModalOpen(false); setEditingOverlay(null); }} onOk={() => editForm.submit()} confirmLoading={submitting}>
        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
          <Form.Item name="name" label={t('overlay.name')} rules={[{ required: true }]}>
            <Input placeholder={t('overlay.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="width" label={t('overlay.width')}>
            <InputNumber min={200} max={3840} className="w-full" />
          </Form.Item>
          <Form.Item name="height" label={t('overlay.height')}>
            <InputNumber min={40} max={2160} className="w-full" />
          </Form.Item>
          <Form.Item name="productIds" label={t('overlay.selectProducts')}>
            <Select mode="multiple" placeholder={t('overlay.selectProductsPlaceholder')}>
              {products.map(p => (
                <Select.Option key={p.id} value={p.id}>{p.name} - ¥{p.price}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal title={previewOverlay?.name || ''} open={previewModalOpen} onCancel={() => { setPreviewModalOpen(false); setPreviewOverlay(null); }} footer={null} width={800}>
        {previewOverlay && storeId && (
          <div className="border rounded-lg overflow-hidden" style={{ width: '100%', aspectRatio: `${previewOverlay.width}/${previewOverlay.height}`, maxHeight: 400 }}>
            <iframe
              src={`${window.location.origin}/overlay/${storeId}/${previewOverlay.id}`}
              style={{ width: previewOverlay.width, height: previewOverlay.height, transform: `scale(${Math.min(760 / previewOverlay.width, 400 / previewOverlay.height)})`, transformOrigin: 'top left', border: 'none' }}
              title={previewOverlay.name}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
