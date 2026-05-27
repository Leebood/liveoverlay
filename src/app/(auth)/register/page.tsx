// src/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const { Title, Paragraph } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useI18n();

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        message.success(t('auth.registerSuccess'));
        router.push('/login');
      } else {
        message.error(data.error || t('auth.registerFailed'));
      }
    } catch {
      message.error(t('auth.networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">{t('auth.createAccount')}</Title>
          <Paragraph type="secondary">{t('auth.startUsing')}</Paragraph>
        </div>

        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item name="name" rules={[{ required: true, message: t('auth.nameRequired') }]}>
            <Input prefix={<UserOutlined />} placeholder={t('auth.name')} size="large" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: t('auth.emailRequired') }]}>
            <Input prefix={<MailOutlined />} placeholder={t('auth.email')} size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, min: 6, message: t('auth.passwordMin') }]}>
            <Input.Password prefix={<LockOutlined />} placeholder={t('auth.password')} size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              {t('auth.register')}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Paragraph type="secondary">
            {t('auth.hasAccount')} <Link href="/login">{t('auth.loginNow')}</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}
