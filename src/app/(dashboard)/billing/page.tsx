// src/app/(dashboard)/billing/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Button, Typography, Tag, Space, Divider, Alert, Radio, message, Modal, Spin, Result } from 'antd';
import { CheckOutlined, CrownOutlined, ExperimentOutlined, WechatOutlined, AlipayCircleOutlined, QrcodeOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { getPlanLimits } from '@/lib/plan-limits';
import PlanBadge from '@/components/common/PlanBadge';
import type { PlanType } from '@/types/plan';

const { Title, Paragraph, Text } = Typography;

const PLAN_ORDER: PlanType[] = ['free', 'starter', 'pro', 'business'];

type PaymentMethod = 'wechat' | 'alipay';

export default function BillingPage() {
  const { data: session, update: updateSession } = useSession();
  const planType = ((session?.user as Record<string, unknown>)?.planType || 'free') as PlanType;
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wechat');

  // 支付二维码弹窗
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [currentTradeOrderId, setCurrentTradeOrderId] = useState('');
  const [currentChannel, setCurrentChannel] = useState<PaymentMethod>('wechat');
  const [currentAmount, setCurrentAmount] = useState('');
  const [payStatus, setPayStatus] = useState<'scanning' | 'paid' | 'expired'>('scanning');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 轮询订单状态
  useEffect(() => {
    if (payModalVisible && currentTradeOrderId && payStatus === 'scanning') {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/billing/order-status?tradeOrderId=${currentTradeOrderId}`);
          const data = await res.json();
          if (data.status === 'paid') {
            setPayStatus('paid');
            if (pollingRef.current) clearInterval(pollingRef.current);
            message.success('支付成功！计划已升级');
            await updateSession();
            setTimeout(() => {
              setPayModalVisible(false);
              window.location.reload();
            }, 2000);
          }
        } catch {
          // 轮询失败继续
        }
      }, 3000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [payModalVisible, currentTradeOrderId, payStatus, updateSession]);

  const handleUpgrade = async (targetPlan: PlanType) => {
    setCheckoutLoading(targetPlan);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: targetPlan, billingPeriod, paymentMethod }),
      });
      const data = await res.json();

      if (data.demo) {
        // 演示模式：计划已直接切换
        message.success(`已切换到 ${getPlanLimits(targetPlan).displayName} 计划（演示模式）`);
        await updateSession();
        window.location.reload();
      } else if (data.qrCodeUrl) {
        // 真实支付模式：显示二维码
        setQrCodeUrl(data.qrCodeUrl);
        setCurrentTradeOrderId(data.tradeOrderId);
        setCurrentChannel(data.channel);
        setCurrentAmount(data.amount);
        setPayStatus('scanning');
        setPayModalVisible(true);
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        message.error(data.error || '创建支付订单失败');
      }
    } catch {
      message.error('网络错误');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleCancel = async () => {
    Modal.confirm({
      title: '确认取消订阅？',
      content: '取消后将降级为免费版，已支付的费用不予退还。',
      okText: '确认取消',
      cancelText: '再想想',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await fetch('/api/billing/cancel', { method: 'POST' });
          const data = await res.json();
          if (data.success) {
            message.success('订阅已取消');
            await updateSession();
            window.location.reload();
          } else {
            message.error(data.error || '取消失败');
          }
        } catch {
          message.error('网络错误');
        }
      },
    });
  };

  const getPrice = (plan: PlanType) => {
    const limits = getPlanLimits(plan);
    return billingPeriod === 'yearly'
      ? Math.round(limits.yearlyPriceCNY / 12)
      : limits.priceCNY;
  };

  const getYearlyTotal = (plan: PlanType) => {
    return getPlanLimits(plan).yearlyPriceCNY;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={3} className="!mb-1">订阅管理</Title>
          <Paragraph type="secondary">
            当前计划：<PlanBadge planType={planType} />
          </Paragraph>
        </div>
        <Space wrap>
          <Radio.Group value={billingPeriod} onChange={e => setBillingPeriod(e.target.value)} optionType="button" size="small">
            <Radio.Button value="monthly">月付</Radio.Button>
            <Radio.Button value="yearly">年付（省20%）</Radio.Button>
          </Radio.Group>
          {planType !== 'free' && (
            <Button danger onClick={handleCancel}>取消订阅</Button>
          )}
        </Space>
      </div>

      {/* Payment Method Selection */}
      <Card className="mb-6" size="small">
        <div className="flex items-center gap-4 flex-wrap">
          <Text strong>选择支付方式：</Text>
          <Radio.Group
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="large"
          >
            <Radio.Button value="wechat">
              <WechatOutlined style={{ color: '#07C160', fontSize: 20, marginRight: 8, verticalAlign: 'middle' }} />
              微信支付
            </Radio.Button>
            <Radio.Button value="alipay">
              <AlipayCircleOutlined style={{ color: '#1677FF', fontSize: 20, marginRight: 8, verticalAlign: 'middle' }} />
              支付宝
            </Radio.Button>
          </Radio.Group>

          <div className="flex gap-3 ml-auto">
            <Tag color="green">
              <WechatOutlined /> 微信扫码支付
            </Tag>
            <Tag color="blue">
              <AlipayCircleOutlined /> 支付宝扫码支付
            </Tag>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {PLAN_ORDER.map(plan => {
          const limits = getPlanLimits(plan);
          const isCurrent = plan === planType;
          const price = getPrice(plan);
          const yearlyTotal = getYearlyTotal(plan);

          return (
            <Col xs={24} sm={12} md={6} key={plan}>
              <Card className={`h-full ${isCurrent ? 'ring-2 ring-indigo-500' : ''} ${plan === 'pro' ? 'shadow-lg' : ''}`}>
                {plan === 'pro' && (
                  <Tag color="purple" className="absolute -top-3 left-1/2 -translate-x-1/2">最受欢迎</Tag>
                )}
                <div className="text-center mb-4">
                  <PlanBadge planType={plan} />
                  <Title level={2} className="!mt-2 !mb-0">
                    {limits.price === 0 ? '免费' : `¥${price}`}
                  </Title>
                  {limits.price > 0 && (
                    <>
                      <Text type="secondary">/月 {billingPeriod === 'yearly' ? '(年付)' : ''}</Text>
                      {billingPeriod === 'yearly' && (
                        <div className="text-xs text-gray-400 mt-1">年付总价 ¥{yearlyTotal}</div>
                      )}
                    </>
                  )}
                </div>

                <Divider />

                <div className="space-y-2 mb-6">
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxProducts === -1 ? '无限' : limits.maxProducts}个商品</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />每商品{limits.maxImagesPerProduct}张图片</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxTemplates === -1 ? '全部' : limits.maxTemplates}套模板</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.allowedComponents.length}种组件</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxStores}个店铺</div>
                  {limits.allowLiveControl && <div><CheckOutlined className="text-green-500 mr-2" />实时控制</div>}
                  {limits.allowCustomColors && <div><CheckOutlined className="text-green-500 mr-2" />自定义颜色</div>}
                  {limits.allowBrandLogo && <div><CheckOutlined className="text-green-500 mr-2" />品牌Logo</div>}
                  {limits.showWatermark && <div><Tag color="orange">含水印</Tag></div>}
                </div>

                {isCurrent ? (
                  <Button block disabled>当前计划</Button>
                ) : (
                  <Button
                    block
                    type={PLAN_ORDER.indexOf(plan) > PLAN_ORDER.indexOf(planType) ? 'primary' : 'default'}
                    icon={<CrownOutlined />}
                    loading={checkoutLoading === plan}
                    onClick={() => handleUpgrade(plan)}
                  >
                    {PLAN_ORDER.indexOf(plan) > PLAN_ORDER.indexOf(planType) ? '升级' : '切换'}
                  </Button>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 支付二维码弹窗 */}
      <Modal
        open={payModalVisible}
        onCancel={() => {
          setPayModalVisible(false);
          if (pollingRef.current) clearInterval(pollingRef.current);
        }}
        footer={null}
        width={420}
        centered
        title={null}
        closable={payStatus !== 'paid'}
      >
        {payStatus === 'paid' ? (
          <Result
            status="success"
            title="支付成功！"
            subTitle="计划已升级，页面即将刷新..."
            icon={<CheckOutlined style={{ color: '#52C41A' }} />}
          />
        ) : (
          <div className="text-center py-4">
            <div className="mb-4">
              <Title level={4}>
                {currentChannel === 'wechat' ? (
                  <><WechatOutlined style={{ color: '#07C160', marginRight: 8 }} />微信支付</>
                ) : (
                  <><AlipayCircleOutlined style={{ color: '#1677FF', marginRight: 8 }} />支付宝</>
                )}
              </Title>
              <Text type="secondary">请使用{currentChannel === 'wechat' ? '微信' : '支付宝'}扫描二维码完成支付</Text>
            </div>

            {/* 二维码区域 */}
            <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg mb-4">
              {qrCodeUrl ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                  alt="支付二维码"
                  width={200}
                  height={200}
                />
              ) : (
                <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-50">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} />} />
                </div>
              )}
            </div>

            <div className="mb-2">
              <Text strong className="text-2xl">¥{currentAmount}</Text>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <LoadingOutlined spin />
              <span>等待扫码支付...</span>
            </div>

            <div className="mt-4 text-gray-400 text-xs">
              支付完成后将自动检测，请勿关闭此窗口
            </div>
          </div>
        )}
      </Modal>

      {/* Payment Security Notice */}
      <div className="mt-8 text-center text-gray-400 text-sm space-y-1">
        <div>
          <WechatOutlined style={{ color: '#07C160' }} /> 微信支付
          <span className="mx-2">|</span>
          <AlipayCircleOutlined style={{ color: '#1677FF' }} /> 支付宝
        </div>
        <div>支付安全由虎皮椒提供保障，支持 HTTPS 加密传输</div>
        <div>年付计划可节省 20% 费用，随时可取消订阅</div>
      </div>
    </div>
  );
}
