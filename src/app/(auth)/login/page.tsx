// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { GoogleOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const { Title, Paragraph } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useI18n();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (result?.ok) {
        router.push('/dashboard');
      } else {
        message.error(result?.error || t('auth.loginFailed'));
      }
    } catch {
      message.error(t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      {/* Language switcher top-right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">LiveOverlay</Title>
          <Paragraph type="secondary">{t('auth.loginSubtitle')}</Paragraph>
        </div>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: t('auth.emailRequired') }]}>
            <Input prefix={<MailOutlined />} placeholder={t('auth.email')} size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: t('auth.passwordRequired') }]}>
            <Input.Password prefix={<LockOutlined />} placeholder={t('auth.password')} size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              {t('auth.login')}
            </Button>
          </Form.Item>
        </Form>

        <Divider>{t('auth.or')}</Divider>

        <Button block size="large" icon={<GoogleOutlined />} onClick={() => signIn('google')}>
          {t('auth.googleLogin')}
        </Button>

        <div className="text-center mt-4">
          <Paragraph type="secondary">
            {t('auth.noAccount')} <Link href="/register">{t('auth.registerNow')}</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}
