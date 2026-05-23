// src/services/product.service.ts

import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { PlanType } from '@/types/plan';
import { isWithinLimit } from '@/lib/plan-limits';

export async function getProducts(storeId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`查询商品失败: ${error.message}`);
  return data;
}

export async function createProduct(
  storeId: string,
  productData: {
    name: string;
    price: string;
    original_price?: string;
    description?: string;
    images?: string;
    tag?: string;
    category?: string;
    buy_url?: string;
  },
  planType: PlanType
) {
  const supabase = getSupabaseClient();

  // Check limit
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', storeId)
    .eq('is_active', true);

  if (countError) throw new Error(`统计商品失败: ${countError.message}`);
  if (!isWithinLimit(planType, 'maxProducts', count || 0)) {
    throw new Error('商品数量已达上限，请升级计划');
  }

  const { data, error } = await supabase
    .from('products')
    .insert({ store_id: storeId, ...productData })
    .select()
    .single();

  if (error) throw new Error(`创建商品失败: ${error.message}`);
  return data;
}

export async function updateProduct(id: string, updates: Record<string, unknown>) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`更新商品失败: ${error.message}`);
  return data;
}

export async function deleteProduct(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw new Error(`删除商品失败: ${error.message}`);
}
