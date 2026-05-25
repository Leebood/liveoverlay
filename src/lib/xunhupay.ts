// src/lib/xunhupay.ts
// 虎皮椒（XunhuPay）支付网关 - 支持微信支付和支付宝
// 文档: https://www.xunhupay.com/doc/api/page/index.html

import crypto from 'crypto';

interface XunhuPayConfig {
  appId: string;        // 虎皮椒 App ID
  appSecret: string;    // 虎皮椒 App Secret
  gatewayUrl: string;   // 网关地址
}

function getConfig(): XunhuPayConfig | null {
  const appId = process.env.XUNHUPAY_APP_ID || '';
  const appSecret = process.env.XUNHUPAY_APP_SECRET || '';
  if (!appId || !appSecret) return null;
  return {
    appId,
    appSecret,
    gatewayUrl: process.env.XUNHUPAY_GATEWAY_URL || 'https://api.xunhupay.com/payment/do.html',
  };
}

export function isXunhuPayConfigured(): boolean {
  return getConfig() !== null;
}

/**
 * 生成签名
 * 签名规则: 将所有非空参数按 key 升序排列，用 & 连接成 key=value 格式，最后拼接 appSecret，取 MD5
 */
function generateSign(params: Record<string, string>, appSecret: string): string {
  const sortedKeys = Object.keys(params).filter(k => k !== 'hash' && params[k] !== '').sort();
  const signStr = sortedKeys.map(k => `${k}=${params[k]}`).join('&') + appSecret;
  return crypto.createHash('md5').update(signStr, 'utf8').digest('hex');
}

/**
 * 验证回调签名
 */
export function verifyCallback(params: Record<string, string>): boolean {
  const config = getConfig();
  if (!config) return false;
  const { hash, ...rest } = params;
  if (!hash) return false;
  const expectedSign = generateSign(rest, config.appSecret);
  return hash === expectedSign;
}

export type PaymentChannel = 'wechat' | 'alipay';

interface CreatePaymentParams {
  tradeOrderId: string;     // 商户订单号（唯一）
  totalFee: string;         // 金额，单位：元（如 "59.00"）
  title: string;            // 商品标题
  channel: PaymentChannel;  // 支付渠道: wechat / alipay
  notifyUrl: string;        // 异步回调地址
  returnUrl: string;        // 支付完成后跳转地址
  type?: string;            // 支付类型: native(扫码) / jsapi / h5
  userId?: string;          // 用户标识
  plugin?: string;          // 插件标识
}

interface CreatePaymentResult {
  url_qrcode: string;    // 二维码链接（native 模式）
  url: string;           // 支付页面链接（h5 模式）
  order_id: string;      // 平台订单号
  trade_order_id: string;// 商户订单号
}

export async function createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
  const config = getConfig();
  if (!config) throw new Error('XunhuPay not configured');

  const requestParams: Record<string, string> = {
    version: '1.1',
    appid: config.appId,
    trade_order_id: params.tradeOrderId,
    total_fee: params.totalFee,
    title: params.title,
    time: Math.floor(Date.now() / 1000).toString(),
    notify_url: params.notifyUrl,
    return_url: params.returnUrl,
    channel: params.channel,
    type: params.type || 'native',
  };

  if (params.userId) requestParams.user_id = params.userId;
  if (params.plugin) requestParams.plugin = params.plugin;

  // 生成签名
  requestParams.hash = generateSign(requestParams, config.appSecret);

  // 发起请求
  const response = await fetch(config.gatewayUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(requestParams).toString(),
  });

  const result = await response.json() as Record<string, unknown>;

  if (result.errcode !== 0 && result.errcode !== undefined) {
    throw new Error(`XunhuPay error: ${result.errmsg || JSON.stringify(result)}`);
  }

  return {
    url_qrcode: (result.url_qrcode as string) || '',
    url: (result.url as string) || (result.url_qrcode as string) || '',
    order_id: (result.order_id as string) || '',
    trade_order_id: params.tradeOrderId,
  };
}

/**
 * 查询订单状态
 */
export async function queryOrder(tradeOrderId: string): Promise<Record<string, unknown> | null> {
  const config = getConfig();
  if (!config) return null;

  const queryUrl = process.env.XUNHUPAY_QUERY_URL || 'https://api.xunhupay.com/payment/query.html';

  const params: Record<string, string> = {
    appid: config.appId,
    trade_order_id: tradeOrderId,
    time: Math.floor(Date.now() / 1000).toString(),
  };

  params.hash = generateSign(params, config.appSecret);

  const response = await fetch(queryUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });

  return await response.json() as Record<string, unknown>;
}
