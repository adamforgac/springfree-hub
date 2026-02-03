import { describe, it, expect } from 'vitest';
import { generateOrderConfirmationEmailTemplate } from '../templateOrderConfirmation';
import { generateBankTransferEmailTemplate } from '../templateBankTransfer';
import { generatePaymentConfirmedEmailTemplate } from '../templatePaymentConfirmed';
import { validateTemplate } from '../validators';
import { validateBaseLinkerTemplate } from '../validators/baselinker';
import { validateHtmlTemplate } from '../validators/html';
import { MARKETS, TRANSLATIONS, UPSELL_SKUS } from '../markets';
import { MarketCode } from '../types';
import { PRODUCT_SKUS } from '../product_dictionary';

const ALL_MARKETS: MarketCode[] = ['cs', 'sk', 'de', 'pl', 'hu', 'sl', 'hr'];

// Helper to generate test products for a market
function createTestProducts(market: MarketCode) {
  const marketData = MARKETS.find(m => m.code === market)!;
  const translations = TRANSLATIONS[market];

  return UPSELL_SKUS.map(sku => ({
    sku,
    name: translations.products[sku],
    price: '100 ' + marketData.currencySymbol,
    pricePrefix: sku === PRODUCT_SKUS.SUNSHADE || sku === PRODUCT_SKUS.COVER ? 'od ' : '',
    link: `${marketData.websiteUrl}/product/${sku}`,
  }));
}

// Test all three templates
const TEMPLATE_GENERATORS = [
  { name: 'Order Confirmation', generator: generateOrderConfirmationEmailTemplate },
  { name: 'Bank Transfer', generator: generateBankTransferEmailTemplate },
  { name: 'Payment Confirmed', generator: generatePaymentConfirmedEmailTemplate },
] as const;

describe('Template Integration Tests', () => {
  describe.each(TEMPLATE_GENERATORS)('$name template', ({ generator }) => {
    describe('generate template for each market', () => {
      it.each(ALL_MARKETS)('generates valid template for market: %s', (market) => {
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        // Template should be generated
        expect(html).toBeDefined();
        expect(html.length).toBeGreaterThan(0);

        // Should contain DOCTYPE
        expect(html).toContain('<!DOCTYPE html>');

        // Should contain market-specific lang attribute
        expect(html).toContain(`lang="${market}"`);
      });
    });

    describe('BaseLinker validation for each market', () => {
      it.each(ALL_MARKETS)('validates BaseLinker tags for market: %s', (market) => {
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        const result = validateBaseLinkerTemplate(html);

        expect(result.errors).toHaveLength(0);
        expect(result.valid).toBe(true);
      });

      // CRITICAL: These tests prevent the email duplication bug discovered on 2026-01-27
      it.each(ALL_MARKETS)('CRITICAL: no )] sequence in MSO comments for market: %s', (market) => {
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        // MSO comments must NOT contain )] - it breaks [seznam_položek()] tag!
        // Use <!--[if mso]> instead of <!--[if (gte mso 9)|(IE)]>
        expect(html).not.toContain('(IE)]>');
        expect(html).not.toContain('(IE)]');
      });

      it.each(ALL_MARKETS)('CRITICAL: only one )] sequence in template for market: %s', (market) => {
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        // Count occurrences of )] - should be exactly 1 (closing the seznam_položek tag)
        const matches = html.match(/\)\]/g) || [];
        expect(matches.length).toBe(1);
      });
    });

    describe('HTML validation for each market', () => {
      it.each(ALL_MARKETS)('validates HTML structure for market: %s', (market) => {
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        const result = validateHtmlTemplate(html);

        // Should pass critical validations
        expect(result.errors).toHaveLength(0);
        expect(result.valid).toBe(true);
      });

      it.each(ALL_MARKETS)('stays under 25,000 character limit for market: %s', (market) => {
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        // Baselinker limit is 25,000 CHARACTERS (not bytes!)
        const charCount = html.length;
        expect(charCount).toBeLessThan(25000);
      });
    });

    describe('full template validation', () => {
      it.each(ALL_MARKETS)('full validation passes for market: %s', (market) => {
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        const result = validateTemplate(html);

        expect(result.valid).toBe(true);
        expect(result.allErrors).toHaveLength(0);
      });
    });

    describe('template content validation', () => {
      it.each(ALL_MARKETS)('contains market-specific contact info for: %s', (market) => {
        const marketData = MARKETS.find(m => m.code === market)!;
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        expect(html).toContain(marketData.email);
        expect(html).toContain(marketData.websiteUrl);
      });

      it.each(ALL_MARKETS)('contains all upsell products for: %s', (market) => {
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        for (const product of products) {
          expect(html).toContain(product.name);
          expect(html).toContain(product.sku);
        }
      });
    });

    describe('MSO compatibility', () => {
      it.each(ALL_MARKETS)('includes MSO conditionals for Outlook compatibility: %s', (market) => {
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        expect(html).toContain('<!--[if mso]>');
        expect(html).toContain('<![endif]-->');
        expect(html).toContain('o:OfficeDocumentSettings');
      });
    });

    describe('responsive design', () => {
      it.each(ALL_MARKETS)('includes responsive CSS for: %s', (market) => {
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        expect(html).toContain('@media');
        expect(html).toContain('max-width:600px');
        expect(html).toContain('mobile-');
      });
    });

    describe('image URLs', () => {
      it.each(ALL_MARKETS)('uses correct image hosting domain for: %s', (market) => {
        const products = createTestProducts(market);
        const html = generator({
          market,
          products,
          showPrices: true,
        });

        // All static images should use jumpsafe.eu domain
        const imgMatches = html.match(/src="([^"]+)"/g) || [];
        const staticImages = imgMatches.filter(src => !src.includes('[i_sku]'));

        for (const src of staticImages) {
          if (src.includes('http')) {
            expect(src).toContain('jumpsafe.eu/mail-images/');
          }
        }
      });
    });
  });

  // Template-specific tests for Order Confirmation
  describe('Order Confirmation specific tests', () => {
    it.each(ALL_MARKETS)('contains essential Baselinker tags for: %s', (market) => {
      const products = createTestProducts(market);
      const html = generateOrderConfirmationEmailTemplate({
        market,
        products,
        showPrices: true,
      });

      // Check for essential tags
      expect(html).toContain('[jméno]');
      expect(html).toContain('[číslo_objednávky]');
      // Product list tag
      expect(html).toContain('[seznam_položek(');
      expect(html).toContain('[i_name]');
      expect(html).toContain('[i_quantity]');
      expect(html).toContain('[i_price]');
      expect(html).toContain('[cena_za objednávku]');
      expect(html).toContain('[měna]');
    });
  });

  // Template-specific tests for Bank Transfer
  describe('Bank Transfer specific tests', () => {
    it.each(ALL_MARKETS)('contains essential tags for: %s', (market) => {
      const products = createTestProducts(market);
      const html = generateBankTransferEmailTemplate({
        market,
        products,
        showPrices: true,
      });

      // Should contain essential Baselinker tags
      expect(html).toContain('[jméno]');
      expect(html).toContain('[číslo_objednávky]');
      expect(html).toContain('[cena_za objednávku]');
      expect(html).toContain('[měna]');
    });
  });

  // Template-specific tests for Payment Confirmed
  describe('Payment Confirmed specific tests', () => {
    it.each(ALL_MARKETS)('contains essential tags for: %s', (market) => {
      const products = createTestProducts(market);
      const html = generatePaymentConfirmedEmailTemplate({
        market,
        products,
        showPrices: true,
      });

      // Should contain essential Baselinker tags
      expect(html).toContain('[jméno]');
      expect(html).toContain('[číslo_objednávky]');
      expect(html).toContain('[cena_za objednávku]');
      expect(html).toContain('[měna]');
    });
  });
});
