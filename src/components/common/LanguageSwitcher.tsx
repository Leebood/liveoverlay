'use client';

import { useI18n } from '@/i18n';
import { GlobalOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

const localeLabels: Record<string, string> = {
  zh: '中文',
  en: 'English',
};

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();

  const items: MenuProps['items'] = [
    { key: 'zh', label: '中文' },
    { key: 'en', label: 'English' },
  ];

  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: [locale],
        onClick: ({ key }) => {
          setLocale(key as 'zh' | 'en');
        },
      }}
      placement="bottomRight"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          cursor: 'pointer',
          padding: compact ? '4px 8px' : '4px 12px',
          borderRadius: 6,
          transition: 'background 0.2s',
          fontSize: compact ? 12 : 14,
          color: 'rgba(0,0,0,0.65)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <GlobalOutlined />
        {!compact && <span>{localeLabels[locale]}</span>}
      </div>
    </Dropdown>
  );
}
