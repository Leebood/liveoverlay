'use client';

import { Card, Form, Input, Button, Typography, message, ColorPicker, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useI18n } from '@/i18n';

const { Title, Paragraph } = Typography;

export default function SettingsPage() {
  const { t } = useI18n();
  const [form] = Form.useForm();

  const handleSave = async (values: Record<string, unknown>) => {
    message.success(t('settings.saved'));
  };

  return (
    <div>
      <div className="mb-6">
        <Title level={3} className="!mb-1">{t('settings.title')}</Title>
        <Paragraph type="secondary">{t('settings.subtitle')}</Paragraph>
      </div>

      <Card className="max-w-2xl">
        <Form form={form} layout="vertical" onFinish={handleSave}
          initialValues={{
            name: '',
            currency: 'CNY',
            language: 'zh',
            brandPrimaryColor: '#6366f1',
          }}>
          <Form.Item name="name" label={t('settings.storeName')} rules={[{ required: true }]}>
            <Input placeholder={t('settings.storeNamePlaceholder')} />
          </Form.Item>
          <Form.Item name="currency" label={t('settings.currency')}>
            <Select options={[
              { value: 'CNY', label: 'CNY - 人民币' },
              { value: 'USD', label: 'USD - 美元' },
              { value: 'EUR', label: 'EUR - 欧元' },
              { value: 'GBP', label: 'GBP - 英镑' },
            ]} />
          </Form.Item>
          <Form.Item name="language" label={t('settings.language')}>
            <Select options={[
              { value: 'zh', label: '中文' },
              { value: 'en', label: 'English' },
            ]} />
          </Form.Item>
          <Form.Item name="brandPrimaryColor" label={t('settings.brandColor')}>
            <ColorPicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {t('settings.save')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
