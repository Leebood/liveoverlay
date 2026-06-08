// src/lib/creem.ts
// Creem 支付集成 - Merchant of Record 支付平台
// 文档：https://docs.creem.io

const CREEM_API_URLS = {
  test: 'https://test-api.creem.io/v1',
  live: 'https://api.creem.io/v1',
} as const;

type CreemMode = 'test' | 'live';

interface CreemProductIds {
  starter: string;
  pro: string;
  business: string;
}

function getMode(): CreemMode {
  const mode = (process.env.CREEM_MODE || 'test').toLowerCase();
  return mode === 'live' ? 'live' : 'test';
}

function getApiKey(): string {
  return process.env.CREEM_API_KEY || '';
}

function getApiUrl(): string {
  return CREEM_API_URLS[getMode()];
}

function getWebhookSecret(): string {
  return process.env.CREEM_WEBHOOK_SECRET || '';
}

function getProductIds(): CreemProductIds {
  return {
    starter: process.env.CREEM_PRODUCT_ID_STARTER || '',
    pro: process.env.CREEM_PRODUCT_ID_PRO || '',
    business: process.env.CREEM_PRODUCT_ID_BUSINESS || '',
  };
}

function getProductIdForPlan(planType: string): string {
  const ids = getProductIds();
  switch (planType) {
    case 'starter':
      return ids.starter;
    case 'pro':
      return ids.pro;
    case 'business':
      return ids.business;
    default:
      return '';
  }
}

export function isCreemEnabled(): boolean {
  return Boolean(getApiKey());
}

export interface CreemCheckoutRequest {
  planType: string;
  billingPeriod: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  orderId: string;
  customer?: { email?: string };
  metadata?: Record<string, string>;
  successUrl?: string;
}

export interface CreemCheckoutResponse {
  id: string;
  status: string;
  url: string;
  checkoutUrl: string;
}

/**
 * 创建 Creem 结账会话
 * 文档：https://docs.creem.io/api-reference/endpoint/create-checkout
 */
export async function createCreemCheckout(
  request: CreemCheckoutRequest,
): Promise<CreemCheckoutResponse | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('[Creem] CREEM_API_KEY not configured');
    return null;
  }

  const productId = getProductIdForPlan(request.planType);
  if (!productId) {
    console.error(`[Creem] No product ID configured for plan: ${request.planType}`);
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ailiveonline.com';
  const successUrl = request.successUrl || `${baseUrl}/${request.orderId}`;

  try {
    const response = await fetch(`${getApiUrl()}/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: successUrl,
        request_id: request.orderId,
        customer: request.customer?.email ? { email: request.customer.email } : undefined,
        metadata: {
          ...(request.metadata || {}),
          planType: request.planType,
          billingPeriod: request.billingPeriod,
          amount: String(request.amount),
          currency: request.currency,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Creem] Checkout creation failed:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    const checkoutUrl = data.checkout_url || data.url || '';
    return {
      id: data.id,
      status: data.status,
      url: checkoutUrl,
      checkoutUrl,
    };
  } catch (error) {
    console.error('[Creem] Checkout creation error:', error);
    return null;
  }
}

/**
 * 查询结账状态
 */
export async function getCreemCheckout(checkoutId: string): Promise<{
  id: string;
  status: string;
  metadata?: Record<string, string>;
  customer?: { email?: string };
} | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('[Creem] CREEM_API_KEY not configured');
    return null;
  }

  try {
    const response = await fetch(`${getApiUrl()}/checkouts/${checkoutId}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    });

    if (!response.ok) {
      console.error('[Creem] Get checkout failed:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[Creem] Get checkout error:', error);
    return null;
  }
}

/**
 * 验证 Creem Webhook 签名
 * 文档：https://docs.creem.io/learn/webhooks
 */
export function verifyCreemWebhook(
  body: string,
  signature: string,
  secret?: string,
): boolean {
  const webhookSecret = secret || getWebhookSecret();
  if (!signature || !webhookSecret) return false;

  try {
    const crypto = require('crypto') as typeof import('crypto');
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const expectedSignature = hmac.update(body).digest('hex');
    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedSignature, 'hex');
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch (error) {
    console.error('[Creem] Webhook signature verification error:', error);
    return false;
  }
}

/**
 * 业务辅助方法
 */
export const Creem = {
  createCheckout: createCreemCheckout,
  getCheckout: getCreemCheckout,
  verifyWebhook: verifyCreemWebhook,
  isEnabled: isCreemEnabled,
  getMode,
  getApiKey,
  getProductIdForPlan,
};
