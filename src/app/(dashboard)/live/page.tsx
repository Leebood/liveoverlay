'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Typography, Space, Row, Col, List, Tag, Input, InputNumber, Modal, message } from 'antd';
import {
  VideoCameraOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  StarOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useStore } from '@/hooks/useStore';
import FeatureGate from '@/components/common/FeatureGate';
import { useI18n } from '@/i18n';
import type { PlanType } from '@/types/plan';

const { Title, Paragraph, Text } = Typography;

interface Product {
  id: string;
  name: string;
  price: string;
  tag: string | null;
  images: string;
}

export default function LivePage() {
  const { data: session } = useSession();
  const planType = ((session?.user as Record<string, unknown>)?.planType || 'free') as PlanType;
  const { storeId, loading: storeLoading } = useStore();
  const { t } = useI18n();
  const [isLive, setIsLive] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [countdownModal, setCountdownModal] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(300);
  const [countdownText, setCountdownText] = useState('');

  useEffect(() => {
    setCountdownText(t('live.defaultCountdownText'));
  }, [t]);

  useEffect(() => {
    if (!storeId) return;
    fetch(`/api/products?storeId=${storeId}`)
      .then(r => r.json())
      .then(data => { if (data.products) setProducts(data.products); })
      .catch(() => {});
  }, [storeId]);

  const sendControl = useCallback(async (action: string, payload: Record<string, unknown> = {}) => {
    try {
      const res = await fetch('/api/overlay/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, action, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) message.error(data.error || t('live.controlFailed'));
    } catch {
      message.error(t('common.networkError'));
    }
  }, [storeId, t]);

  const handleStartLive = async () => {
    try {
      const res = await fetch('/api/live/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, action: 'start', title: 'Facebook Live' }),
      });
      if (res.ok) {
        setIsLive(true);
        message.success(t('live.started'));
      }
    } catch {
      message.error(t('live.startFailed'));
    }
  };

  const handleEndLive = async () => {
    try {
      await sendControl('toggle_visibility', { visible: false });
      setIsLive(false);
      message.info(t('live.ended'));
    } catch {
      message.error(t('live.endFailed'));
    }
  };

  const handleHighlight = (productId: string) => {
    sendControl('highlight_product', { productId });
  };

  const handleUnhighlight = () => {
    sendControl('unhighlight_product');
  };

  const handleToggleOverlay = (visible: boolean) => {
    sendControl('toggle_visibility', { visible });
  };

  const handleShowCountdown = () => {
    sendControl('show_countdown', { seconds: countdownSeconds, text: countdownText });
    setCountdownModal(false);
  };

  const handleFlashDeal = (productId: string, price: number) => {
    sendControl('flash_deal', { productId, price, duration: 60 });
  };

  if (storeLoading) return <div className="p-6 text-gray-500">{t('common.loading')}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">{t('live.title')}</Title>
          <Paragraph type="secondary">{t('live.subtitle')}</Paragraph>
        </div>
        <Space>
          {isLive ? (
            <Button danger icon={<StopOutlined />} onClick={handleEndLive}>
              {t('live.endLive')}
            </Button>
          ) : (
            <Button type="primary" icon={<VideoCameraOutlined />} onClick={handleStartLive}>
              {t('live.startLive')}
            </Button>
          )}
        </Space>
      </div>

      {isLive && (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Card title={t('live.productList')} extra={
              <Space>
                <Button size="small" icon={<EyeOutlined />} onClick={() => handleToggleOverlay(true)}>{t('live.show')}</Button>
                <Button size="small" icon={<EyeInvisibleOutlined />} onClick={() => handleToggleOverlay(false)}>{t('live.hide')}</Button>
              </Space>
            }>
              <List
                dataSource={products}
                renderItem={(product) => (
                  <List.Item
                    actions={[
                      <Button size="small" icon={<StarOutlined />} onClick={() => handleHighlight(product.id)} key="highlight">{t('live.featured')}</Button>,
                      <FeatureGate feature="allowLiveControl" key="flash">
                        <Button size="small" icon={<ThunderboltOutlined />} onClick={() => {
                          Modal.confirm({
                            title: t('live.setFlashPrice'),
                            content: <InputNumber min={0} step={0.01} prefix="¥" defaultValue={parseFloat(product.price) * 0.8} id="flash-price" />,
                            onOk: () => {
                              const priceInput = document.querySelector('#flash-price input') as HTMLInputElement;
                              if (priceInput) handleFlashDeal(product.id, parseFloat(priceInput.value));
                            },
                          });
                        }}>{t('live.flashDeal')}</Button>
                      </FeatureGate>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<Space>{product.name} {product.tag && <Tag color="blue">{product.tag}</Tag>}</Space>}
                      description={<Text className="text-red-500 font-semibold">¥{parseFloat(product.price).toFixed(2)}</Text>}
                    />
                  </List.Item>
                )}
              />
              <div className="mt-4">
                <Button onClick={handleUnhighlight}>{t('live.cancelFeatured')}</Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Space direction="vertical" className="w-full" size={16}>
              <FeatureGate feature="allowLiveControl">
                <Card title={t('live.quickActions')} size="small">
                  <Space direction="vertical" className="w-full">
                    <Button block icon={<ClockCircleOutlined />} onClick={() => setCountdownModal(true)}>
                      {t('live.countdown')}
                    </Button>
                    <Button block onClick={() => sendControl('hide_countdown')}>
                      {t('live.closeCountdown')}
                    </Button>
                  </Space>
                </Card>
              </FeatureGate>

              <Card title={t('live.liveStatus')} size="small">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Text type="secondary">{t('live.status')}</Text>
                    <Tag color="green">{t('live.streaming')}</Tag>
                  </div>
                  <div className="flex justify-between">
                    <Text type="secondary">{t('live.productCount')}</Text>
                    <Text>{products.length}</Text>
                  </div>
                </div>
              </Card>
            </Space>
          </Col>
        </Row>
      )}

      {!isLive && (
        <div className="text-center py-20">
          <VideoCameraOutlined className="text-6xl text-gray-300 mb-4" />
          <Title level={4} type="secondary">{t('live.readyToStart')}</Title>
          <Paragraph type="secondary">{t('live.clickToStart')}</Paragraph>
        </div>
      )}

      <Modal
        title={t('live.setCountdown')}
        open={countdownModal}
        onCancel={() => setCountdownModal(false)}
        onOk={handleShowCountdown}
      >
        <div className="space-y-4">
          <div>
            <Text>{t('live.countdownText')}</Text>
            <Input value={countdownText} onChange={e => setCountdownText(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Text>{t('live.countdownSeconds')}</Text>
            <InputNumber value={countdownSeconds} onChange={v => setCountdownSeconds(v || 300)} min={10} max={86400} className="w-full mt-1" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
