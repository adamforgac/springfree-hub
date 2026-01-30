import { describe, it, expect } from 'vitest';
import { generateEmailTemplate } from '../template';
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

describe('Template Integration Tests', () => {
  describe('generate template for each market', () => {
    it.each(ALL_MARKETS)('generates valid template for market: %s', (market) => {
      const products = createTestProducts(market);
      const html = generateEmailTemplate({
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
      const html = generateEmailTemplate({
        market,
        products,
        showPrices: true,
      });

      const result = validateBaseLinkerTemplate(html);

      expect(result.errors).toHaveLength(0);
      expect(result.valid).toBe(true);
    });

    it.each(ALL_MARKETS)('contains required BaseLinker tags for market: %s', (market) => {
      const products = createTestProducts(market);
      const html = generateEmailTemplate({
        market,
        products,
        showPrices: true,
      });

      // Check for essential tags
      expect(html).toContain('[jméno]');
      expect(html).toContain('[číslo_objednávky]');
      expect(html).toContain('[odkaz_na_objednávku]');
      // Product list tag - MUST start with <tr> and end with </tr> (critical for Baselinker!)
      expect(html).toContain('[seznam_položek(<tr>');
      expect(html).toContain('</tr>)]');
      // Product card with dynamic image using [i_sku]
      expect(html).toContain('[i_sku].png');
      expect(html).toContain('[i_name]');
      expect(html).toContain('[i_quantity]');
      expect(html).toContain('[i_price]');
      expect(html).toContain('[i_currency]');
      expect(html).toContain('[cena_za objednávku]');
      expect(html).toContain('[měna]');
    });

    // CRITICAL: These tests prevent the email duplication bug discovered on 2026-01-27
    it.each(ALL_MARKETS)('CRITICAL: no )] sequence in MSO comments for market: %s', (market) => {
      const products = createTestProducts(market);
      const html = generateEmailTemplate({
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
      const html = generateEmailTemplate({
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
      const html = generateEmailTemplate({
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
      const html = generateEmailTemplate({
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
      const html = generateEmailTemplate({
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
    it.each(ALL_MARKETS)('contains market-specific translations for: %s', (market) => {
      const products = createTestProducts(market);
      const translations = TRANSLATIONS[market];
      const html = generateEmailTemplate({
        market,
        products,
        showPrices: true,
      });

      // Check for translated content (some are uppercased for email client compatibility)
      expect(html).toContain(translations.greeting);
      expect(html).toContain(translations.trackOrder);
      expect(html).toContain(translations.yourOrder.toUpperCase());
      expect(html).toContain(translations.totalToPay.toUpperCase());
      expect(html).toContain(translations.upsellTitle.toUpperCase());
    });

    it.each(ALL_MARKETS)('contains market-specific contact info for: %s', (market) => {
      const marketData = MARKETS.find(m => m.code === market)!;
      const products = createTestProducts(market);
      const html = generateEmailTemplate({
        market,
        products,
        showPrices: true,
      });

      expect(html).toContain(marketData.email);
      // Phone number is formatted with &nbsp; for non-breaking spaces
      expect(html).toContain(marketData.phone.replace(/ /g, '&nbsp;'));
      expect(html).toContain(marketData.websiteUrl);
    });

    it.each(ALL_MARKETS)('contains all upsell products for: %s', (market) => {
      const products = createTestProducts(market);
      const html = generateEmailTemplate({
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

  describe('showPrices option', () => {
    it('shows prices when showPrices is true', () => {
      const products = createTestProducts('cs');
      const html = generateEmailTemplate({
        market: 'cs',
        products,
        showPrices: true,
      });

      // Should contain price text
      expect(html).toContain('100 Kč');
    });

    it('hides prices when showPrices is false', () => {
      const products = createTestProducts('cs');
      const html = generateEmailTemplate({
        market: 'cs',
        products,
        showPrices: false,
      });

      // Price element should not be present (prices are conditionally rendered)
      const pricePattern = /100\s*Kč/;
      expect(html).not.toMatch(pricePattern);
    });
  });

  describe('MSO compatibility', () => {
    it.each(ALL_MARKETS)('includes MSO conditionals for Outlook compatibility: %s', (market) => {
      const products = createTestProducts(market);
      const html = generateEmailTemplate({
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
      const html = generateEmailTemplate({
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
      const html = generateEmailTemplate({
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
