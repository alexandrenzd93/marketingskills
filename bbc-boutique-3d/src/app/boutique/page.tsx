import { getCollectionProducts } from '@/lib/shopify';
import { BRANDS } from '@/lib/brands';
import type { ProductsByBrand } from '@/types/boutique';
import BoutiqueClient from './BoutiqueClient';

// Revalidate product data hourly.
export const revalidate = 3600;

export default async function BoutiquePage() {
  // Fetch each créatrice's collection in parallel (server-side).
  const productsData = await Promise.all(
    BRANDS.map(async (brand) => ({
      id: brand.id,
      products: await getCollectionProducts(brand.shopifyCollection, 4),
    })),
  );

  const products: ProductsByBrand = Object.fromEntries(
    productsData.map(({ id, products }) => [id, products]),
  );

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <BoutiqueClient products={products} />
    </main>
  );
}
