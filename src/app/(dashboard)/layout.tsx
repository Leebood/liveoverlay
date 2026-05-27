// src/app/(dashboard)/layout.tsx
'use client';

import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  DesktopOutlined,
  VideoCameraOutlined,
  BarChartOutlined,
  SettingOutlined,
  CreditCardOutlined,
  UserOutlined,
  LogoutOutlined,
  BookOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import PlanBadge from '@/components/common/PlanBadge';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useI18n } from '@/i18n';
import type { PlanType } from '@/types/plan';

const { Sider, Header, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();

  const planType = ((session?.user as unknown as Record<string, unknown>)?.planType || 'free') as PlanType;

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: t('nav.dashboard') },
    { key: '/products', icon: <ShoppingOutlined />, label: t('nav.products') },
    { key: '/templates', icon: <AppstoreOutlined />, label: t('nav.templates') },
    { key: '/overlay', icon: <DesktopOutlined />, label: t('nav.overlay') },
    { key: '/live', icon: <VideoCameraOutlined />, label: t('nav.live') },
    { key: '/analytics', icon: <BarChartOutlined />, label: t('nav.analytics') },
    { key: '/settings', icon: <SettingOutlined />, label: t('nav.settings') },
    { key: '/billing', icon: <CreditCardOutlined />, label: t('nav.billing') },
    { key: '/guide', icon: <BookOutlined />, label: t('nav.guide') },
    { key: '/test-plan', icon: <ExperimentOutlined />, label: t('nav.testPlan') },
  ];

  const handleMenuClick = (info: { key: string }) => {
    router.push(info.key);
  };

  const userMenuItems = [
    {
      key: 'billing',
      icon: <CreditCardOutlined />,
      label: t('nav.billing'),
      onClick: () => router.push('/billing'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('common.logout'),
      onClick: () => signOut({ callbackUrl: '/login' }),
    },
  ];

  const activeKey = '/' + (pathname.split('/').filter(Boolean).pop() || '');

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={220}
        className="!bg-gray-900"
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          <h1 className="text-white font-bold text-lg m-0">
            {collapsed ? 'LO' : 'LiveOverlay'}
          </h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={handleMenuClick}
          className="!bg-gray-900 border-r-0"
        />
        {/* Language switcher at bottom of sidebar */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center">
          <LanguageSwitcher compact={collapsed} />
        </div>
      </Sider>
      <Layout>
        <Header className="!bg-white !px-6 flex items-center justify-between shadow-sm">
          <div />
          <div className="flex items-center gap-4">
            <LanguageSwitcher compact />
            <PlanBadge planType={planType} />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" className="flex items-center gap-2">
                <Avatar size="small" icon={<UserOutlined />} src={session?.user?.image || undefined} />
                <span>{session?.user?.name || session?.user?.email || 'User'}</span>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg min-h-[calc(100vh-120px)]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
