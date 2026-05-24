'use client';

import { useState } from 'react';
import { Typography, Steps, Card, Collapse, Tag, Table, Alert, Tabs, Space, Divider } from 'antd';
import {
  ShoppingOutlined,
  DesktopOutlined,
  CopyOutlined,
  VideoCameraOutlined,
  ThunderboltOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  BookOutlined,
  PlayCircleOutlined,
  ExpandOutlined,
  AppstoreOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState('quickstart');

  const tickerPositionData = [
    { key: '1', template: 'basic-ticker', name: '基础滚动条', position: '画面底部', size: '1920 × 120', plan: 'Free', color: 'default' },
    { key: '2', template: 'modern-ticker', name: '现代滚动条', position: '画面底部', size: '1920 × 100', plan: 'Free', color: 'default' },
    { key: '3', template: 'minimal-ticker', name: '极简滚动条', position: '画面底部', size: '1920 × 80', plan: 'Starter', color: 'blue' },
    { key: '4', template: 'minimal-card', name: '极简商品卡', position: '右下角', size: '400 × 300', plan: 'Starter', color: 'blue' },
    { key: '5', template: 'spotlight-card', name: '聚光灯商品卡', position: '画面右侧', size: '500 × 600', plan: 'Pro', color: 'green' },
    { key: '6', template: 'simple-badge', name: '角标', position: '左上/右上角', size: '200 × 80', plan: 'Free', color: 'default' },
    { key: '7', template: 'side-list', name: '侧边商品列表', position: '画面左侧', size: '300 × 600', plan: 'Pro', color: 'green' },
    { key: '8', template: 'top-promo', name: '顶部促销条', position: '画面顶部', size: '1920 × 100', plan: 'Starter', color: 'blue' },
    { key: '9', template: 'countdown-banner', name: '倒计时横幅', position: '画面顶部', size: '1920 × 80', plan: 'Pro', color: 'green' },
    { key: '10', template: 'promo-countdown', name: '促销倒计时卡', position: '右下角', size: '400 × 250', plan: 'Business', color: 'orange' },
  ];

  const tickerColumns = [
    { title: '模板ID', dataIndex: 'template', key: 'template', render: (v: string) => <Text code>{v}</Text> },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '推荐位置', dataIndex: 'position', key: 'position' },
    { title: '尺寸建议', dataIndex: 'size', key: 'size' },
    { title: '最低计划', dataIndex: 'plan', key: 'plan', render: (v: string, record: { color: string }) => <Tag color={record.color}>{v}</Tag> },
  ];

  const planCompareData = [
    { key: '1', feature: '商品数量', free: '3', starter: '30', pro: '100', business: '无限' },
    { key: '2', feature: '可用模板', free: '2', starter: '5', pro: '全部(10)', business: '全部(10)' },
    { key: '3', feature: 'Overlay数量', free: '1', starter: '3', pro: '10', business: '无限' },
    { key: '4', feature: '水印', free: <WarningOutlined style={{ color: '#faad14' }} />, starter: <CheckCircleOutlined style={{ color: '#52c41a' }} />, pro: <CheckCircleOutlined style={{ color: '#52c41a' }} />, business: <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
    { key: '5', feature: '直播控制', free: <WarningOutlined style={{ color: '#faad14' }} />, starter: <WarningOutlined style={{ color: '#faad14' }} />, pro: <CheckCircleOutlined style={{ color: '#52c41a' }} />, business: <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
    { key: '6', feature: '店铺数量', free: '1', starter: '1', pro: '1', business: '5' },
    { key: '7', feature: '优先支持', free: <WarningOutlined style={{ color: '#faad14' }} />, starter: <WarningOutlined style={{ color: '#faad14' }} />, pro: <WarningOutlined style={{ color: '#faad14' }} />, business: <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
  ];

  const planColumns = [
    { title: '功能', dataIndex: 'feature', key: 'feature', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Free', dataIndex: 'free', key: 'free', align: 'center' as const },
    { title: 'Starter', dataIndex: 'starter', key: 'starter', align: 'center' as const },
    { title: 'Pro', dataIndex: 'pro', key: 'pro', align: 'center' as const },
    { title: 'Business', dataIndex: 'business', key: 'business', align: 'center' as const },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Title level={3} className="!mb-1">
          <BookOutlined className="mr-2" />
          使用说明手册
        </Title>
        <Paragraph type="secondary">从零开始，手把手教你使用 LiveOverlay 配合 OBS 进行直播带货</Paragraph>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'quickstart',
            label: <span><ThunderboltOutlined /> 快速上手</span>,
            children: (
              <div>
                <Alert
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                  title="前置准备"
                  description="确保已安装 OBS Studio 27+ 版本，并已在 LiveOverlay 完成注册登录。"
                  className="mb-6"
                />

                <Steps
                  orientation="vertical"
                  size="small"
                  current={-1}
                  items={[
                    {
                      title: '添加商品',
                      content: (
                        <div className="py-2">
                          <Paragraph>进入 <Text strong>商品管理</Text> 页面，点击「添加商品」，填写商品信息：</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Space orientation="vertical" size={4}>
                              <Text><Tag color="red">必填</Tag> 商品名称 — 如「限时特惠连衣裙」</Text>
                              <Text><Tag color="red">必填</Tag> 价格 — 如 199</Text>
                              <Text><Tag color="blue">选填</Tag> 原价 — 如 399，会显示划线价</Text>
                              <Text><Tag color="blue">选填</Tag> 标签 — 如「限时」「新品」「热卖」</Text>
                              <Text><Tag color="blue">选填</Tag> 购买链接 — 商品详情页 URL</Text>
                              <Text><Tag color="blue">选填</Tag> 商品图片 — 上传后会在卡片中展示</Text>
                            </Space>
                          </Card>
                          <Paragraph type="secondary">可添加多个商品，它们会按顺序在 Overlay 中滚动展示。</Paragraph>
                        </div>
                      ),
                      icon: <ShoppingOutlined />,
                    },
                    {
                      title: '选择模板并创建 Overlay',
                      content: (
                        <div className="py-2">
                          <Paragraph>进入 <Text strong>Overlay配置</Text> 页面，点击「创建Overlay」：</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Space orientation="vertical" size={4}>
                              <Text>1. 名称 — 如「主商品滚动条」</Text>
                              <Text>2. 模板 — 选择样式（首次推荐 <Text code>basic-ticker</Text>）</Text>
                              <Text>3. 宽度 — 默认 1920，与 OBS 画布宽度一致</Text>
                              <Text>4. 高度 — 默认 120，滚动条高度</Text>
                            </Space>
                          </Card>
                          <Paragraph type="secondary">点击确定创建，在列表中会生成一条 Overlay 记录。</Paragraph>
                        </div>
                      ),
                      icon: <DesktopOutlined />,
                    },
                    {
                      title: '复制 OBS 链接',
                      content: (
                        <div className="py-2">
                          <Paragraph>在 Overlay 列表中，点击对应卡片的 <Text strong>「复制Overlay URL」</Text> 按钮。</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Text code className="text-xs">https://你的域名/overlay/{'{storeId}'}/{'{overlayId}'}</Text>
                            <Paragraph type="secondary" className="!mb-0 mt-1">此链接为公开端点，无需认证，OBS 可直接加载。</Paragraph>
                          </Card>
                        </div>
                      ),
                      icon: <CopyOutlined />,
                    },
                    {
                      title: '在 OBS 中添加浏览器源',
                      content: (
                        <div className="py-2">
                          <Paragraph>打开 OBS Studio，按以下步骤操作：</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Space orientation="vertical" size={4}>
                              <Text>1. 在「来源」面板，点击 <Text strong>+</Text> 添加新来源</Text>
                              <Text>2. 选择 <Text strong>浏览器</Text>（Browser Source）</Text>
                              <Text>3. 属性窗口中：</Text>
                              <Text className="pl-4">— 名称：如「LiveOverlay 商品条」</Text>
                              <Text className="pl-4">— URL：粘贴刚才复制的 Overlay URL</Text>
                              <Text className="pl-4">— 宽度：<Text code>1920</Text>（与创建时一致）</Text>
                              <Text className="pl-4">— 高度：<Text code>120</Text>（与创建时一致）</Text>
                              <Text className="pl-4">— 勾选「关闭时刷新浏览器源」</Text>
                              <Text>4. 点击「确定」</Text>
                            </Space>
                          </Card>
                        </div>
                      ),
                      icon: <VideoCameraOutlined />,
                    },
                    {
                      title: '调整位置并开始直播',
                      content: (
                        <div className="py-2">
                          <Paragraph>在 OBS 预览区，拖动浏览器源到合适位置：</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Space orientation="vertical" size={4}>
                              <Text>— 滚动条模板 → 放在画面 <Text strong>底部</Text></Text>
                              <Text>— 商品卡模板 → 放在 <Text strong>右下角</Text> 或 <Text strong>左下角</Text></Text>
                              <Text>— 角标模板 → 放在 <Text strong>右上角</Text></Text>
                              <Text>— 倒计时横幅 → 放在画面 <Text strong>顶部</Text></Text>
                            </Space>
                          </Card>
                          <Paragraph type="secondary" className="mt-2">拖动边缘可调整大小，右键浏览器源 → 刷新可手动更新内容。</Paragraph>
                        </div>
                      ),
                      icon: <ExpandOutlined />,
                    },
                    {
                      title: '直播中控（Pro 及以上）',
                      content: (
                        <div className="py-2">
                          <Paragraph>进入 <Text strong>直播中控</Text> 页面，实时控制 Overlay：</Paragraph>
                          <Card size="small" className="mt-2 mb-2 bg-gray-50">
                            <Space orientation="vertical" size={4}>
                              <Text>— <Text strong>高亮商品</Text>：点击「高亮」，OBS 画面中商品闪烁高亮</Text>
                              <Text>— <Text strong>推送主推商品</Text>：一键将商品信息推送到 Overlay</Text>
                              <Text>— <Text strong>显示/隐藏</Text>：切换 Overlay 显示状态</Text>
                              <Text>— <Text strong>倒计时</Text>：设置秒数和文字，显示限时倒计时</Text>
                              <Text>— <Text strong>闪购</Text>：临时降价，指定商品显示限时特价</Text>
                            </Space>
                          </Card>
                          <Alert type="warning" showIcon icon={<WarningOutlined />} title="直播中控功能需要 Pro 及以上计划" className="mt-2" />
                        </div>
                      ),
                      icon: <PlayCircleOutlined />,
                    },
                  ]}
                />
              </div>
            ),
          },
          {
            key: 'templates',
            label: <span><AppstoreOutlined /> 模板参考</span>,
            children: (
              <div>
                <Paragraph className="mb-4">LiveOverlay 提供 10 种 Overlay 模板，覆盖滚动条、商品卡、角标、横幅、倒计时五大类：</Paragraph>
                <Table
                  dataSource={tickerPositionData}
                  columns={tickerColumns}
                  pagination={false}
                  size="small"
                  bordered
                />
                <Divider />
                <Title level={5}>模板分类说明</Title>
                <Space orientation="vertical" className="w-full">
                  <Card size="small" title="Ticker 滚动条类">
                    <Paragraph className="!mb-0">商品信息在底部/顶部水平滚动，适合展示多个商品。包含 basic-ticker、modern-ticker、minimal-ticker 三种风格。</Paragraph>
                  </Card>
                  <Card size="small" title="Card 商品卡类">
                    <Paragraph className="!mb-0">单个或少量商品的详细展示，包含图片、价格、标签，适合主推商品。包含 minimal-card、spotlight-card 两种风格。</Paragraph>
                  </Card>
                  <Card size="small" title="Badge 角标类">
                    <Paragraph className="!mb-0">小型标签样式，显示简短商品信息和价格，适合角落位置。包含 simple-badge 一种风格。</Paragraph>
                  </Card>
                  <Card size="small" title="Banner 横幅类">
                    <Paragraph className="!mb-0">促销信息横幅，支持侧边列表和顶部促销条。包含 side-list、top-promo 两种风格。</Paragraph>
                  </Card>
                  <Card size="small" title="Countdown 倒计时类">
                    <Paragraph className="!mb-0">限时促销倒计时，营造紧迫感。包含 countdown-banner、promo-countdown 两种风格。</Paragraph>
                  </Card>
                </Space>
              </div>
            ),
          },
          {
            key: 'obs',
            label: <span><VideoCameraOutlined /> OBS 详解</span>,
            children: (
              <div>
                <Title level={5}>OBS 浏览器源配置详解</Title>
                <Collapse
                  items={[
                    {
                      key: '1',
                      label: '如何添加浏览器源？',
                      children: (
                        <Space orientation="vertical">
                          <Text>1. 打开 OBS Studio</Text>
                          <Text>2. 在「来源」(Sources) 面板左下角点击 <Text strong>+</Text> 按钮</Text>
                          <Text>3. 在弹出菜单中选择 <Text strong>浏览器</Text> (Browser)</Text>
                          <Text>4. 选择「创建新建」并点击确定</Text>
                          <Text>5. 在属性窗口填入 Overlay URL 和尺寸</Text>
                          <Text>6. 点击确定，浏览器源即出现在预览区</Text>
                        </Space>
                      ),
                    },
                    {
                      key: '2',
                      label: '如何调整 Overlay 位置和大小？',
                      children: (
                        <Space orientation="vertical">
                          <Text>1. 在预览区中，点击选中浏览器源</Text>
                          <Text>2. 出现红色边框后，拖动源到目标位置</Text>
                          <Text>3. 拖动边框角点可调整大小</Text>
                          <Text>4. 右键源 → 变换 → 重置变换 可恢复默认</Text>
                          <Text>5. 右键源 → 排序 可调整图层顺序（Overlay 通常在最上层）</Text>
                        </Space>
                      ),
                    },
                    {
                      key: '3',
                      label: '为什么 Overlay 不显示 / 不更新？',
                      children: (
                        <Space orientation="vertical">
                          <Text>1. <Text strong>手动刷新</Text>：右键浏览器源 → 刷新 (Refresh)</Text>
                          <Text>2. <Text strong>检查 URL</Text>：确认 URL 格式正确，包含有效的 storeId 和 overlayId</Text>
                          <Text>3. <Text strong>检查尺寸</Text>：宽度/高度不能为 0</Text>
                          <Text>4. <Text strong>网络问题</Text>：确保 OBS 所在电脑能访问 Overlay URL</Text>
                          <Text>5. <Text strong>浏览器源缓存</Text>：取消勾选「关闭时刷新浏览器源」后重新勾选</Text>
                        </Space>
                      ),
                    },
                    {
                      key: '4',
                      label: '背景为什么是透明的？',
                      children: (
                        <Space orientation="vertical">
                          <Text>Overlay 端点默认输出透明背景，这样可以自然叠加在直播画面上。</Text>
                          <Text>OBS 浏览器源自动支持透明背景，无需额外设置。</Text>
                          <Text type="secondary">如果看到白色/黑色背景，请确认：浏览器源属性中未勾选「自定义 CSS」覆盖。</Text>
                        </Space>
                      ),
                    },
                    {
                      key: '5',
                      label: '如何同时使用多个 Overlay？',
                      children: (
                        <Space orientation="vertical">
                          <Text>1. 在 LiveOverlay 中创建多个 Overlay（如一个滚动条 + 一个商品卡）</Text>
                          <Text>2. 在 OBS 中分别添加两个浏览器源</Text>
                          <Text>3. 各自填入不同的 Overlay URL</Text>
                          <Text>4. 分别拖放到不同位置（如底部滚动条 + 右下角商品卡）</Text>
                          <Text type="secondary">注意：免费计划仅支持 1 个 Overlay，需升级才能创建多个。</Text>
                        </Space>
                      ),
                    },
                  ]}
                />
              </div>
            ),
          },
          {
            key: 'plans',
            label: <span><CreditCardOutlined /> 订阅计划</span>,
            children: (
              <div>
                <Paragraph className="mb-4">不同计划对应不同的功能限制，升级后立即生效：</Paragraph>
                <Table
                  dataSource={planCompareData}
                  columns={planColumns}
                  pagination={false}
                  size="small"
                  bordered
                />
                <Divider />
                <Title level={5}>计划说明</Title>
                <Space orientation="vertical" className="w-full">
                  <Card size="small" title={<span><Tag color="default">Free</Tag> 免费版</span>}>
                    <Paragraph className="!mb-0">适合个人试水直播带货。支持 3 个商品和 2 个模板，有水印标识，仅可创建 1 个 Overlay。</Paragraph>
                  </Card>
                  <Card size="small" title={<span><Tag color="blue">Starter</Tag> 入门版</span>}>
                    <Paragraph className="!mb-0">适合小规模直播。30 个商品、5 个模板、3 个 Overlay，去除水印。</Paragraph>
                  </Card>
                  <Card size="small" title={<span><Tag color="green">Pro</Tag> 专业版</span>}>
                    <Paragraph className="!mb-0">适合专业主播。100 个商品、全部模板、10 个 Overlay，解锁直播中控功能（高亮、倒计时、闪购）。</Paragraph>
                  </Card>
                  <Card size="small" title={<span><Tag color="orange">Business</Tag> 商业版</span>}>
                    <Paragraph className="!mb-0">适合团队运营。无限商品和 Overlay、5 个店铺、优先技术支持。</Paragraph>
                  </Card>
                </Space>
              </div>
            ),
          },
          {
            key: 'faq',
            label: <span><QuestionCircleOutlined /> 常见问题</span>,
            children: (
              <div>
                <Collapse
                  defaultActiveKey={['1']}
                  items={[
                    {
                      key: '1',
                      label: 'Overlay 修改后，OBS 里多久能更新？',
                      children: (
                        <Paragraph>通过 Supabase Realtime 实时通道，商品信息的变更会 <Text strong>实时推送</Text> 到 OBS 浏览器源，通常在 1 秒内更新。如果长时间未更新，右键浏览器源 → 刷新即可。</Paragraph>
                      ),
                    },
                    {
                      key: '2',
                      label: 'Overlay 会遮挡主播画面吗？',
                      children: (
                        <Paragraph>LiveOverlay 的设计规范要求 Overlay 区域遮挡不超过画面 20%。建议将滚动条放在底部、商品卡放在角落，避免遮挡主播面部。可以在 OBS 预览区自由调整位置。</Paragraph>
                      ),
                    },
                    {
                      key: '3',
                      label: '可以同时用于 Facebook 和其他平台吗？',
                      children: (
                        <Paragraph>可以。LiveOverlay 的 Overlay 是独立于平台的，只要 OBS 能输出到目标平台（Facebook、YouTube、TikTok 等），Overlay 就会同步显示。</Paragraph>
                      ),
                    },
                    {
                      key: '4',
                      label: '免费版的水印是什么样的？',
                      children: (
                        <Paragraph>免费版在 Overlay 右下角显示一个小型「Powered by LiveOverlay」文字水印，半透明不影响观看。升级到 Starter 及以上版本可去除水印。</Paragraph>
                      ),
                    },
                    {
                      key: '5',
                      label: '直播中 Overlay 突然消失怎么办？',
                      children: (
                        <Space orientation="vertical">
                          <Text>1. 检查 OBS 浏览器源是否被隐藏（眼睛图标）</Text>
                          <Text>2. 右键浏览器源 → 刷新</Text>
                          <Text>3. 检查网络连接是否正常</Text>
                          <Text>4. 在 LiveOverlay 直播中控页面检查 Overlay 是否被隐藏，点击「显示」恢复</Text>
                        </Space>
                      ),
                    },
                    {
                      key: '6',
                      label: '如何自定义 Overlay 的颜色和字体？',
                      children: (
                        <Paragraph>在 Overlay 配置页面，点击对应 Overlay 的「配置」按钮，可自定义主色、背景色、字体等参数。不同模板支持的自定义项不同，Pro 及以上计划解锁更多配置项。</Paragraph>
                      ),
                    },
                    {
                      key: '7',
                      label: 'Overlay URL 泄露了怎么办？',
                      children: (
                        <Paragraph>Overlay URL 是公开的，但仅展示你配置的商品信息，不涉及账户安全。如需更换 URL，可删除旧 Overlay 并创建新的，新 URL 会自动生成。旧 URL 将失效。</Paragraph>
                      ),
                    },
                    {
                      key: '8',
                      label: '支持手机端 OBS 吗？',
                      children: (
                        <Paragraph>LiveOverlay 的 Overlay 使用标准 HTML/CSS/JS，理论上兼容所有支持浏览器源的 OBS 变体。但手机端 OBS 通常不支持浏览器源插件，建议使用 PC 端 OBS Studio。</Paragraph>
                      ),
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
