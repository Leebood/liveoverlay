export type Locale = 'zh' | 'en';

export const locales: Locale[] = ['zh', 'en'];
export const defaultLocale: Locale = 'zh';

export const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
};

export type TranslationKeys = {
  // Common
  'common.loading': string;
  'common.save': string;
  'common.cancel': string;
  'common.delete': string;
  'common.edit': string;
  'common.create': string;
  'common.confirm': string;
  'common.search': string;
  'common.success': string;
  'common.error': string;
  'common.back': string;
  'common.yes': string;
  'common.no': string;
  'common.all': string;
  'common.free': string;
  'common.close': string;
  'common.detail': string;
  'common.status': string;
  'common.action': string;
  'common.noData': string;

  // Auth
  'auth.login': string;
  'auth.register': string;
  'auth.logout': string;
  'auth.email': string;
  'auth.password': string;
  'auth.confirmPassword': string;
  'auth.name': string;
  'auth.forgotPassword': string;
  'auth.noAccount': string;
  'auth.hasAccount': string;
  'auth.loginSuccess': string;
  'auth.registerSuccess': string;
  'auth.loginFailed': string;
  'auth.registerFailed': string;
  'auth.emailRequired': string;
  'auth.passwordRequired': string;
  'auth.passwordMin': string;
  'auth.nameRequired': string;
  'auth.passwordMismatch': string;

  // Sidebar / Nav
  'nav.dashboard': string;
  'nav.products': string;
  'nav.templates': string;
  'nav.overlay': string;
  'nav.live': string;
  'nav.analytics': string;
  'nav.settings': string;
  'nav.billing': string;
  'nav.guide': string;
  'nav.testPlan': string;

  // Dashboard
  'dashboard.title': string;
  'dashboard.welcome': string;
  'dashboard.quickActions': string;
  'dashboard.totalProducts': string;
  'dashboard.activeOverlays': string;
  'dashboard.currentPlan': string;
  'dashboard.upgrade': string;
  'dashboard.createProduct': string;
  'dashboard.createOverlay': string;
  'dashboard.viewTemplates': string;
  'dashboard.recentActivity': string;

  // Products
  'products.title': string;
  'products.create': string;
  'products.edit': string;
  'products.name': string;
  'products.price': string;
  'products.description': string;
  'products.category': string;
  'products.buyUrl': string;
  'products.image': string;
  'products.imageHint': string;
  'products.buyUrlHint': string;
  'products.testUrl': string;
  'products.noProducts': string;
  'products.createFirst': string;
  'products.deleteConfirm': string;
  'products.saved': string;
  'products.created': string;
  'products.deleted': string;

  // Templates
  'templates.title': string;
  'templates.selectTemplate': string;
  'templates.category': string;
  'templates.minPlan': string;
  'templates.size': string;
  'templates.useTemplate': string;
  'templates.viewDetail': string;
  'templates.categories.all': string;
  'templates.categories.ticker': string;
  'templates.categories.product_card': string;
  'templates.categories.badge': string;
  'templates.categories.side_panel': string;
  'templates.categories.banner': string;
  'templates.categories.countdown': string;
  'templates.categories.notification': string;

  // Overlay
  'overlay.title': string;
  'overlay.create': string;
  'overlay.name': string;
  'overlay.template': string;
  'overlay.width': string;
  'overlay.height': string;
  'overlay.products': string;
  'overlay.obsCode': string;
  'overlay.copyObsCode': string;
  'overlay.obsHint': string;
  'overlay.preview': string;
  'overlay.buyLinkEnabled': string;
  'overlay.noOverlays': string;

  // Live
  'live.title': string;
  'live.start': string;
  'live.stop': string;
  'live.status': string;
  'live.active': string;
  'live.inactive': string;
  'live.control': string;
  'live.nextProduct': string;
  'live.prevProduct': string;
  'live.highlight': string;

  // Analytics
  'analytics.title': string;
  'analytics.overview': string;
  'analytics.views': string;
  'analytics.clicks': string;
  'analytics.conversions': string;
  'analytics.revenue': string;
  'analytics.period': string;

  // Settings
  'settings.title': string;
  'settings.profile': string;
  'settings.store': string;
  'settings.language': string;
  'settings.languageHint': string;
  'settings.theme': string;
  'settings.notifications': string;

  // Billing
  'billing.title': string;
  'billing.currentPlan': string;
  'billing.upgrade': string;
  'billing.downgrade': string;
  'billing.cancel': string;
  'billing.monthly': string;
  'billing.yearly': string;
  'billing.perMonth': string;
  'billing.perYear': string;
  'billing.save': string;
  'billing.wechatPay': string;
  'billing.alipay': string;
  'billing.scanToPay': string;
  'billing.paying': string;
  'billing.paySuccess': string;
  'billing.payFailed': string;
  'billing.orderStatus': string;
  'billing.featureList': string;
  'billing.cancelConfirm': string;
  'billing.cancelSuccess': string;

  // Plans
  'plan.free': string;
  'plan.starter': string;
  'plan.pro': string;
  'plan.business': string;
  'plan.products': string;
  'plan.templates': string;
  'plan.overlays': string;
  'plan.stores': string;
  'plan.watermark': string;
  'plan.liveControl': string;
  'plan.analytics': string;
  'plan.priority': string;
  'plan.unlimited': string;
  'plan.basic': string;
  'plan.advanced': string;

  // Pricing
  'pricing.title': string;
  'pricing.subtitle': string;
  'pricing.startFree': string;
  'pricing.getStarted': string;
  'pricing.contactUs': string;
  'pricing.mostPopular': string;
  'pricing.securePayment': string;

  // Landing
  'landing.hero': string;
  'landing.subtitle': string;
  'landing.startFree': string;
  'landing.watchDemo': string;
  'landing.feature1': string;
  'landing.feature2': string;
  'landing.feature3': string;
  'landing.feature4': string;
  'landing.cta': string;

  // Guide
  'guide.title': string;
  'guide.quickStart': string;
  'guide.templateRef': string;
  'guide.obsDetail': string;
  'guide.planCompare': string;
  'guide.faq': string;

  // Test Plan
  'testPlan.title': string;
  'testPlan.currentPlan': string;
  'testPlan.switchTo': string;
  'testPlan.features': string;
  'testPlan.compare': string;
  'testPlan.refreshSession': string;
};
