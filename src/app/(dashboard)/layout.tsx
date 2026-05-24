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
} from '@ant-design/icons';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import PlanBadge from '@/components/common/PlanBadge';
import type { PlanType } from '@/types/plan';

const { Sider, Header, Content } = Layout;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '控制台' },
  { key: '/products', icon: <ShoppingOutlined />, label: '商品管理' },
  { key: '/templates', icon: <AppstoreOutlined />, label: '模板选择' },
  { key: '/overlay', icon: <DesktopOutlined />, label: 'Overlay配置' },
  { key: '/live', icon: <VideoCameraOutlined />, label: '直播中控' },
  { key: '/analytics', icon: <BarChartOutlined />, label: '数据分析' },
  { key: '/settings', icon: <SettingOutlined />, label: '设置' },
  { key: '/billing', icon: <CreditCardOutlined />, label: '订阅管理' },
  { key: '/guide', icon: <BookOutlined />, label: '使用说明' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const planType = ((session?.user as unknown as Record<string, unknown>)?.planType || 'free') as PlanType;

  const handleMenuClick = (info: { key: string }) => {
    router.push(info.key);
  };

  const userMenuItems = [
    {
      key: 'billing',
      icon: <CreditCardOutlined />,
      label: '订阅管理',
      onClick: () => router.push('/billing'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => signOut({ callbackUrl: '/login' }),
    },
  ];

  // Find the active menu key from pathname
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
      </Sider>
      <Layout>
        <Header className="!bg-white !px-6 flex items-center justify-between shadow-sm">
          <div />
          <div className="flex items-center gap-4">
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
