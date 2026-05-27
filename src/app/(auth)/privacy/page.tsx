'use client';

import { useEffect, useState } from 'react';
import { Typography, Divider } from 'antd';
import { useI18n } from '@/i18n';

const { Title, Paragraph } = Typography;

export default function PrivacyPage() {
  const { t, locale } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isZh = locale === 'zh';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <Title level={2}>{isZh ? '隐私政策' : 'Privacy Policy'}</Title>
      <Paragraph type="secondary">
        {isZh ? '最后更新：2026年5月' : 'Last updated: May 2026'}
      </Paragraph>

      <Divider />

      {isZh ? (
        <>
          <Title level={4}>1. 信息收集</Title>
          <Paragraph>
            LiveOverlay 在提供服务过程中可能收集以下信息：
          </Paragraph>
          <ul>
            <li>注册信息：邮箱地址、用户名</li>
            <li>店铺信息：店铺名称、品牌Logo</li>
            <li>商品信息：商品名称、价格、图片</li>
            <li>支付信息：通过第三方支付平台（微信支付、支付宝）处理，我们不存储您的支付卡信息</li>
            <li>使用数据：页面访问记录、功能使用情况</li>
          </ul>

          <Title level={4}>2. 信息使用</Title>
          <Paragraph>
            我们收集的信息仅用于：
          </Paragraph>
          <ul>
            <li>提供和维护 LiveOverlay 服务</li>
            <li>处理订阅和支付</li>
            <li>改进产品体验</li>
            <li>发送与服务相关的重要通知</li>
          </ul>

          <Title level={4}>3. 信息保护</Title>
          <Paragraph>
            我们采用行业标准的安全措施保护您的信息，包括数据加密传输（SSL/TLS）、安全的数据存储服务（Supabase）以及严格的访问控制。
          </Paragraph>

          <Title level={4}>4. 信息共享</Title>
          <Paragraph>
            我们不会将您的个人信息出售或共享给第三方，以下情况除外：
          </Paragraph>
          <ul>
            <li>经您明确同意</li>
            <li>为完成支付而与支付服务提供商共享必要信息</li>
            <li>法律法规要求</li>
          </ul>

          <Title level={4}>5. 数据存储</Title>
          <Paragraph>
            您的数据存储在安全的云服务器上，通过 Supabase 提供的数据库服务进行管理。我们采用合理的措施确保数据的安全性和可用性。
          </Paragraph>

          <Title level={4}>6. Cookie 使用</Title>
          <Paragraph>
            我们使用必要的 Cookie 来维持登录状态和会话安全。我们不使用追踪性 Cookie 或第三方广告追踪。
          </Paragraph>

          <Title level={4}>7. 您的权利</Title>
          <Paragraph>您有权：</Paragraph>
          <ul>
            <li>访问和查看您的个人数据</li>
            <li>修改或删除您的账户信息</li>
            <li>取消订阅并请求删除相关数据</li>
            <li>随时联系我们行使上述权利</li>
          </ul>

          <Title level={4}>8. 儿童隐私</Title>
          <Paragraph>
            LiveOverlay 不面向 16 岁以下用户，我们不会有意收集儿童的个人信息。
          </Paragraph>

          <Title level={4}>9. 政策更新</Title>
          <Paragraph>
            我们可能会不定期更新本隐私政策。重大变更将通过邮件或网站通知的方式告知您。
          </Paragraph>

          <Title level={4}>10. 联系我们</Title>
          <Paragraph>
            如有任何关于隐私政策的问题，请通过以下方式联系我们：
          </Paragraph>
          <Paragraph>
            <strong>邮箱：</strong>
            <a href="mailto:leo.tikboost@gmail.com">leo.tikboost@gmail.com</a>
          </Paragraph>
        </>
      ) : (
        <>
          <Title level={4}>1. Information Collection</Title>
          <Paragraph>
            LiveOverlay may collect the following information while providing services:
          </Paragraph>
          <ul>
            <li>Registration info: email address, username</li>
            <li>Store info: store name, brand logo</li>
            <li>Product info: product name, price, images</li>
            <li>Payment info: processed through third-party payment platforms (WeChat Pay, Alipay). We do not store your card details.</li>
            <li>Usage data: page visit records, feature usage</li>
          </ul>

          <Title level={4}>2. Information Usage</Title>
          <Paragraph>
            The information we collect is used solely for:
          </Paragraph>
          <ul>
            <li>Providing and maintaining LiveOverlay services</li>
            <li>Processing subscriptions and payments</li>
            <li>Improving product experience</li>
            <li>Sending important service-related notifications</li>
          </ul>

          <Title level={4}>3. Information Protection</Title>
          <Paragraph>
            We use industry-standard security measures to protect your information, including encrypted data transmission (SSL/TLS), secure data storage (Supabase), and strict access controls.
          </Paragraph>

          <Title level={4}>4. Information Sharing</Title>
          <Paragraph>
            We do not sell or share your personal information with third parties, except:
          </Paragraph>
          <ul>
            <li>With your explicit consent</li>
            <li>Sharing necessary info with payment providers to complete transactions</li>
            <li>As required by law</li>
          </ul>

          <Title level={4}>5. Data Storage</Title>
          <Paragraph>
            Your data is stored on secure cloud servers managed through Supabase database services. We take reasonable measures to ensure data security and availability.
          </Paragraph>

          <Title level={4}>6. Cookie Usage</Title>
          <Paragraph>
            We use essential cookies to maintain login status and session security. We do not use tracking cookies or third-party ad trackers.
          </Paragraph>

          <Title level={4}>7. Your Rights</Title>
          <Paragraph>You have the right to:</Paragraph>
          <ul>
            <li>Access and view your personal data</li>
            <li>Modify or delete your account information</li>
            <li>Cancel subscriptions and request data deletion</li>
            <li>Contact us at any time to exercise these rights</li>
          </ul>

          <Title level={4}>8. Children&apos;s Privacy</Title>
          <Paragraph>
            LiveOverlay is not intended for users under 16. We do not knowingly collect personal information from children.
          </Paragraph>

          <Title level={4}>9. Policy Updates</Title>
          <Paragraph>
            We may update this privacy policy from time to time. Significant changes will be communicated via email or website notification.
          </Paragraph>

          <Title level={4}>10. Contact Us</Title>
          <Paragraph>
            If you have any questions about this privacy policy, please contact us at:
          </Paragraph>
          <Paragraph>
            <strong>Email: </strong>
            <a href="mailto:leo.tikboost@gmail.com">leo.tikboost@gmail.com</a>
          </Paragraph>
        </>
      )}

      <Divider />
      <Paragraph type="secondary" style={{ textAlign: 'center' }}>
        © {new Date().getFullYear()} LiveOverlay. {isZh ? '保留所有权利。' : 'All rights reserved.'}
      </Paragraph>
    </div>
  );
}
