'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Upload, Tag, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { getPlanLimits } from '@/lib/plan-limits';
import { useStore } from '@/hooks/useStore';
import { useI18n } from '@/i18n';
import type { PlanType } from '@/types/plan';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  original_price: string | null;
  currency: string;
  images: string;
  tag: string | null;
  category: string | null;
  buy_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export default function ProductsPage() {
  const { data: session } = useSession();
  const planType = ((session?.user as Record<string, unknown>)?.planType || 'free') as PlanType;
  const limits = getPlanLimits(planType);
  const { storeId, loading: storeLoading } = useStore();
  const { t } = useI18n();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const fetchProducts = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products?storeId=${storeId}`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch {
      message.error(t('products.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [storeId, t]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (storeLoading) return <div className="p-6 text-gray-500">{t('common.loading')}</div>;
  if (!storeId) return <div className="p-6 text-gray-500">{t('products.noStore')}</div>;

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const url = editingProduct ? `/api/products?id=${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, storeId }),
      });

      const data = await res.json();
      if (res.ok) {
        message.success(editingProduct ? t('products.updated') : t('products.created'));
        setModalOpen(false);
        setEditingProduct(null);
        form.resetFields();
        fetchProducts();
      } else {
        message.error(data.error || t('common.operationFailed'));
      }
    } catch {
      message.error(t('common.networkError'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        message.success(t('products.deleted'));
        fetchProducts();
      }
    } catch {
      message.error(t('products.deleteFailed'));
    }
  };

  const columns = [
    {
      title: t('products.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Product) => (
        <div className="flex items-center gap-2">
          {JSON.parse(record.images || '[]')[0] && (
            <img src={JSON.parse(record.images)[0]} alt="" className="w-8 h-8 rounded object-cover" />
          )}
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: t('products.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => <span className="text-red-500 font-semibold">¥{parseFloat(price).toFixed(2)}</span>,
    },
    {
      title: t('products.originalPrice'),
      dataIndex: 'original_price',
      key: 'original_price',
      render: (price: string | null) => price ? <span className="line-through text-gray-400">¥{parseFloat(price).toFixed(2)}</span> : '-',
    },
    {
      title: t('products.tag'),
      dataIndex: 'tag',
      key: 'tag',
      render: (tag: string | null) => tag ? <Tag color="blue">{tag}</Tag> : '-',
    },
    {
      title: t('products.status'),
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => <Tag color={active ? 'green' : 'red'}>{active ? t('products.active') : t('products.inactive')}</Tag>,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => {
            setEditingProduct(record);
            form.setFieldsValue({
              name: record.name,
              price: parseFloat(record.price),
              originalPrice: record.original_price ? parseFloat(record.original_price) : 0,
              description: record.description || '',
              tag: record.tag || '',
              category: record.category || '',
            });
            setModalOpen(true);
          }} />
          <Popconfirm title={t('products.confirmDelete')} onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const canAddProduct = limits.maxProducts === -1 || products.length < limits.maxProducts;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold m-0">{t('products.title')}</h2>
        <Space>
          <span className="text-gray-500">
            {products.length} / {limits.maxProducts === -1 ? '∞' : limits.maxProducts}
          </span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={!canAddProduct}
            onClick={() => {
              setEditingProduct(null);
              form.resetFields();
              setModalOpen(true);
            }}
          >
            {t('products.addProduct')}
          </Button>
        </Space>
      </div>

      {!canAddProduct && (
        <div className="mb-4 p-3 bg-amber-50 rounded text-amber-700">
          {t('products.limitReached', { count: String(limits.maxProducts) })}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProduct ? t('products.editProduct') : t('products.addProduct')}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingProduct(null); }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label={t('products.name')} rules={[{ required: true, message: t('products.nameRequired') }]}>
            <Input placeholder={t('products.namePlaceholder')} />
          </Form.Item>
          <Form.Item name="price" label={t('products.price')} rules={[{ required: true, message: t('products.priceRequired') }]}>
            <InputNumber min={0} step={0.01} className="w-full" prefix="¥" />
          </Form.Item>
          <Form.Item name="originalPrice" label={t('products.originalPrice')}>
            <InputNumber min={0} step={0.01} className="w-full" prefix="¥" />
          </Form.Item>
          <Form.Item name="description" label={t('products.description')}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="tag" label={t('products.tag')}>
            <Input placeholder={t('products.tagPlaceholder')} />
          </Form.Item>
          <Form.Item name="category" label={t('products.category')}>
            <Input placeholder={t('products.categoryPlaceholder')} />
          </Form.Item>
          <Form.Item name="images" label={t('products.images')} valuePropName="fileList" getValueFromEvent={(e: unknown) => {
            if (Array.isArray(e)) return e;
            return (e as { fileList?: unknown })?.fileList;
          }}>
            <Upload listType="picture-card" maxCount={limits.maxImagesPerProduct} beforeUpload={() => false}>
              <div><PlusOutlined /> {t('products.upload')}</div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
