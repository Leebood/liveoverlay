// src/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      // In production, create user via API
      message.success('注册成功！请登录');
      router.push('/login');
    } catch {
      message.error('注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">创建账号</Title>
          <Paragraph type="secondary">开始使用LiveOverlay</Paragraph>
        </div>

        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input prefix={<UserOutlined />} placeholder="名称" size="large" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}>
            <Input prefix={<MailOutlined />} placeholder="邮箱" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, min: 6, message: '密码至少6位' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              注册
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Paragraph type="secondary">
            已有账号？ <Link href="/login">立即登录</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}
