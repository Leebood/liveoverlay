// src/lib/paypal.ts
// PayPal REST API integration (no SDK, native fetch + auth)

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

let cachedToken: { token: string; expiresAt: number } | null = null;

/** Check if PayPal is configured */
export function isPaypalEnabled(): boolean {
  return !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

/** Get PayPal access token using Client Credentials */
async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal auth failed: ${err}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

/** Create a PayPal order (for subscription payment) */
export async function createPaypalOrder(
  orderId: string,
  amount: number,
  description: string,
  currency: string = 'USD',
): Promise<{ orderId: string; approveUrl: string }> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId,
        custom_id: orderId,
        description,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      }],
      application_context: {
        brand_name: 'LiveOverlay',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ailiveonline.com'}/billing?paypal=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ailiveonline.com'}/billing?paypal=cancel`,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal order creation failed: ${err}`);
  }

  const data = await res.json() as {
    id: string;
    status: string;
    links: Array<{ rel: string; href: string }>;
  };

  const approveLink = data.links.find(l => l.rel === 'approve');
  if (!approveLink) {
    throw new Error('PayPal approve link not found');
  }

  return {
    orderId: data.id,
    approveUrl: approveLink.href,
  };
}

/** Capture a PayPal order after user approval */
export async function capturePaypalOrder(paypalOrderId: string): Promise<{
  success: boolean;
  customId?: string;
  captureId?: string;
}> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal capture failed: ${err}`);
  }

  const data = await res.json() as {
    status: string;
    purchase_units: Array<{
      payments: {
        captures: Array<{ id: string; status: string }>;
      };
      reference_id: string;
      custom_id: string;
    }>;
  };

  if (data.status === 'COMPLETED') {
    const unit = data.purchase_units[0];
    const capture = unit?.payments?.captures?.[0];
    return {
      success: true,
      customId: unit?.custom_id,
      captureId: capture?.id,
    };
  }

  return { success: false };
}

/** Verify PayPal webhook signature */
export async function verifyPaypalWebhook(
  headers: Record<string, string>,
  body: string,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.warn('[PayPal Webhook] PAYPAL_WEBHOOK_ID is not configured');
    return false;
  }

  const token = await getAccessToken();
  const eventBody = JSON.parse(body);

  const res = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: eventBody,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[PayPal Webhook] Signature verification request failed:', err);
    return false;
  }

  const data = await res.json() as { verification_status?: string };
  return data.verification_status === 'SUCCESS';
}
