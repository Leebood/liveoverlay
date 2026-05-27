'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button, Typography, Space, Row, Col, Card } from 'antd';
import {
  PlayCircleOutlined,
  ThunderboltOutlined,
  LayoutOutlined,
  FacebookOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useI18n } from '@/i18n';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const { Title, Paragraph, Text } = Typography;

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, locale } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isLoggedIn = status === 'authenticated';

  const features = [
    {
      icon: <LayoutOutlined style={{ fontSize: 36, color: '#1677FF' }} />,
      title: t('landing.features.template.title'),
      desc: t('landing.features.template.desc'),
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 36, color: '#FF4D4F' }} />,
      title: t('landing.features.realtime.title'),
      desc: t('landing.features.realtime.desc'),
    },
    {
      icon: <PlayCircleOutlined style={{ fontSize: 36, color: '#52C41A' }} />,
      title: t('landing.features.obs.title'),
      desc: t('landing.features.obs.desc'),
    },
    {
      icon: <FacebookOutlined style={{ fontSize: 36, color: '#1677FF' }} />,
      title: t('landing.features.facebook.title'),
      desc: t('landing.features.facebook.desc'),
    },
  ];

  const steps = [
    t('landing.steps.1'),
    t('landing.steps.2'),
    t('landing.steps.3'),
    t('landing.steps.4'),
    t('landing.steps.5'),
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 48px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PlayCircleOutlined style={{ fontSize: 28, color: '#1677FF' }} />
          <Text strong style={{ fontSize: 20 }}>LiveOverlay</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LanguageSwitcher />
          {isLoggedIn ? (
            <Button type="primary" onClick={() => router.push('/dashboard')}>
              {t('landing.hero.ctaDashboard')}
            </Button>
          ) : (
            <>
              <Button onClick={() => router.push('/login')}>{t('login.submit')}</Button>
              <Button type="primary" onClick={() => router.push('/register')}>
                {t('register.submit')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div
        style={{
          textAlign: 'center',
          padding: '80px 48px 60px',
          background: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 50%, #fff7e6 100%)',
        }}
      >
        <Title level={1} style={{ marginBottom: 16, fontSize: 42 }}>
          LiveOverlay
        </Title>
        <Paragraph
          style={{ fontSize: 18, color: '#666', maxWidth: 640, margin: '0 auto 32px' }}
        >
          {t('landing.hero.subtitle')}
        </Paragraph>
        <Space size="middle">
          {isLoggedIn ? (
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={() => router.push('/dashboard')}
            >
              {t('landing.hero.ctaDashboard')}
            </Button>
          ) : (
            <>
              <Button
                type="primary"
                size="large"
                icon={<RocketOutlined />}
                onClick={() => router.push('/register')}
              >
                {t('landing.hero.ctaStart')}
              </Button>
              <Button size="large" onClick={() => router.push('/pricing')}>
                {t('landing.hero.pricing')}
              </Button>
            </>
          )}
        </Space>
      </div>

      {/* Features */}
      <div style={{ padding: '60px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
          {t('landing.features.title')}
        </Title>
        <Row gutter={[24, 24]}>
          {features.map((feature, idx) => (
            <Col xs={24} sm={12} key={idx}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'center', padding: '20px 16px' }}
              >
                <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph style={{ color: '#888' }}>{feature.desc}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Steps */}
      <div
        style={{
          padding: '60px 48px',
          background: '#fafafa',
          textAlign: 'center',
        }}
      >
        <Title level={2} style={{ marginBottom: 48 }}>
          {t('landing.steps.title')}
        </Title>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            maxWidth: 800,
            margin: '0 auto',
          }}
        >
          {steps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#1677FF',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              <Text style={{ fontSize: 16 }}>{step}</Text>
              {idx < steps.length - 1 && (
                <div
                  style={{
                    width: 40,
                    height: 2,
                    background: '#d9d9d9',
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          textAlign: 'center',
          padding: '80px 48px',
          background: 'linear-gradient(135deg, #1677FF 0%, #4096ff 100%)',
          color: '#fff',
        }}
      >
        <Title level={2} style={{ color: '#fff', marginBottom: 12 }}>
          {t('landing.cta.title')}
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 32 }}>
          {t('landing.cta.subtitle')}
        </Paragraph>
        <Button
          size="large"
          ghost
          style={{ color: '#fff', borderColor: '#fff' }}
          onClick={() => router.push(isLoggedIn ? '/dashboard' : '/register')}
        >
          {t('landing.cta.button')}
        </Button>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '24px 48px',
          color: '#999',
          fontSize: 13,
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <a href="/privacy" style={{ color: '#666', marginRight: 24 }}>{t('landing.privacyPolicy') || (locale === 'zh' ? '隐私政策' : 'Privacy Policy')}</a>
          <a href="mailto:leo.tikboost@gmail.com" style={{ color: '#666' }}>{t('landing.supportEmail') || (locale === 'zh' ? '技术支持' : 'Support')}: leo.tikboost@gmail.com</a>
        </div>
        © {new Date().getFullYear()} LiveOverlay. {locale === 'zh' ? '保留所有权利' : 'All rights reserved'}.
      </div>
    </div>
  );
}
