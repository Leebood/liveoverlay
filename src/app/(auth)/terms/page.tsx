'use client';

import { useEffect, useState } from 'react';
import { Typography, Divider } from 'antd';
import { useI18n } from '@/i18n';

const { Title, Paragraph } = Typography;

export default function TermsPage() {
  const { locale } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isZh = locale === 'zh';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <Title level={2}>{isZh ? '服务条款' : 'Terms of Service'}</Title>
      <Paragraph type="secondary">
        {isZh ? '最后更新：2026年6月' : 'Last updated: June 2026'}
      </Paragraph>

      <Divider />

      {isZh ? (
        <>
          <Title level={4}>1. 服务说明</Title>
          <Paragraph>
            LiveOverlay（以下简称"本服务"）是一个面向 Facebook 直播主的商品贴片 SaaS 工具。
            通过 OBS 浏览器源嵌入，用户可在直播间实时展示商品条、主推卡、促销角标等 Overlay 模板。
          </Paragraph>

          <Title level={4}>2. 账户与订阅</Title>
          <Paragraph>
            2.1 注册本服务即表示您同意遵守本条款；<br />
            2.2 订阅计划分为免费版（Free）、入门版（Starter）、专业版（Pro）、企业版（Business），各计划权限和价格以官网公布为准；<br />
            2.3 付费订阅通过 Creem（国际信用卡）或微信支付完成，按月付费；<br />
            2.4 您可随时在控制台取消订阅，已付费用不退；<br />
            2.5 升级计划即时生效，降级计划在当前计费周期结束后生效。
          </Paragraph>

          <Title level={4}>3. 使用规范</Title>
          <Paragraph>
            3.1 不得使用本服务发布违反所在国家/地区法律法规的内容；<br />
            3.2 不得传播色情、赌博、欺诈、仇恨、暴力等内容；<br />
            3.3 不得对 Overlay 链接进行恶意转发、刷量、滥用 API；<br />
            3.4 不得侵犯第三方知识产权、商标或商业秘密；<br />
            3.5 违反者将被暂停或终止账户，且不予退款。
          </Paragraph>

          <Title level={4}>4. 知识产权</Title>
          <Paragraph>
            本服务的所有模板、代码、品牌、Logo 归 LiveOverlay 所有；<br />
            您上传的商品图片、文本等内容的版权归您所有，您授予我们全球范围内、非排他、不可转让的使用许可，用于提供本服务。
          </Paragraph>

          <Title level={4}>5. 服务变更与终止</Title>
          <Paragraph>
            5.1 我们保留随时修改或暂停本服务的权利，会提前 7 天在官网公告；<br />
            5.2 您可随时停止使用并删除账户；<br />
            5.3 因您违反条款导致账户被封，已付费用不予退还。
          </Paragraph>

          <Title level={4}>6. 免责声明</Title>
          <Paragraph>
            本服务按"现状"提供，我们不对以下情况承担责任：<br />
            (1) 因不可抗力（如自然灾害、网络中断）导致服务中断；<br />
            (2) 因您使用不当造成的数据丢失；<br />
            (3) 因第三方支付平台（Creem、微信支付）故障导致的支付问题。
          </Paragraph>

          <Title level={4}>7. 责任限制</Title>
          <Paragraph>
            在法律允许的最大范围内，本服务对您承担的总责任不超过您在过去 12 个月内向我们支付的费用总额。
          </Paragraph>

          <Title level={4}>8. 适用法律</Title>
          <Paragraph>本条款适用中华人民共和国法律。争议由双方协商解决；协商不成的，提交运营方所在地有管辖权的法院诉讼解决。</Paragraph>

          <Title level={4}>9. 联系我们</Title>
          <Paragraph>
            如有疑问，请联系：<a href="mailto:leo.tikboost@gmail.com">leo.tikboost@gmail.com</a>
          </Paragraph>
        </>
      ) : (
        <>
          <Title level={4}>1. Service Description</Title>
          <Paragraph>
            LiveOverlay (the "Service") is a SaaS tool for Facebook live streamers to display product overlays.
            Through OBS browser source, users can show real-time product tickers, hero cards, and promotional badges.
          </Paragraph>

          <Title level={4}>2. Accounts and Subscriptions</Title>
          <Paragraph>
            2.1 By signing up, you agree to these Terms;<br />
            2.2 Subscription plans include Free, Starter, Pro, and Business. Plan features and prices are as published on our website;<br />
            2.3 Paid subscriptions are processed via Creem (international cards) or WeChat Pay on a monthly basis;<br />
            2.4 You may cancel at any time via the dashboard. Paid fees are non-refundable;<br />
            2.5 Upgrades take effect immediately. Downgrades take effect at the end of the current billing period.
          </Paragraph>

          <Title level={4}>3. Acceptable Use</Title>
          <Paragraph>
            3.1 Do not use the Service to publish content illegal in your jurisdiction;<br />
            3.2 No porn, gambling, fraud, hate, or violence;<br />
            3.3 No malicious sharing of overlay links, traffic pumping, or API abuse;<br />
            3.4 Do not infringe third-party IP, trademarks, or trade secrets;<br />
            3.5 Violations will result in suspension or termination without refund.
          </Paragraph>

          <Title level={4}>4. Intellectual Property</Title>
          <Paragraph>
            All templates, code, branding, and logos are the property of LiveOverlay;<br />
            Content you upload (product images, text) remains yours. You grant us a worldwide, non-exclusive, non-transferable license to use it to provide the Service.
          </Paragraph>

          <Title level={4}>5. Service Changes and Termination</Title>
          <Paragraph>
            5.1 We reserve the right to modify or discontinue the Service with 7 days' notice on our website;<br />
            5.2 You may stop using and delete your account at any time;<br />
            5.3 Paid fees will not be refunded for accounts terminated due to violations.
          </Paragraph>

          <Title level={4}>6. Disclaimer</Title>
          <Paragraph>
            The Service is provided "as is". We are not liable for:<br />
            (1) Service interruptions caused by force majeure (natural disasters, network outages);<br />
            (2) Data loss due to user misuse;<br />
            (3) Payment issues caused by third-party payment platforms (Creem, WeChat Pay).
          </Paragraph>

          <Title level={4}>7. Limitation of Liability</Title>
          <Paragraph>
            To the maximum extent permitted by law, our total liability to you shall not exceed the total fees you paid us in the past 12 months.
          </Paragraph>

          <Title level={4}>8. Governing Law</Title>
          <Paragraph>These Terms are governed by the laws of the People's Republic of China. Disputes shall be resolved through negotiation; failing that, by the competent court at our operating location.</Paragraph>

          <Title level={4}>9. Contact Us</Title>
          <Paragraph>
            For questions, contact: <a href="mailto:leo.tikboost@gmail.com">leo.tikboost@gmail.com</a>
          </Paragraph>
        </>
      )}

      <Divider />
      <Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 24 }}>
        © {new Date().getFullYear()} LiveOverlay. {isZh ? '保留所有权利' : 'All rights reserved'}.
      </Paragraph>
    </div>
  );
}
