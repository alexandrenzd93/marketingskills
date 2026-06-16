'use client';

import { useEffect, useState } from 'react';
import { BRANDS } from '@/lib/brands';
import type { ProductsByBrand } from '@/types/boutique';

/**
 * Client-side fallback fetch. The boutique normally receives products from the
 * server component, but this hook lets standalone client views re-fetch via the
 * internal API route if needed.
 */
export function useShopifyProducts(initial?: ProductsByBrand) {
  const [products, setProducts] = useState<ProductsByBrand>(initial ?? {});
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) return;

    let cancelled = false;
    setLoading(true);

    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: ProductsByBrand) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(String(err));
          // Keep empty shells so the scene still renders placeholders.
          setProducts(Object.fromEntries(BRANDS.map((b) => [b.id, []])));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initial]);

  return { products, loading, error };
}
