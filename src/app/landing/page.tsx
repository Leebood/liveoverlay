// src/app/landing/page.tsx
'use client';

import { Button, Typography, Row, Col, Space } from 'antd';
import {
  VideoCameraOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Title level={1} className="!text-white !text-5xl !mb-4">
            LiveOverlay
          </Title>
          <Paragraph className="!text-white/80 text-xl mb-8 max-w-2xl mx-auto">
            让你的Facebook直播间看起来像淘宝直播间——OBS浏览器源一键嵌入，实时展示滚动商品条、主推商品卡、促销角标。
          </Paragraph>
          <Space size="large">
            <Link href="/register">
              <Button type="primary" size="large" className="!bg-white !text-indigo-600 !font-semibold h-12 px-8">
                免费开始
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="large" ghost className="!text-white !border-white/50 h-12 px-8">
                查看定价
              </Button>
            </Link>
          </Space>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <Title level={2} className="text-center mb-12">核心功能</Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AppstoreOutlined className="text-2xl text-indigo-600" />
                </div>
                <Title level={4}>模板系统</Title>
                <Paragraph type="secondary">10+精美模板，涵盖滚动条、商品卡、角标、倒计时等组件</Paragraph>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ThunderboltOutlined className="text-2xl text-indigo-600" />
                </div>
                <Title level={4}>实时控制</Title>
                <Paragraph type="secondary">直播中实时切换主推商品、显示隐藏、倒计时、闪购等</Paragraph>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <VideoCameraOutlined className="text-2xl text-indigo-600" />
                </div>
                <Title level={4}>OBS一键嵌入</Title>
                <Paragraph type="secondary">浏览器源加载，零配置即插即用，极轻量渲染引擎</Paragraph>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GlobalOutlined className="text-2xl text-indigo-600" />
                </div>
                <Title level={4}>Facebook直播</Title>
                <Paragraph type="secondary">专为Facebook直播优化，完美适配各类直播场景</Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Title level={2} className="mb-12">使用流程</Title>
          <Row gutter={[24, 24]}>
            {['注册账号', '录入商品', '选择模板', 'OBS添加浏览器源', '开播'].map((step, i) => (
              <Col xs={12} md={4} key={i}>
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  {i + 1}
                </div>
                <Paragraph className="font-medium">{step}</Paragraph>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-600 text-white text-center">
        <Title level={2} className="!text-white !mb-4">准备好提升你的直播体验了吗？</Title>
        <Paragraph className="!text-white/80 mb-8">免费开始，无需信用卡</Paragraph>
        <Link href="/register">
          <Button type="primary" size="large" className="!bg-white !text-indigo-600 !font-semibold h-12 px-8">
            立即开始
          </Button>
        </Link>
      </section>
    </div>
  );
}
