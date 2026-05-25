/**
 * 支付宝官方直连模块
 * 
 * 支持能力：电脑网站支付（Page Pay）+ 扫码支付
 * 适用资质：个体工商户营业执照
 * 
 * 环境变量：
 * - ALIPAY_APP_ID: 应用 AppID
 * - ALIPAY_PRIVATE_KEY: 应用私钥（RSA2）
 * - ALIPAY_PUBLIC_KEY: 支付宝公钥（用于验签）
 * - ALIPAY_NOTIFY_URL: 支付回调地址
 * - ALIPAY_RETURN_URL: 前端跳转地址
 */

import { AlipaySdk } from 'alipay-sdk';

let alipayInstance: AlipaySdk | null = null;

function getAlipay(): AlipaySdk | null {
  const appId = process.env.ALIPAY_APP_ID;
  const privateKey = process.env.ALIPAY_PRIVATE_KEY;
  const alipayPublicKey = process.env.ALIPAY_PUBLIC_KEY;

  if (!appId || !privateKey) {
    console.warn('[Alipay] 缺少必要环境变量，支付宝未启用');
    return null;
  }

  if (!alipayInstance) {
    alipayInstance = new AlipaySdk({
      appId,
      privateKey,
      alipayPublicKey: alipayPublicKey || '',
      signType: 'RSA2',
    });
  }

  return alipayInstance;
}

/** 支付宝是否已配置 */
export function isAlipayEnabled(): boolean {
  return !!(process.env.ALIPAY_APP_ID && process.env.ALIPAY_PRIVATE_KEY);
}

/**
 * 创建电脑网站支付订单（Page Pay）
 * 用户在支付宝页面完成支付
 * @param orderId 商户订单号
 * @param amount 金额（元）
 * @param subject 商品标题
 * @returns 支付宝支付页面 URL
 */
export async function createPagePayOrder(
  orderId: string,
  amount: number,
  subject: string
): Promise<string | null> {
  const alipay = getAlipay();
  if (!alipay) return null;

  const notifyUrl = process.env.ALIPAY_NOTIFY_URL || '';
  const returnUrl = process.env.ALIPAY_RETURN_URL || '';

  try {
    const result = await alipay.pageExec('alipay.trade.page.pay', {
      method: 'GET',
      bizContent: {
        out_trade_no: orderId,
        total_amount: amount.toFixed(2),
        subject,
        product_code: 'FAST_INSTANT_TRADE_PAY',
      },
      notify_url: notifyUrl,
      return_url: returnUrl,
    });

    return result as string;
  } catch (error: unknown) {
    console.error('[Alipay] 创建订单失败:', error);
    throw error;
  }
}

/**
 * 创建扫码支付订单（当面付）
 * 生成二维码让用户扫码付款
 * @param orderId 商户订单号
 * @param amount 金额（元）
 * @param subject 商品标题
 * @returns qr_code 二维码链接
 */
export async function createPrecreateOrder(
  orderId: string,
  amount: number,
  subject: string
): Promise<string | null> {
  const alipay = getAlipay();
  if (!alipay) return null;

  const notifyUrl = process.env.ALIPAY_NOTIFY_URL || '';

  try {
    const result = await alipay.exec('alipay.trade.precreate', {
      notify_url: notifyUrl,
      bizContent: {
        out_trade_no: orderId,
        total_amount: amount.toFixed(2),
        subject,
      },
    });

    const qrCode = (result as Record<string, unknown>)?.qrCode as string || 
                    (result as Record<string, unknown>)?.qr_code as string || null;
    return qrCode;
  } catch (error: unknown) {
    console.error('[Alipay] 创建扫码订单失败:', error);
    throw error;
  }
}

/**
 * 查询订单状态
 * @param orderId 商户订单号
 */
export async function queryOrder(orderId: string): Promise<{
  tradeStatus: string;
  tradeNo: string;
} | null> {
  const alipay = getAlipay();
  if (!alipay) return null;

  try {
    const result = await alipay.exec('alipay.trade.query', {
      bizContent: {
        out_trade_no: orderId,
      },
    });

    const resp = result as Record<string, unknown>;
    return {
      tradeStatus: resp.tradeStatus as string || resp.trade_status as string || '',
      tradeNo: resp.tradeNo as string || resp.trade_no as string || '',
    };
  } catch (error: unknown) {
    console.error('[Alipay] 查询订单失败:', error);
    return null;
  }
}

/**
 * 验证支付宝回调签名
 */
export function verifyCallback(params: Record<string, string>): boolean {
  const alipay = getAlipay();
  if (!alipay) return false;

  try {
    return alipay.checkNotifySign(params);
  } catch (error: unknown) {
    console.error('[Alipay] 验签失败:', error);
    return false;
  }
}

/** 订单状态映射 */
export const ALIPAY_TRADE_STATUS: Record<string, string> = {
  TRADE_SUCCESS: '支付成功',
  TRADE_FINISHED: '交易完结',
  WAIT_BUYER_PAY: '等待支付',
  TRADE_CLOSED: '交易关闭',
};
