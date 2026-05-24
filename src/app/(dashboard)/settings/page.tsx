// src/app/(dashboard)/settings/page.tsx
'use client';

import { Card, Form, Input, Button, Typography, message, ColorPicker, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function SettingsPage() {
  const [form] = Form.useForm();

  const handleSave = async (values: Record<string, unknown>) => {
    message.success('设置已保存');
  };

  return (
    <div>
      <div className="mb-6">
        <Title level={3} className="!mb-1">店铺设置</Title>
        <Paragraph type="secondary">管理你的店铺信息和品牌设置</Paragraph>
      </div>

      <Card className="max-w-2xl">
        <Form form={form} layout="vertical" onFinish={handleSave}
          initialValues={{
            name: '',
            currency: 'USD',
            language: 'en',
            brandPrimaryColor: '#6366f1',
          }}>
          <Form.Item name="name" label="店铺名称" rules={[{ required: true }]}>
            <Input placeholder="输入店铺名称" />
          </Form.Item>
          <Form.Item name="currency" label="货币">
            <Select options={[
              { value: 'USD', label: 'USD - 美元' },
              { value: 'EUR', label: 'EUR - 欧元' },
              { value: 'GBP', label: 'GBP - 英镑' },
              { value: 'CNY', label: 'CNY - 人民币' },
            ]} />
          </Form.Item>
          <Form.Item name="language" label="语言">
            <Select options={[
              { value: 'en', label: 'English' },
              { value: 'zh', label: '中文' },
              { value: 'ja', label: '日本語' },
            ]} />
          </Form.Item>
          <Form.Item name="brandPrimaryColor" label="品牌主色">
            <ColorPicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
