'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Button, Typography, Tag, Space, Divider, Radio, message, Modal, Spin, Result, Tooltip } from 'antd';
import { CheckOutlined, CrownOutlined, WechatOutlined, AlipayCircleOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { getPlanLimits } from '@/lib/plan-limits';
import PlanBadge from '@/components/common/PlanBadge';
import { useI18n } from '@/i18n';
import type { PlanType } from '@/types/plan';

const { Title, Paragraph, Text } = Typography;

const PLAN_ORDER: PlanType[] = ['free', 'starter', 'pro', 'business'];

type PaymentMethod = 'wechat' | 'alipay';

interface PlanFeature {
  key: string;
  free: string | boolean;
  starter: string | boolean;
  pro: string | boolean;
  business: string | boolean;
}

export default function BillingPage() {
  const { t } = useI18n();
  const { data: session, update: updateSession } = useSession();
  const planType = ((session?.user as Record<string, unknown>)?.planType || 'free') as PlanType;
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wechat');

  const [payModalVisible, setPayModalVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [currentTradeOrderId, setCurrentTradeOrderId] = useState('');
  const [currentChannel, setCurrentChannel] = useState<PaymentMethod>('wechat');
  const [currentAmount, setCurrentAmount] = useState('');
  const [payStatus, setPayStatus] = useState<'scanning' | 'paid' | 'expired'>('scanning');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (payModalVisible && currentTradeOrderId && payStatus === 'scanning') {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/billing/order-status?tradeOrderId=${currentTradeOrderId}`);
          const data = await res.json();
          if (data.status === 'paid') {
            setPayStatus('paid');
            if (pollingRef.current) clearInterval(pollingRef.current);
            message.success(t('billing.paySuccess'));
            await updateSession();
            setTimeout(() => { setPayModalVisible(false); window.location.reload(); }, 2000);
          }
        } catch { /* polling failed, continue */ }
      }, 3000);
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [payModalVisible, currentTradeOrderId, payStatus, updateSession, t]);

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
        message.success(`${t('billing.switchedTo')} ${getPlanLimits(targetPlan).displayName}${t('billing.demoMode')}`);
        await updateSession();
        window.location.reload();
      } else if (data.qrCodeUrl) {
        setQrCodeUrl(data.qrCodeUrl);
        setCurrentTradeOrderId(data.tradeOrderId);
        setCurrentChannel(data.channel);
        setCurrentAmount(data.amount);
        setPayStatus('scanning');
        setPayModalVisible(true);
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        message.error(data.error || t('billing.createOrderFailed'));
      }
    } catch {
      message.error(t('billing.networkError'));
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleCancel = async () => {
    Modal.confirm({
      title: t('billing.cancelConfirmTitle'),
      content: t('billing.cancelConfirmContent'),
      okText: t('billing.confirmCancel'),
      cancelText: t('billing.thinkAgain'),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await fetch('/api/billing/cancel', { method: 'POST' });
          const data = await res.json();
          if (data.success) {
            message.success(t('billing.cancelled'));
            await updateSession();
            window.location.reload();
          } else {
            message.error(data.error || t('billing.cancelFailed'));
          }
        } catch {
          message.error(t('billing.networkError'));
        }
      },
    });
  };

  const getPrice = (plan: PlanType) => {
    const limits = getPlanLimits(plan);
    return billingPeriod === 'yearly' ? Math.round(limits.yearlyPriceCNY / 12) : limits.priceCNY;
  };
  const getYearlyTotal = (plan: PlanType) => getPlanLimits(plan).yearlyPriceCNY;

  // Plan features comparison table data
  const planFeatures: PlanFeature[] = [
    { key: 'products', free: '3', starter: '20', pro: t('common.unlimited'), business: t('common.unlimited') },
    { key: 'images', free: '1', starter: '3', pro: '5', business: '10' },
    { key: 'templates', free: '1', starter: '3', pro: t('billing.all'), business: t('billing.all') },
    { key: 'overlays', free: '1', starter: '1', pro: '3', business: t('common.unlimited') },
    { key: 'stores', free: '1', starter: '1', pro: '3', business: '10' },
    { key: 'csvImport', free: false, starter: true, pro: true, business: true },
    { key: 'liveControl', free: false, starter: true, pro: true, business: true },
    { key: 'livePreview', free: false, starter: true, pro: true, business: true },
    { key: 'customColors', free: false, starter: true, pro: true, business: true },
    { key: 'customFonts', free: false, starter: false, pro: true, business: true },
    { key: 'brandLogo', free: false, starter: false, pro: true, business: true },
    { key: 'clickTracking', free: false, starter: false, pro: true, business: true },
    { key: 'advancedAnalytics', free: false, starter: false, pro: false, business: true },
    { key: 'apiAccess', free: false, starter: false, pro: false, business: true },
    { key: 'whiteLabel', free: false, starter: false, pro: false, business: true },
    { key: 'teamMembers', free: '1', starter: '1', pro: '2', business: '5' },
    { key: 'watermark', free: true, starter: false, pro: false, business: false },
  ];

  const renderFeatureValue = (value: string | boolean) => {
    if (value === true) return <CheckOutlined className="text-green-500" />;
    if (value === false) return <CloseOutlined className="text-gray-300" />;
    return <span>{value}</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={3} className="!mb-1">{t('billing.title')}</Title>
          <Paragraph type="secondary">{t('billing.currentPlan')}：<PlanBadge planType={planType} /></Paragraph>
        </div>
        <Space wrap>
          <Radio.Group value={billingPeriod} onChange={e => setBillingPeriod(e.target.value)} optionType="button" size="small">
            <Radio.Button value="monthly">{t('billing.monthly')}</Radio.Button>
            <Radio.Button value="yearly">{t('billing.yearly')}</Radio.Button>
          </Radio.Group>
          {planType !== 'free' && <Button danger onClick={handleCancel}>{t('billing.cancelSub')}</Button>}
        </Space>
      </div>

      <Card className="mb-6" size="small">
        <div className="flex items-center gap-4 flex-wrap">
          <Text strong>{t('billing.selectPayment')}</Text>
          <Radio.Group value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} optionType="button" buttonStyle="solid" size="large">
            <Radio.Button value="wechat">
              <WechatOutlined style={{ color: '#07C160', fontSize: 20, marginRight: 8, verticalAlign: 'middle' }} />{t('billing.wechatPay')}
            </Radio.Button>
            <Radio.Button value="alipay">
              <AlipayCircleOutlined style={{ color: '#1677FF', fontSize: 20, marginRight: 8, verticalAlign: 'middle' }} />{t('billing.alipay')}
            </Radio.Button>
          </Radio.Group>
        </div>
      </Card>

      {/* Plan Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        {PLAN_ORDER.map(plan => {
          const limits = getPlanLimits(plan);
          const isCurrent = plan === planType;
          const price = getPrice(plan);
          const yearlyTotal = getYearlyTotal(plan);
          return (
            <Col xs={24} sm={12} md={6} key={plan}>
              <Card className={`h-full ${isCurrent ? 'ring-2 ring-indigo-500' : ''} ${plan === 'pro' ? 'shadow-lg' : ''}`}>
                {plan === 'pro' && <Tag color="purple" className="absolute -top-3 left-1/2 -translate-x-1/2">{t('billing.popular')}</Tag>}
                <div className="text-center mb-4">
                  <PlanBadge planType={plan} />
                  <Title level={2} className="!mt-2 !mb-0">{limits.price === 0 ? t('billing.free') : `¥${price}`}</Title>
                  {limits.price > 0 && (
                    <>
                      <Text type="secondary">/{t('billing.month')} {billingPeriod === 'yearly' ? `(${t('billing.yearlyPay')})` : ''}</Text>
                      {billingPeriod === 'yearly' && <div className="text-xs text-gray-400 mt-1">{t('billing.yearlyTotal')} ¥{yearlyTotal}</div>}
                    </>
                  )}
                </div>
                <Divider />
                <div className="space-y-2 mb-6">
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxProducts === -1 ? t('billing.unlimited') : limits.maxProducts}{t('billing.productsUnit')}</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxTemplates === -1 ? t('billing.all') : limits.maxTemplates}{t('billing.templatesUnit')}</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxSimultaneousOverlays === -1 ? t('billing.unlimited') : limits.maxSimultaneousOverlays}{t('billing.overlaysUnit')}</div>
                  <div><CheckOutlined className="text-green-500 mr-2" />{limits.maxStores}{t('billing.storesUnit')}</div>
                  {limits.allowLiveControl && <div><CheckOutlined className="text-green-500 mr-2" />{t('billing.liveControl')}</div>}
                  {!limits.showWatermark && <div><CheckOutlined className="text-green-500 mr-2" />{t('billing.noWatermark')}</div>}
                  {limits.showWatermark && <div><Tag color="orange">{t('billing.hasWatermark')}</Tag></div>}
                </div>
                {isCurrent ? (
                  <Button block disabled>{t('billing.currentPlanBtn')}</Button>
                ) : (
                  <Button block type={PLAN_ORDER.indexOf(plan) > PLAN_ORDER.indexOf(planType) ? 'primary' : 'default'} icon={<CrownOutlined />} loading={checkoutLoading === plan} onClick={() => handleUpgrade(plan)}>
                    {PLAN_ORDER.indexOf(plan) > PLAN_ORDER.indexOf(planType) ? t('billing.upgrade') : t('billing.switchPlan')}
                  </Button>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Feature Comparison Table */}
      <Card>
        <Title level={4} className="!mb-4">{t('billing.featureComparison')}</Title>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-3 font-medium text-gray-600">{t('billing.feature')}</th>
                {PLAN_ORDER.map(plan => (
                  <th key={plan} className="text-center py-3 px-3 font-medium">
                    <PlanBadge planType={plan} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planFeatures.map((feat, idx) => (
                <tr key={feat.key} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-2.5 px-3 text-gray-700">{t(`billing.feature_${feat.key}`)}</td>
                  <td className="text-center py-2.5 px-3">{renderFeatureValue(feat.free)}</td>
                  <td className="text-center py-2.5 px-3">{renderFeatureValue(feat.starter)}</td>
                  <td className="text-center py-2.5 px-3">{renderFeatureValue(feat.pro)}</td>
                  <td className="text-center py-2.5 px-3">{renderFeatureValue(feat.business)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={payModalVisible} onCancel={() => { setPayModalVisible(false); if (pollingRef.current) clearInterval(pollingRef.current); }} footer={null} width={420} centered title={null} closable={payStatus !== 'paid'}>
        {payStatus === 'paid' ? (
          <Result status="success" title={t('billing.paySuccess')} subTitle={t('billing.planUpgraded')} icon={<CheckOutlined style={{ color: '#52C41A' }} />} />
        ) : (
          <div className="text-center py-4">
            <div className="mb-4">
              <Title level={4}>
                {currentChannel === 'wechat' ? <><WechatOutlined style={{ color: '#07C160', marginRight: 8 }} />{t('billing.wechatPay')}</> : <><AlipayCircleOutlined style={{ color: '#1677FF', marginRight: 8 }} />{t('billing.alipay')}</>}
              </Title>
              <Text type="secondary">{t('billing.scanToPay', { channel: currentChannel === 'wechat' ? t('billing.wechat') : t('billing.alipayName') })}</Text>
            </div>
            <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg mb-4">
              {qrCodeUrl ? <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`} alt={t('billing.qrCode')} width={200} height={200} /> : (
                <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-50"><Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} />} /></div>
              )}
            </div>
            <div className="mb-2"><Text strong className="text-2xl">¥{currentAmount}</Text></div>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm"><LoadingOutlined spin /><span>{t('billing.waitingScan')}</span></div>
            <div className="mt-4 text-gray-400 text-xs">{t('billing.autoDetect')}</div>
          </div>
        )}
      </Modal>

      <div className="mt-8 text-center text-gray-400 text-sm space-y-1">
        <div><WechatOutlined style={{ color: '#07C160' }} /> {t('billing.wechatPay')}<span className="mx-2">|</span><AlipayCircleOutlined style={{ color: '#1677FF' }} /> {t('billing.alipay')}</div>
        <div>{t('billing.securityNotice')}</div>
        <div>{t('billing.yearlySave')}</div>
      </div>
    </div>
  );
}
