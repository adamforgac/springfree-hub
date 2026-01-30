import { NextRequest, NextResponse } from 'next/server';
import { PRODUCT_SKUS, PRODUCT_NAMES } from '@/lib/product_dictionary';
import { UPSELL_SKUS } from '@/lib/markets';

const BASELINKER_API_URL = 'https://api.baselinker.com/connector.php';
const API_KEY = process.env.BASELINKER_API_KEY;

interface BaselinkerProduct {
  sku: string;
  name: string;
  prices: Record<string, number>;
}

export async function GET(request: NextRequest) {
  // Always return fallback data if API key is not configured, don't error out
  if (!API_KEY) {
    console.warn('Baselinker API key not configured, using fallback data');
    return NextResponse.json({
      products: getFallbackProducts(),
      source: 'fallback',
      message: 'API key missing',
    });
  }

  try {
    // Get inventory ID first
    const inventoriesResponse = await fetch(BASELINKER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${API_KEY}&method=getInventories`,
    });

    const inventoriesData = await inventoriesResponse.json();
    
    if (inventoriesData.status !== 'SUCCESS') {
      throw new Error(`Baselinker error: ${inventoriesData.error_message || 'Unknown error'}`);
    }

    const inventories = inventoriesData.inventories || [];
    if (inventories.length === 0) {
      // Fallback if no inventory found
      return NextResponse.json({
        products: getFallbackProducts(),
        source: 'fallback',
        error: 'No inventories found',
      });
    }

    const inventoryId = inventories[0].inventory_id;

    // Get products by SKU
    const productsResponse = await fetch(BASELINKER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${API_KEY}&method=getInventoryProductsList&parameters=${JSON.stringify({
        inventory_id: inventoryId,
        filter_sku: UPSELL_SKUS.join(','),
      })}`,
    });

    const productsData = await productsResponse.json();

    if (productsData.status !== 'SUCCESS') {
      throw new Error(`Baselinker error: ${productsData.error_message || 'Unknown error'}`);
    }

    // Get product IDs for detailed data
    const productIds = Object.keys(productsData.products || {});

    if (productIds.length === 0) {
      return NextResponse.json({
        products: getFallbackProducts(),
        source: 'fallback',
        error: 'Products not found in Baselinker',
      });
    }

    // Get detailed product data with prices
    const detailsResponse = await fetch(BASELINKER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${API_KEY}&method=getInventoryProductsData&parameters=${JSON.stringify({
        inventory_id: inventoryId,
        products: productIds.map(id => parseInt(id)),
      })}`,
    });

    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'SUCCESS') {
      throw new Error(`Baselinker error: ${detailsData.error_message || 'Unknown error'}`);
    }

    // Transform to our format
    const products: BaselinkerProduct[] = [];
    
    for (const [productId, product] of Object.entries(detailsData.products || {})) {
      const p = product as any;
      products.push({
        sku: p.sku || '',
        name: p.text_fields?.name || p.name || '',
        prices: p.prices || {},
      });
    }

    return NextResponse.json({
      products,
      source: 'baselinker',
    });

  } catch (error) {
    console.error('Baselinker API error:', error);
    
    // Return fallback data on error
    return NextResponse.json({
      products: getFallbackProducts(),
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

function getFallbackProducts() {
  return UPSELL_SKUS.map(sku => ({
    sku,
    name: getProductNameFallback(sku),
    prices: getDefaultPrices(sku),
  }));
}

function getProductNameFallback(sku: string): string {
  // Use Czech names as default
  // cast sku to keyof PRODUCT_NAMES to satisfy TS if possible, or just look up
  // Since sku is string, we access safely
  const names = PRODUCT_NAMES[sku as keyof typeof PRODUCT_NAMES];
  return names?.['cs'] || sku;
}

function getDefaultPrices(sku: string): Record<string, number> {
  const prices: Record<string, Record<string, number>> = {
    [PRODUCT_SKUS.FLEXRHOOP]: { CZK: 4490, EUR: 179, PLN: 799 },
    [PRODUCT_SKUS.SUNSHADE]: { CZK: 3790, EUR: 149, PLN: 679 },
    [PRODUCT_SKUS.COVER]: { CZK: 3490, EUR: 139, PLN: 629 },
    [PRODUCT_SKUS.WHEELS]: { CZK: 2490, EUR: 99, PLN: 449 },
  };
  return prices[sku] || { CZK: 0, EUR: 0, PLN: 0 };
}
