// src/hooks/useStore.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Store {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  currency: string;
  language: string;
}

export function useStore() {
  const { data: session, status } = useSession();
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStores = useCallback(async () => {
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/stores');
      const data = await res.json();
      if (res.ok && data.stores) {
        setStores(data.stores);
        setCurrentStore(data.currentStore || data.stores[0] || null);
      }
    } catch {
      // 静默处理
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return {
    stores,
    currentStore,
    storeId: currentStore?.id || '',
    loading,
    storeName: currentStore?.name || '',
    refreshStores: fetchStores,
    refreshStore: fetchStores,
  };
}
