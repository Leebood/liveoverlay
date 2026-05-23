# AGENTS.md — LiveOverlay

## 项目概览
LiveOverlay 是一个 Facebook 直播商品贴片插件，采用 SaaS 订阅制（Free/Starter/Pro/Business 四级），提供 OBS 浏览器源一键嵌入，实时展示滚动商品条、主推商品卡、促销角标等 Overlay 模板。

## 技术栈
- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5 (strict)
- **UI**: Ant Design 5 + @ant-design/nextjs-registry
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (Drizzle schema → `src/storage/database/`)
- **Auth**: NextAuth.js (Credentials Provider)
- **Payment**: Stripe
- **Realtime**: Supabase Realtime (broadcast channel)

## 目录结构
```
src/
├── app/
│   ├── (auth)/         # 登录、注册、定价页
│   ├── (dashboard)/    # 主控制台（商品/模板/Overlay/直播/分析/设置/账单）
│   ├── api/            # REST API 路由
│   │   ├── auth/       # NextAuth
│   │   ├── products/   # 商品 CRUD
│   │   ├── templates/  # 模板列表
│   │   ├── overlay/    # Overlay 配置与控制
│   │   ├── live/       # 直播控制命令
│   │   ├── analytics/  # 数据分析
│   │   ├── billing/    # Stripe 结账/门户/Webhook
│   │   └── upload/     # 图片上传
│   ├── landing/        # 落地页
│   └── overlay/        # OBS 浏览器源 HTML 渲染端点
├── components/
│   ├── common/         # FeatureGate, PlanBadge, Watermark, AuthProvider
│   ├── dashboard/      # 仪表盘组件
│   ├── product/        # 商品组件
│   ├── template/       # 模板组件
│   ├── overlay/        # Overlay 配置组件
│   ├── live/           # 直播控制组件
│   └── billing/        # 订阅组件
├── lib/                # plan-limits, auth, supabase, stripe, feature-flags
├── services/           # product/template/overlay/live-control 业务逻辑
├── overlay-engine/     # Overlay HTML 渲染引擎
│   ├── templates/      # 10 种模板（basic-ticker, modern-ticker, ...）
│   ├── shared/         # product-loader, animation-utils, supabase-listener
│   ├── registry.ts     # 模板注册表
│   └── builder.ts      # HTML 构建器
├── storage/database/   # Supabase client + Drizzle schema
└── types/              # plan, product, template, overlay, live 类型定义
```

## 构建与测试命令
- `pnpm install` — 安装依赖
- `pnpm dev` — 开发环境启动 (端口 5000)
- `pnpm build` — 生产构建
- `pnpm start` — 生产环境启动
- `pnpm lint --quiet` — ESLint 检查
- `pnpm ts-check` — TypeScript 类型检查

## 代码风格
- 严格 TypeScript，禁止隐式 any
- Ant Design 5 作为主 UI 库，配合 Tailwind CSS 辅助布局
- 所有 API 路由使用 Supabase Client 进行数据库操作
- 类型转换使用 `as unknown as Record<string, unknown>` 双重断言模式

## 订阅计划限制
- Free: 3 商品, 2 模板, 1 Overlay, 有水印
- Starter: 30 商品, 5 模板, 3 Overlay, 无水印
- Pro: 100 商品, 全部模板, 10 Overlay, 直播控制
- Business: 无限商品, 全部功能, 5 店铺, 优先支持

## 数据库 Schema (Supabase)
核心表: users, stores, products, overlays, analytics_events, subscriptions
Schema 文件: `src/storage/database/shared/schema.ts`

## 安全注意事项
- 中间件保护所有 Dashboard 和 API 路由
- Stripe Webhook 验证签名
- Supabase RLS 策略需在生产环境配置
- Overlay 公开端点（OBS 浏览器源）无需认证
