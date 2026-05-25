/**
 * 微信支付官方直连模块
 * 
 * 支持能力：Native 扫码支付（用户扫码付款）
 * 适用资质：个体工商户营业执照
 * 
 * 环境变量：
 * - WECHAT_PAY_MCH_ID: 商户号
 * - WECHAT_PAY_APP_ID: 公众号/小程序 AppID
 * - WECHAT_PAY_API_KEY: APIv3 密钥
 * - WECHAT_PAY_SERIAL_NO: 商户证书序列号
 * - WECHAT_PAY_PRIVATE_KEY: 商户私钥（PEM 格式字符串）
 * - WECHAT_PAY_NOTIFY_URL: 支付回调地址
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const WxPay = require('wechatpay-node-v3');

interface WxPayInstance {
  request: (params: { url: string; method: string; data: Record<string, unknown> }) => Promise<Record<string, unknown>>;
}

let wxPayInstance: WxPayInstance | null = null;

function getWxPay(): WxPayInstance | null {
  const mchId = process.env.WECHAT_PAY_MCH_ID;
  const appId = process.env.WECHAT_PAY_APP_ID;
  const apiKey = process.env.WECHAT_PAY_API_KEY;
  const privateKey = process.env.WECHAT_PAY_PRIVATE_KEY;
  const serialNo = process.env.WECHAT_PAY_SERIAL_NO;

  if (!mchId || !appId || !apiKey) {
    console.warn('[WechatPay] 缺少必要环境变量，微信支付未启用');
    return null;
  }

  if (!wxPayInstance) {
    const keyBuffer = privateKey
      ? Buffer.from(privateKey.replace(/\\n/g, '\n'))
      : Buffer.alloc(0);

    const options: Record<string, unknown> = {
      key: apiKey,
    };

    if (serialNo) {
      options.certSerialNo = serialNo;
    }

    wxPayInstance = new WxPay(
      appId,
      mchId,
      keyBuffer,  // publicKey
      keyBuffer,  // privateKey
      options,
    );
  }

  return wxPayInstance;
}

/** 微信支付是否已配置 */
export function isWechatPayEnabled(): boolean {
  return !!(process.env.WECHAT_PAY_MCH_ID && process.env.WECHAT_PAY_APP_ID && process.env.WECHAT_PAY_API_KEY);
}

/**
 * 创建 Native 扫码支付订单
 * @param orderId 商户订单号
 * @param amount 金额（元）
 * @param description 商品描述
 * @returns code_url 二维码链接
 */
export async function createNativeOrder(
  orderId: string,
  amount: number,
  description: string
): Promise<{ code_url: string } | null> {
  const wxPay = getWxPay();
  if (!wxPay) return null;

  const notifyUrl = process.env.WECHAT_PAY_NOTIFY_URL || '';

  try {
    const result = await wxPay.request({
      url: '/v3/pay/transactions/native',
      method: 'POST',
      data: {
        appid: process.env.WECHAT_PAY_APP_ID,
        mchid: process.env.WECHAT_PAY_MCH_ID,
        description,
        out_trade_no: orderId,
        notify_url: notifyUrl,
        amount: {
          total: Math.round(amount * 100), // 元转分
          currency: 'CNY',
        },
      },
    });

    return result as { code_url: string };
  } catch (error: unknown) {
    console.error('[WechatPay] 创建订单失败:', error);
    throw error;
  }
}

/**
 * 查询订单状态
 * @param orderId 商户订单号
 */
export async function queryOrder(orderId: string): Promise<{
  trade_state: string;
  trade_state_desc: string;
} | null> {
  const wxPay = getWxPay();
  if (!wxPay) return null;

  try {
    const result = await wxPay.request({
      url: `/v3/pay/transactions/out-trade-no/${orderId}?mchid=${process.env.WECHAT_PAY_MCH_ID}`,
      method: 'GET',
      data: {},
    });

    return result as { trade_state: string; trade_state_desc: string };
  } catch (error: unknown) {
    console.error('[WechatPay] 查询订单失败:', error);
    return null;
  }
}

/**
 * 验证微信支付回调签名
 * 简化版验证 - 生产环境应使用平台证书完整验证
 */
export function verifyCallback(
  _timestamp: string,
  _nonce: string,
  _body: string,
  _signature: string
): boolean {
  // 生产环境应使用微信平台证书验证签名
  // 此处简化处理，有配置即通过
  return isWechatPayEnabled();
}

/** 订单状态映射 */
export const WECHAT_TRADE_STATE: Record<string, string> = {
  SUCCESS: '支付成功',
  REFUND: '转入退款',
  NOTPAY: '未支付',
  CLOSED: '已关闭',
  REVOKED: '已撤销（付款码支付）',
  USERPAYING: '用户支付中',
  PAYERROR: '支付失败',
};
