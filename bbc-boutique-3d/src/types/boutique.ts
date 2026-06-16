export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyVariant {
  id: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  images: {
    edges: { node: ShopifyImage }[];
  };
  variants: {
    edges: { node: ShopifyVariant }[];
  };
}

export type ProductsByBrand = Record<string, ShopifyProduct[]>;

/** Convenience accessors that tolerate empty Shopify responses. */
export function productImage(p: ShopifyProduct): ShopifyImage | null {
  return p.images?.edges?.[0]?.node ?? null;
}

export function productPrice(p: ShopifyProduct): string {
  const money = p.priceRange?.minVariantPrice;
  if (!money) return '';
  const value = Number(money.amount);
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: money.currencyCode || 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function productUrl(handle: string): string {
  return `https://bleublancouture.fr/products/${handle}`;
}
