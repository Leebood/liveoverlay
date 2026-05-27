import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';
import { AuthProvider } from '@/components/common/AuthProvider';
import { I18nProvider } from '@/i18n';

export const metadata: Metadata = {
  title: {
    default: 'LiveOverlay | Facebook直播商品贴片插件',
    template: '%s | LiveOverlay',
  },
  description:
    '让你的Facebook直播间看起来像淘宝直播间——OBS浏览器源一键嵌入，实时展示滚动商品条、主推商品卡、促销角标。',
  keywords: [
    'LiveOverlay',
    'Facebook Live',
    '直播贴片',
    'OBS',
    '商品展示',
    '直播带货',
    '直播插件',
  ],
  authors: [{ name: 'LiveOverlay' }],
  openGraph: {
    title: 'LiveOverlay | Facebook直播商品贴片插件',
    description: '让你的Facebook直播间看起来像淘宝直播间',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        <I18nProvider>
          <AuthProvider>
            <AntdRegistry>
              {children}
            </AntdRegistry>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
