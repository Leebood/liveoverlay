// src/app/(dashboard)/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Upload, Avatar, message, Divider, Typography, Space, Spin } from 'antd';
import { UploadOutlined, UserOutlined, ShopOutlined, SaveOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useStore } from '@/hooks/useStore';
import { useI18n } from '@/i18n';
import type { UploadFile } from 'antd';

const { Title, Text } = Typography;

const CURRENCIES = [
  { value: 'CNY', label: 'CNY - ¥', labelZh: '人民币 (¥)' },
  { value: 'USD', label: 'USD - $', labelZh: '美元 ($)' },
  { value: 'EUR', label: 'EUR - €', labelZh: '欧元 (€)' },
  { value: 'GBP', label: 'GBP - £', labelZh: '英镑 (£)' },
  { value: 'JPY', label: 'JPY - ¥', labelZh: '日元 (¥)' },
  { value: 'KRW', label: 'KRW - ₩', labelZh: '韩元 (₩)' },
  { value: 'HKD', label: 'HKD - HK$', labelZh: '港币 (HK$)' },
  { value: 'TWD', label: 'TWD - NT$', labelZh: '新台币 (NT$)' },
  { value: 'SGD', label: 'SGD - S$', labelZh: '新加坡元 (S$)' },
  { value: 'AUD', label: 'AUD - A$', labelZh: '澳元 (A$)' },
  { value: 'CAD', label: 'CAD - C$', labelZh: '加元 (C$)' },
  { value: 'THB', label: 'THB - ฿', labelZh: '泰铢 (฿)' },
  { value: 'MYR', label: 'MYR - RM', labelZh: '马来西亚林吉特 (RM)' },
  { value: 'VND', label: 'VND - ₫', labelZh: '越南盾 (₫)' },
  { value: 'PHP', label: 'PHP - ₱', labelZh: '菲律宾比索 (₱)' },
  { value: 'IDR', label: 'IDR - Rp', labelZh: '印尼盾 (Rp)' },
  { value: 'INR', label: 'INR - ₹', labelZh: '印度卢比 (₹)' },
  { value: 'RUB', label: 'RUB - ₽', labelZh: '俄罗斯卢布 (₽)' },
  { value: 'BRL', label: 'BRL - R$', labelZh: '巴西雷亚尔 (R$)' },
  { value: 'MXN', label: 'MXN - Mex$', labelZh: '墨西哥比索 (Mex$)' },
  { value: 'AED', label: 'AED - د.إ', labelZh: '阿联酋迪拉姆 (د.إ)' },
  { value: 'SAR', label: 'SAR - ﷼', labelZh: '沙特里亚尔 (﷼)' },
  { value: 'TRY', label: 'TRY - ₺', labelZh: '土耳其里拉 (₺)' },
  { value: 'PLN', label: 'PLN - zł', labelZh: '波兰兹罗提 (zł)' },
  { value: 'SEK', label: 'SEK - kr', labelZh: '瑞典克朗 (kr)' },
  { value: 'CHF', label: 'CHF - CHF', labelZh: '瑞士法郎 (CHF)' },
  { value: 'NZD', label: 'NZD - NZ$', labelZh: '新西兰元 (NZ$)' },
  { value: 'ZAR', label: 'ZAR - R', labelZh: '南非兰特 (R)' },
];

export default function SettingsPage() {
  const { t } = useI18n();
  const { data: session, update: updateSession } = useSession();
  const { storeId, storeName, loading: storeLoading, refreshStore } = useStore();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const locale = typeof window !== 'undefined' ? localStorage.getItem('liveoverlay-locale') || 'zh' : 'zh';

  useEffect(() => {
    if (storeId) {
      fetch(`/api/products?storeId=${storeId}`).then(() => {});
      // Load store settings
      fetch(`/api/settings?storeId=${storeId}`).then(r => r.json()).then(data => {
        if (data.settings) {
          form.setFieldsValue({
            storeName: data.settings.storeName || storeName,
            currency: data.settings.currency || 'CNY',
            brandLogo: data.settings.brandLogo,
          });
          if (data.settings.brandLogo) {
            setLogoUrl(data.settings.brandLogo);
          }
        }
      }).catch(() => {});
    }
  }, [storeId, storeName, form]);

  const handleLogoUpload = (file: File) => {
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    return false; // prevent auto upload
  };

  const handleSave = async (values: Record<string, unknown>) => {
    setSaving(true);
    try {
      let brandLogoUrl = logoUrl;

      // Upload logo file if changed
      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);
        formData.append('storeId', storeId || '');
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          brandLogoUrl = uploadData.url;
        }
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          storeName: values.storeName,
          currency: values.currency,
          brandLogo: brandLogoUrl,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success(t('settings.saved'));
        await refreshStore();
      } else {
        message.error(data.error || t('common.operationFailed'));
      }
    } catch {
      message.error(t('common.networkError'));
    } finally {
      setSaving(false);
    }
  };

  if (storeLoading) return <div className="p-6 text-center"><Spin /></div>;

  return (
    <div className="max-w-2xl">
      <Title level={3} className="!mb-1">{t('settings.title')}</Title>
      <Text type="secondary" className="block mb-6">{t('settings.subtitle')}</Text>

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <UserOutlined />
          <Text strong>{t('settings.accountInfo')}</Text>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <div>{t('settings.email')}：{session?.user?.email}</div>
          <div>{t('settings.name')}：{session?.user?.name}</div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <ShopOutlined />
          <Text strong>{t('settings.storeSettings')}</Text>
        </div>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="storeName" label={t('settings.storeName')} rules={[{ required: true }]}>
            <Input placeholder={t('settings.storeNamePlaceholder')} />
          </Form.Item>

          <Form.Item name="brandLogo" label={t('settings.brandLogo')}>
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <Avatar src={logoUrl} size={64} shape="square" />
              ) : (
                <Avatar size={64} shape="square" className="bg-gray-100 flex items-center justify-center">
                  <ShopOutlined style={{ fontSize: 28, color: '#999' }} />
                </Avatar>
              )}
              <Upload
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                showUploadList={false}
                beforeUpload={handleLogoUpload}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>{t('settings.uploadLogo')}</Button>
              </Upload>
              {logoUrl && (
                <Button type="link" danger onClick={() => { setLogoUrl(null); setLogoFile(null); }}>
                  {t('settings.removeLogo')}
                </Button>
              )}
            </div>
          </Form.Item>

          <Form.Item name="currency" label={t('settings.currency')} rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="label" placeholder={t('settings.selectCurrency')}>
              {CURRENCIES.map(c => (
                <Select.Option key={c.value} value={c.value} label={locale === 'zh' ? c.labelZh : c.label}>
                  {locale === 'zh' ? c.labelZh : c.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Divider />
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
              {t('settings.save')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
