import { pgTable, varchar, text, timestamp, boolean, integer, numeric, index, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// System table - DO NOT DELETE
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Users table
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 128 }),
  image: text("image"),
  authProvider: varchar("auth_provider", { length: 50 }).notNull().default("email"),
  authProviderId: varchar("auth_provider_id", { length: 255 }),
  planType: varchar("plan_type", { length: 20 }).notNull().default("free"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).unique(),
  subscriptionStatus: varchar("subscription_status", { length: 20 }).notNull().default("active"),
  subscriptionEndAt: timestamp("subscription_end_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Stores table
export const stores = pgTable("stores", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  ownerId: varchar("owner_id", { length: 36 }).notNull().references(() => users.id),
  logoUrl: text("logo_url"),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  language: varchar("language", { length: 10 }).notNull().default("en"),
  brandPrimaryColor: varchar("brand_primary_color", { length: 20 }).default("#6366f1"),
  brandFontFamily: varchar("brand_font_family", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("stores_owner_id_idx").on(table.ownerId),
]);

// Store Members table
export const storeMembers = pgTable("store_members", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  storeId: varchar("store_id", { length: 36 }).notNull().references(() => stores.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  role: varchar("role", { length: 20 }).notNull().default("viewer"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("store_members_store_id_idx").on(table.storeId),
  index("store_members_user_id_idx").on(table.userId),
]);

// Products table
export const products = pgTable("products", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  storeId: varchar("store_id", { length: 36 }).notNull().references(() => stores.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  images: text("images").notNull().default("[]"),
  tag: varchar("tag", { length: 50 }),
  category: varchar("category", { length: 100 }),
  buyUrl: text("buy_url"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  source: varchar("source", { length: 20 }).notNull().default("manual"),
  sourceId: varchar("source_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("products_store_id_idx").on(table.storeId),
  index("products_store_active_idx").on(table.storeId, table.isActive),
]);

// Overlays table
export const overlays = pgTable("overlays", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  storeId: varchar("store_id", { length: 36 }).notNull().references(() => stores.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  templateId: varchar("template_id", { length: 100 }).notNull(),
  componentType: varchar("component_type", { length: 50 }).notNull(),
  config: text("config").notNull().default("{}"),
  productIds: text("product_ids").notNull().default("[]"),
  showAllProducts: boolean("show_all_products").notNull().default(false),
  positionX: integer("position_x").notNull().default(0),
  positionY: integer("position_y").notNull().default(0),
  width: integer("width").notNull().default(1920),
  height: integer("height").notNull().default(120),
  orientation: varchar("orientation", { length: 20 }).notNull().default("horizontal"),
  isVisible: boolean("is_visible").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  highlightedProductId: varchar("highlighted_product_id", { length: 36 }),
  overlayUrl: text("overlay_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("overlays_store_id_idx").on(table.storeId),
  index("overlays_store_active_idx").on(table.storeId, table.isActive),
]);

// Live Sessions table
export const liveSessions = pgTable("live_sessions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  storeId: varchar("store_id", { length: 36 }).notNull().references(() => stores.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }),
  platform: varchar("platform", { length: 20 }).notNull().default("facebook"),
  startTime: timestamp("start_time", { withTimezone: true }).notNull().defaultNow(),
  endTime: timestamp("end_time", { withTimezone: true }),
  duration: integer("duration"),
  peakViewers: integer("peak_viewers").notNull().default(0),
  totalInteractions: integer("total_interactions").notNull().default(0),
  productStats: text("product_stats").notNull().default("{}"),
  overlayIds: text("overlay_ids").notNull().default("[]"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("live_sessions_store_id_idx").on(table.storeId),
  index("live_sessions_start_time_idx").on(table.startTime),
]);

// Product Interactions table
export const productInteractions = pgTable("product_interactions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  storeId: varchar("store_id", { length: 36 }).notNull(),
  productId: varchar("product_id", { length: 36 }).notNull().references(() => products.id),
  liveSessionId: varchar("live_session_id", { length: 36 }).references(() => liveSessions.id),
  interactionType: varchar("interaction_type", { length: 50 }).notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
  duration: integer("duration"),
}, (table) => [
  index("product_interactions_store_id_idx").on(table.storeId),
  index("product_interactions_product_id_idx").on(table.productId),
]);
