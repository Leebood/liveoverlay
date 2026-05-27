// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { GoogleOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      console.log('[Login] signIn result:', JSON.stringify(result));
      if (result?.ok) {
        router.push('/dashboard');
      } else {
        const errorMsg = result?.error || '登录失败，请检查邮箱和密码';
        console.error('[Login] signIn error:', errorMsg);
        message.error(errorMsg);
      }
    } catch {
      message.error('登录出错');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">LiveOverlay</Title>
          <Paragraph type="secondary">让你的Facebook直播间像淘宝直播间</Paragraph>
        </div>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}>
            <Input prefix={<MailOutlined />} placeholder="邮箱" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider>或</Divider>

        <Button block size="large" icon={<GoogleOutlined />} onClick={() => signIn('google')}>
          使用Google登录
        </Button>

        <div className="text-center mt-4">
          <Paragraph type="secondary">
            还没有账号？ <Link href="/register">立即注册</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}
