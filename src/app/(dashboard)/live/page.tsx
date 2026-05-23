// src/app/(dashboard)/live/page.tsx
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
  const [isLive, setIsLive] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [countdownModal, setCountdownModal] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(300);
  const [countdownText, setCountdownText] = useState('限时优惠');

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
      if (!res.ok) message.error(data.error || '控制失败');
    } catch {
      message.error('网络错误');
    }
  }, [storeId]);

  const handleStartLive = async () => {
    try {
      const res = await fetch('/api/live/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, action: 'start', title: 'Facebook Live' }),
      });
      if (res.ok) {
        setIsLive(true);
        message.success('直播已开始');
      }
    } catch {
      message.error('开始直播失败');
    }
  };

  const handleEndLive = async () => {
    try {
      await sendControl('toggle_visibility', { visible: false });
      setIsLive(false);
      message.info('直播已结束');
    } catch {
      message.error('结束直播失败');
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1">直播中控台</Title>
          <Paragraph type="secondary">实时控制你的直播Overlay</Paragraph>
        </div>
        <Space>
          {isLive ? (
            <Button danger icon={<StopOutlined />} onClick={handleEndLive}>
              结束直播
            </Button>
          ) : (
            <Button type="primary" icon={<VideoCameraOutlined />} onClick={handleStartLive}>
              开始直播
            </Button>
          )}
        </Space>
      </div>

      {isLive && (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Card title="商品列表" extra={
              <Space>
                <Button size="small" icon={<EyeOutlined />} onClick={() => handleToggleOverlay(true)}>显示</Button>
                <Button size="small" icon={<EyeInvisibleOutlined />} onClick={() => handleToggleOverlay(false)}>隐藏</Button>
              </Space>
            }>
              <List
                dataSource={products}
                renderItem={(product) => (
                  <List.Item
                    actions={[
                      <Button size="small" icon={<StarOutlined />} onClick={() => handleHighlight(product.id)} key="highlight">主推</Button>,
                      <FeatureGate feature="allowLiveControl" key="flash">
                        <Button size="small" icon={<ThunderboltOutlined />} onClick={() => {
                          Modal.confirm({
                            title: '设置闪购价',
                            content: <InputNumber min={0} step={0.01} prefix="$" defaultValue={parseFloat(product.price) * 0.8} id="flash-price" />,
                            onOk: () => {
                              const priceInput = document.querySelector('#flash-price input') as HTMLInputElement;
                              if (priceInput) handleFlashDeal(product.id, parseFloat(priceInput.value));
                            },
                          });
                        }}>闪购</Button>
                      </FeatureGate>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<Space>{product.name} {product.tag && <Tag color="blue">{product.tag}</Tag>}</Space>}
                      description={<Text className="text-red-500 font-semibold">${parseFloat(product.price).toFixed(2)}</Text>}
                    />
                  </List.Item>
                )}
              />
              <div className="mt-4">
                <Button onClick={handleUnhighlight}>取消主推</Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Space direction="vertical" className="w-full" size={16}>
              <FeatureGate feature="allowLiveControl">
                <Card title="快捷操作" size="small">
                  <Space direction="vertical" className="w-full">
                    <Button block icon={<ClockCircleOutlined />} onClick={() => setCountdownModal(true)}>
                      倒计时
                    </Button>
                    <Button block onClick={() => sendControl('hide_countdown')}>
                      关闭倒计时
                    </Button>
                  </Space>
                </Card>
              </FeatureGate>

              <Card title="直播状态" size="small">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Text type="secondary">状态</Text>
                    <Tag color="green">直播中</Tag>
                  </div>
                  <div className="flex justify-between">
                    <Text type="secondary">商品数</Text>
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
          <Title level={4} type="secondary">准备开始直播</Title>
          <Paragraph type="secondary">点击"开始直播"按钮，进入直播中控模式</Paragraph>
        </div>
      )}

      <Modal
        title="设置倒计时"
        open={countdownModal}
        onCancel={() => setCountdownModal(false)}
        onOk={handleShowCountdown}
      >
        <div className="space-y-4">
          <div>
            <Text>倒计时文字</Text>
            <Input value={countdownText} onChange={e => setCountdownText(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Text>倒计时秒数</Text>
            <InputNumber value={countdownSeconds} onChange={v => setCountdownSeconds(v || 300)} min={10} max={86400} className="w-full mt-1" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
