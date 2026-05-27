/**
 * 微信支付模块 - 动态导入包装
 * wechatpay-node-v3 依赖的 formidable 使用动态 require，
 * Turbopack/Next.js 构建时不支持，因此通过动态 import 延迟加载
 */

import type { NextRequest } from 'next/server';

/** 微信支付交易状态映射 */
export const WECHAT_TRADE_STATE: Record<string, string> = {
  SUCCESS: '支付成功',
  REFUND: '转入退款',
  NOTPAY: '未支付',
  CLOSED: '已关闭',
  REVOKED: '已撤销',
  USERPAYING: '用户支付中',
  PAYERROR: '支付失败',
};

export interface WechatPayResult {
  success: boolean;
  code_url?: string; // 扫码支付二维码链接
  trade_type?: string;
  order_id?: string;
  error?: string;
}

export interface WechatOrderResult {
  success: boolean;
  trade_state?: string;
  trade_state_desc?: string;
  error?: string;
}

interface WechatPayModule {
  createNativeOrder: (
    orderId: string,
    amount: number,
    description: string,
    notifyUrl?: string
  ) => Promise<WechatPayResult>;
  queryOrder: (orderId: string) => Promise<WechatOrderResult>;
  verifyCallback: (body: string, headers: Record<string, string>) => Promise<{ success: boolean; data?: Record<string, string>; error?: string }>;
}

let _module: WechatPayModule | null = null;

async function getModule(): Promise<WechatPayModule> {
  if (_module) return _module;

  // 动态导入，避免 Turbopack 构建时追踪 wechatpay-node-v3 的依赖链
  const mod = await import('@/lib/wechat-pay-impl');
  _module = {
    createNativeOrder: mod.createNativeOrder,
    queryOrder: mod.queryOrder,
    verifyCallback: mod.verifyCallback,
  };
  return _module;
}

/** 创建 Native 扫码支付订单 */
export async function createNativeOrder(
  orderId: string,
  amount: number,
  description: string,
  notifyUrl?: string
): Promise<WechatPayResult> {
  const mod = await getModule();
  return mod.createNativeOrder(orderId, amount, description, notifyUrl);
}

/** 查询订单状态 */
export async function queryOrder(orderId: string): Promise<WechatOrderResult> {
  const mod = await getModule();
  return mod.queryOrder(orderId);
}

/** 验证回调签名 */
export async function verifyCallback(
  body: string,
  headers: Record<string, string>
): Promise<{ success: boolean; data?: Record<string, string>; error?: string }> {
  const mod = await getModule();
  return mod.verifyCallback(body, headers);
}

/** 检查微信支付是否已配置 */
export function isWechatPayConfigured(): boolean {
  return !!(
    process.env.WECHAT_PAY_MCH_ID &&
    process.env.WECHAT_PAY_APP_ID &&
    process.env.WECHAT_PAY_API_KEY
  );
}

/** 别名：兼容旧导入 */
export const isWechatPayEnabled = isWechatPayConfigured;
