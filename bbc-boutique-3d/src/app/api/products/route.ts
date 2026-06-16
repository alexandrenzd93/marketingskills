import { NextResponse } from 'next/server';
import { getCollectionProducts } from '@/lib/shopify';
import { BRANDS } from '@/lib/brands';
import type { ProductsByBrand } from '@/types/boutique';

export const revalidate = 3600;

export async function GET() {
  const data = await Promise.all(
    BRANDS.map(async (brand) => ({
      id: brand.id,
      products: await getCollectionProducts(brand.shopifyCollection, 4),
    })),
  );

  const products: ProductsByBrand = Object.fromEntries(
    data.map(({ id, products }) => [id, products]),
  );

  return NextResponse.json(products);
}
