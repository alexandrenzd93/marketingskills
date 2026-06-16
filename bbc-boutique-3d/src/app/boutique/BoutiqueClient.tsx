'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import BoutiqueScene from '@/components/boutique/BoutiqueScene';
import EntryOverlay from '@/components/ui/EntryOverlay';
import LoadingScreen from '@/components/ui/LoadingScreen';
import BrandStrip from '@/components/ui/BrandStrip';
import NavigationDots from '@/components/ui/NavigationDots';
import ProductPopup from '@/components/ui/ProductPopup';
import { getBrand, type Brand, type BrandId } from '@/lib/brands';
import type { ProductsByBrand, ShopifyProduct } from '@/types/boutique';

interface Props {
  products: ProductsByBrand;
}

interface Selection {
  product: ShopifyProduct;
  brand: Brand;
}

export default function BoutiqueClient({ products }: Props) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [entered, setEntered] = useState(false);
  const [activeBrand, setActiveBrand] = useState<BrandId | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);

  // Fake-but-smooth load progress, then reveal the entry door.
  useEffect(() => {
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + Math.random() * 18 + 6);
      setProgress(p);
      if (p >= 100) {
        clearInterval(t);
        setTimeout(() => setLoading(false), 500);
      }
    }, 220);
    return () => clearInterval(t);
  }, []);

  const handleProductClick = useCallback((product: ShopifyProduct, brand: Brand) => {
    setSelection({ product, brand });
  }, []);

  const handleBrandChange = useCallback((id: BrandId) => {
    setActiveBrand(id);
  }, []);

  // Clicking a nav dot dispatches a target the scene can fly toward.
  const flyTarget = useRef<BrandId | null>(null);
  const handleNavSelect = useCallback((id: BrandId) => {
    flyTarget.current = id;
    setActiveBrand(id);
    window.dispatchEvent(new CustomEvent('bbc:flyto', { detail: id }));
  }, []);

  const selectedBrand = selection?.brand ?? null;

  return (
    <>
      <LoadingScreen visible={loading} progress={progress} />
      {!loading && <EntryOverlay visible={!entered} onEnter={() => setEntered(true)} />}

      <BoutiqueScene
        products={products}
        onProductClick={handleProductClick}
        onBrandChange={handleBrandChange}
      />

      {entered && (
        <>
          <BrandStrip activeBrand={activeBrand} />
          <NavigationDots activeBrand={activeBrand} onSelect={handleNavSelect} />
        </>
      )}

      <ProductPopup
        product={selection?.product ?? null}
        brand={selectedBrand ?? (activeBrand ? getBrand(activeBrand) ?? null : null)}
        onClose={() => setSelection(null)}
      />
    </>
  );
}
