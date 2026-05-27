import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';
import { AuthProvider } from '@/components/common/AuthProvider';
import { I18nProvider } from '@/i18n';

export const metadata: Metadata = {
  title: {
    default: 'LiveOverlay | Facebook Live Shopping Overlay Plugin',
    template: '%s | LiveOverlay',
  },
  description:
    'Make your Facebook Live stream look like a pro shopping channel — OBS browser source overlay for product tickers, spotlight cards, promo badges and more.',
  keywords: [
    'LiveOverlay',
    'Facebook Live',
    'Live Shopping Overlay',
    'OBS',
    'Product Display',
    'Live Streaming',
    'Live Commerce Plugin',
  ],
  authors: [{ name: 'LiveOverlay' }],
  openGraph: {
    title: 'LiveOverlay | Facebook Live Shopping Overlay Plugin',
    description: 'Professional live shopping overlays for Facebook Live streams',
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
