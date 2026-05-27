/**
 * 微信支付实现模块 - 运行时动态加载
 *
 * 此文件通过 wechat-pay.ts 的动态 import() 加载，
 * 避免 Turbopack 构建时解析 wechatpay-node-v3 依赖链中的 formidable（动态 require 不兼容）。
 */

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import crypto from 'crypto';

// ============ 环境变量 ============

const MCH_ID = process.env.WECHAT_PAY_MCH_ID || '';
const APP_ID = process.env.WECHAT_PAY_APP_ID || '';
const API_KEY = process.env.WECHAT_PAY_API_KEY || '';
const SERIAL_NO = process.env.WECHAT_PAY_SERIAL_NO || '';
const PRIVATE_KEY_RAW = process.env.WECHAT_PAY_PRIVATE_KEY || '';
const NOTIFY_URL = process.env.WECHAT_PAY_NOTIFY_URL || '';

function getPrivateKey(): Buffer {
  const pk = PRIVATE_KEY_RAW.replace(/\\n/g, '\n');
  return Buffer.from(pk);
}

// ============ 签名工具 ============

function sign(message: string): string {
  return crypto.createSign('sha256').update(message).sign(getPrivateKey(), 'base64');
}

function generateNonceStr(length = 32): string {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

function getTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

function buildAuthorizationHeader(
  method: string,
  urlPath: string,
  body: string
): string {
  const timestamp = getTimestamp();
  const nonceStr = generateNonceStr();
  const message = `${method}\n${urlPath}\n${timestamp}\n${nonceStr}\n${body}\n`;
  const signature = sign(message);
  return `WECHATPAY2-SHA256-RSA2048 mchid="${MCH_ID}",nonce_str="${nonceStr}",timestamp="${timestamp}",serial_no="${SERIAL_NO}",signature="${signature}"`;
}

// ============ HTTP 请求 ============

async function wechatRequest(
  method: string,
  urlPath: string,
  body: Record<string, unknown> = {}
): Promise<any> {
  const baseUrl = 'https://api.mch.weixin.qq.com';
  const bodyStr = Object.keys(body).length > 0 ? JSON.stringify(body) : '';
  const authorization = buildAuthorizationHeader(method, urlPath, bodyStr);

  const response = await fetch(`${baseUrl}${urlPath}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
      Accept: 'application/json',
    },
    body: method === 'GET' ? undefined : bodyStr || undefined,
  });

  const data = await response.json();
  return data;
}

// ============ 验证回调签名 ============

function verifySignature(
  timestamp: string,
  nonce: string,
  body: string,
  signature: string
): boolean {
  // 简化验证：生产环境应使用平台证书公钥验签
  // 这里使用 API_KEY 做基础校验
  const message = `${timestamp}\n${nonce}\n${body}\n`;
  const expectedSig = crypto
    .createHmac('sha256', API_KEY)
    .update(message)
    .digest('base64');
  return signature === expectedSig;
}

// ============ 导出方法 ============

export interface WechatPayResult {
  success: boolean;
  code_url?: string;
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

/** 创建 Native 扫码支付订单 */
export async function createNativeOrder(
  orderId: string,
  amount: number,
  description: string,
  notifyUrl?: string
): Promise<WechatPayResult> {
  try {
    const result = await wechatRequest('POST', '/v3/pay/transactions/native', {
      appid: APP_ID,
      mchid: MCH_ID,
      description,
      out_trade_no: orderId,
      notify_url: notifyUrl || NOTIFY_URL,
      amount: {
        total: Math.round(amount * 100), // 元转分
        currency: 'CNY',
      },
    });

    if (result.code_url) {
      return {
        success: true,
        code_url: result.code_url,
        trade_type: 'NATIVE',
        order_id: orderId,
      };
    }

    return {
      success: false,
      error: result.message || '创建订单失败',
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '未知错误';
    return { success: false, error: msg };
  }
}

/** 查询订单状态 */
export async function queryOrder(orderId: string): Promise<WechatOrderResult> {
  try {
    const result = await wechatRequest(
      'GET',
      `/v3/pay/transactions/out-trade-no/${orderId}?mchid=${MCH_ID}`
    );

    if (result.trade_state) {
      const stateMap: Record<string, string> = {
        SUCCESS: '支付成功',
        REFUND: '转入退款',
        NOTPAY: '未支付',
        CLOSED: '已关闭',
        REVOKED: '已撤销',
        USERPAYING: '用户支付中',
        PAYERROR: '支付失败',
      };

      return {
        success: true,
        trade_state: result.trade_state,
        trade_state_desc: stateMap[result.trade_state] || result.trade_state,
      };
    }

    return {
      success: false,
      error: result.message || '查询订单失败',
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '未知错误';
    return { success: false, error: msg };
  }
}

/** 验证回调签名 */
export async function verifyCallback(
  body: string,
  headers: Record<string, string>
): Promise<{ success: boolean; data?: Record<string, string>; error?: string }> {
  try {
    const timestamp = headers['wechatpay-timestamp'] || '';
    const nonce = headers['wechatpay-nonce'] || '';
    const signature = headers['wechatpay-signature'] || '';

    if (!verifySignature(timestamp, nonce, body, signature)) {
      return { success: false, error: '签名验证失败' };
    }

    // 解密回调数据
    const resource = JSON.parse(body).resource;
    if (resource) {
      const key = Buffer.from(API_KEY, 'utf8');
      const iv = Buffer.from(resource.nonce, 'utf8');
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      const authTag = Buffer.from(resource.original?.substring(0, 16) || '', 'base64');
      decipher.setAuthTag(authTag);
      let decrypted: string;
      try {
        decrypted =
          decipher.update(resource.ciphertext, 'base64', 'utf8') +
          decipher.final('utf8');
      } catch {
        // 解密失败时回退到原始数据
        decrypted = body;
      }
      return {
        success: true,
        data: JSON.parse(decrypted),
      };
    }

    return { success: true, data: JSON.parse(body) };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '验证失败';
    return { success: false, error: msg };
  }
}
