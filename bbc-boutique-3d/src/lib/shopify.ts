import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import type { ShopifyProduct } from '@/types/boutique';

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const publicAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

/**
 * The client is only created when credentials exist so the app can render the
 * 3D boutique (with placeholder garments) even before Shopify is wired up.
 */
export const shopifyClient =
  storeDomain && publicAccessToken
    ? createStorefrontApiClient({
        storeDomain,
        apiVersion: '2024-10',
        publicAccessToken,
      })
    : null;

const COLLECTION_QUERY = /* GraphQL */ `
  query CollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      title
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                  quantityAvailable
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCollectionProducts(
  handle: string,
  limit = 4,
): Promise<ShopifyProduct[]> {
  if (!shopifyClient) {
    // No credentials configured — boutique falls back to placeholder garments.
    return [];
  }

  try {
    const { data, errors } = await shopifyClient.request(COLLECTION_QUERY, {
      variables: { handle, first: limit },
    });

    if (errors) {
      console.warn(`[shopify] errors for "${handle}":`, errors);
    }

    return (
      data?.collection?.products?.edges?.map(
        (e: { node: ShopifyProduct }) => e.node,
      ) ?? []
    );
  } catch (err) {
    console.warn(`[shopify] failed to fetch "${handle}":`, err);
    return [];
  }
}
