// src/types/product.ts

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: string;
  original_price: string | null;
  currency: string;
  images: string; // JSON string of string[]
  tag: string | null;
  category: string | null;
  buy_url: string | null;
  is_active: boolean;
  sort_order: number;
  source: string;
  source_id: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  images?: string[];
  tag?: string;
  category?: string;
  buyUrl?: string;
}

export interface OverlayProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  tag?: string;
  buyUrl?: string;
}
