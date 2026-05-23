// src/app/(dashboard)/products/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Upload, Tag, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { getPlanLimits } from '@/lib/plan-limits';
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

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const storeId = 'default'; // TODO: get from context

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?storeId=${storeId}`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch {
      message.error('加载商品失败');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
        message.success(editingProduct ? '商品已更新' : '商品已创建');
        setModalOpen(false);
        setEditingProduct(null);
        form.resetFields();
        fetchProducts();
      } else {
        message.error(data.error || '操作失败');
      }
    } catch {
      message.error('网络错误');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        message.success('商品已删除');
        fetchProducts();
      }
    } catch {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '商品名称',
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
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => <span className="text-red-500 font-semibold">${parseFloat(price).toFixed(2)}</span>,
    },
    {
      title: '原价',
      dataIndex: 'original_price',
      key: 'original_price',
      render: (price: string | null) => price ? <span className="line-through text-gray-400">${parseFloat(price).toFixed(2)}</span> : '-',
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
      render: (tag: string | null) => tag ? <Tag color="blue">{tag}</Tag> : '-',
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean) => <Tag color={active ? 'green' : 'red'}>{active ? '上架' : '下架'}</Tag>,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => {
            setEditingProduct(record);
            form.setFieldsValue({
              name: record.name,
              price: parseFloat(record.price),
              originalPrice: record.original_price ? parseFloat(record.original_price) : undefined,
              description: record.description,
              tag: record.tag,
              buyUrl: record.buy_url,
            });
            setModalOpen(true);
          }} />
          <Popconfirm title="确定删除此商品？" onConfirm={() => handleDelete(record.id)}>
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
        <h2 className="text-xl font-semibold m-0">商品管理</h2>
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
            添加商品
          </Button>
        </Space>
      </div>

      {!canAddProduct && (
        <div className="mb-4 p-3 bg-amber-50 rounded text-amber-700">
          商品数量已达上限 ({limits.maxProducts})，请升级计划以添加更多商品
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
        title={editingProduct ? '编辑商品' : '添加商品'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingProduct(null); }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="商品名称" rules={[{ required: true, message: '请输入商品名称' }]}>
            <Input placeholder="输入商品名称" />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
            <InputNumber min={0} step={0.01} className="w-full" prefix="$" />
          </Form.Item>
          <Form.Item name="originalPrice" label="原价">
            <InputNumber min={0} step={0.01} className="w-full" prefix="$" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="tag" label="标签">
            <Input placeholder="如: 新品, 热卖, 限时" />
          </Form.Item>
          <Form.Item name="buyUrl" label="购买链接">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="images" label="商品图片" valuePropName="fileList" getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e?.fileList;
          }}>
            <Upload listType="picture-card" maxCount={limits.maxImagesPerProduct} beforeUpload={() => false}>
              <div><PlusOutlined /> 上传</div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
