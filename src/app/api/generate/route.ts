import { NextRequest, NextResponse } from 'next/server';
import { generateBankTransferEmailTemplate } from '@/lib/templateBankTransfer';
import { generateOrderConfirmationEmailTemplate } from '@/lib/templateOrderConfirmation';
import { generatePaymentConfirmedEmailTemplate } from '@/lib/templatePaymentConfirmed';
import { MARKETS, TRANSLATIONS, UPSELL_SKUS } from '@/lib/markets';
import { MarketCode } from '@/lib/types';
import { PRODUCT_SKUS } from '@/lib/product_dictionary';
import { validateTemplate } from '@/lib/validators';

export type TemplateType = 'order-confirmation' | 'order-bank-transfer' | 'payment-confirmed';

interface RequestBody {
  market: MarketCode;
  templateType?: TemplateType;
  products?: Array<{
    sku: string;
    prices: Record<string, number>;
  }>;
  showPrices?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { market, templateType = 'order-confirmation', products, showPrices = false } = body;

    if (!market || !MARKETS.find(m => m.code === market)) {
      return NextResponse.json({ error: 'Invalid market' }, { status: 400 });
    }

    const marketData = MARKETS.find(m => m.code === market)!;
    const translations = TRANSLATIONS[market];

    // Build upsell products with correct prices
    const upsellProducts = UPSELL_SKUS.map(sku => {
      const productData = products?.find(p => p.sku === sku);
      const currencyKey = marketData.currency;

      // Get price from Baselinker data or use fallback
      let price = productData?.prices?.[currencyKey] || getDefaultPrice(sku, currencyKey);

      // Format price with currency symbol
      const formattedPrice = formatPrice(price, currencyKey, marketData.currencySymbol);

      // Check if this is a variant product (needs "od" prefix)
      const isVariantProduct = sku === PRODUCT_SKUS.SUNSHADE || sku === PRODUCT_SKUS.COVER;
      const pricePrefix = isVariantProduct ? (market === 'de' ? 'ab ' : market === 'pl' ? 'od ' : 'od ') : '';

      return {
        sku,
        name: translations.products[sku] || sku,
        price: formattedPrice,
        pricePrefix,
        link: '', // Will be filled by template generator
      };
    });

    // Generate HTML based on template type
    const templateData = {
      market,
      products: upsellProducts,
      showPrices,
    };

    let html: string;
    switch (templateType) {
      case 'order-confirmation':
        html = generateOrderConfirmationEmailTemplate(templateData);
        break;
      case 'order-bank-transfer':
        html = generateBankTransferEmailTemplate(templateData);
        break;
      case 'payment-confirmed':
        html = generatePaymentConfirmedEmailTemplate(templateData);
        break;
      default:
        html = generateOrderConfirmationEmailTemplate(templateData);
        break;
    }

    // Minify for Baselinker - keep it simple to avoid breaking tag syntax
    const minified = html
      .replace(/\n/g, '')
      .replace(/\s{2,}/g, ' ');

    // Validate template before returning
    const validationResult = validateTemplate(minified);

    if (!validationResult.valid) {
      return NextResponse.json({
        error: 'Template validation failed',
        validationErrors: validationResult.allErrors,
        validationWarnings: validationResult.allWarnings,
      }, { status: 400 });
    }

    return NextResponse.json({
      html: minified,
      size: minified.length,
      market,
      templateType,
      validation: {
        valid: true,
        warnings: validationResult.allWarnings,
      },
    });

  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getDefaultPrice(sku: string, currency: string): number {
  const prices: Record<string, Record<string, number>> = {
    [PRODUCT_SKUS.FLEXRHOOP]: { CZK: 4490, EUR: 179, PLN: 799 },
    [PRODUCT_SKUS.SUNSHADE]: { CZK: 3790, EUR: 149, PLN: 679 },
    [PRODUCT_SKUS.COVER]: { CZK: 3490, EUR: 139, PLN: 629 },
    [PRODUCT_SKUS.WHEELS]: { CZK: 2490, EUR: 99, PLN: 449 },
  };
  return prices[sku]?.[currency] || 0;
}

function formatPrice(price: number, currency: string, symbol: string): string {
  if (currency === 'CZK') {
    return `${price.toLocaleString('cs-CZ')} ${symbol}`;
  } else if (currency === 'PLN') {
    return `${price.toLocaleString('pl-PL')} ${symbol}`;
  } else {
    return `${price.toLocaleString('de-DE')} ${symbol}`;
  }
}
