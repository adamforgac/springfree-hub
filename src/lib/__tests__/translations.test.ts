import { describe, it, expect } from 'vitest';
import {
  validateTranslationCompleteness,
  validateProductNames,
  validateMarketConfigs,
  validateAllTranslations,
  findMissingTranslations,
} from '../validators/translations';
import { TRANSLATIONS, MARKETS } from '../markets';
import { PRODUCT_NAMES, PRODUCT_SKUS } from '../product_dictionary';
import { MarketCode } from '../types';

const ALL_MARKETS: MarketCode[] = ['cs', 'sk', 'de', 'pl', 'hu', 'sl', 'hr'];

describe('Translation Validator', () => {
  describe('validateTranslationCompleteness', () => {
    it('validates all markets have translations', () => {
      const result = validateTranslationCompleteness();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('all 7 markets are defined', () => {
      for (const market of ALL_MARKETS) {
        expect(TRANSLATIONS[market]).toBeDefined();
      }
    });

    it('all required keys exist for each market', () => {
      const requiredKeys = [
        'emailTitle', 'greeting', 'orderConfirmed', 'trackOrder',
        'timelineConfirmed', 'timelineSent', 'timelineDelivered',
        'yourOrder', 'totalToPay', 'deliveryDetails', 'billingAddress',
        'shippingAddress', 'payment', 'shipping', 'needHelp', 'needHelpText',
        'upsellTitle', 'upsellSubtitle', 'addButton', 'moreAccessories',
        'copyright', 'products',
      ];

      for (const market of ALL_MARKETS) {
        const translations = TRANSLATIONS[market];

        for (const key of requiredKeys) {
          const value = translations[key as keyof typeof translations];
          expect(value, `Missing '${key}' for market '${market}'`).toBeDefined();
        }
      }
    });

    it('no translation has empty string value', () => {
      const result = validateTranslationCompleteness();

      // Filter out any empty string errors
      const emptyErrors = result.errors.filter(e => e.includes('Empty'));
      expect(emptyErrors).toHaveLength(0);
    });
  });

  describe('validateProductNames', () => {
    it('validates all product names exist', () => {
      const result = validateProductNames();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('all products have names for all markets', () => {
      const skus = Object.values(PRODUCT_SKUS);

      for (const sku of skus) {
        for (const market of ALL_MARKETS) {
          const name = PRODUCT_NAMES[sku]?.[market];
          expect(name, `Missing name for SKU '${sku}' in market '${market}'`).toBeDefined();
          expect(name.trim().length, `Empty name for SKU '${sku}' in market '${market}'`).toBeGreaterThan(0);
        }
      }
    });

    it('product names in TRANSLATIONS match PRODUCT_NAMES', () => {
      for (const market of ALL_MARKETS) {
        const translations = TRANSLATIONS[market];

        for (const sku of Object.values(PRODUCT_SKUS)) {
          const translationName = translations.products[sku];
          const dictionaryName = PRODUCT_NAMES[sku][market];

          expect(translationName).toBe(dictionaryName);
        }
      }
    });
  });

  describe('validateMarketConfigs', () => {
    it('validates all market configurations are complete', () => {
      const result = validateMarketConfigs();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('all markets have required fields', () => {
      const requiredFields = [
        'code', 'name', 'flag', 'currency', 'currencySymbol',
        'language', 'websiteUrl', 'accessoriesUrl', 'email', 'phone',
      ];

      for (const market of MARKETS) {
        for (const field of requiredFields) {
          const value = market[field as keyof typeof market];
          expect(value, `Missing '${field}' in market '${market.code}'`).toBeDefined();
          expect(String(value).trim().length).toBeGreaterThan(0);
        }
      }
    });

    it('all website URLs use HTTPS', () => {
      for (const market of MARKETS) {
        expect(market.websiteUrl).toMatch(/^https:\/\//);
        expect(market.accessoriesUrl).toMatch(/^https:\/\//);
      }
    });

    it('all 7 market codes are configured', () => {
      const configuredCodes = MARKETS.map(m => m.code);

      for (const marketCode of ALL_MARKETS) {
        expect(configuredCodes).toContain(marketCode);
      }
    });
  });

  describe('findMissingTranslations', () => {
    it('returns empty map when no translations are missing', () => {
      const missing = findMissingTranslations();

      expect(missing.size).toBe(0);
    });
  });

  describe('validateAllTranslations', () => {
    it('validates all translations pass', () => {
      const result = validateAllTranslations();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('market-specific validations', () => {
    it('CS market translations are in Czech', () => {
      const cs = TRANSLATIONS.cs;
      expect(cs.greeting).toContain('Děkujeme');
      expect(cs.trackOrder).toBe('Sledovat stav');
    });

    it('SK market translations are in Slovak', () => {
      const sk = TRANSLATIONS.sk;
      expect(sk.greeting).toContain('Ďakujeme');
      expect(sk.trackOrder).toBe('Sledovať stav');
    });

    it('DE market translations are in German', () => {
      const de = TRANSLATIONS.de;
      expect(de.greeting).toContain('Vielen Dank');
      expect(de.trackOrder).toBe('Status verfolgen');
    });

    it('PL market translations are in Polish', () => {
      const pl = TRANSLATIONS.pl;
      expect(pl.greeting).toContain('Dziękujemy');
      expect(pl.trackOrder).toBe('Śledź status');
    });

    it('HU market translations are in Hungarian', () => {
      const hu = TRANSLATIONS.hu;
      expect(hu.greeting).toContain('Köszönjük');
      expect(hu.trackOrder).toBe('Állapot követése');
    });

    it('SL market translations are in Slovenian', () => {
      const sl = TRANSLATIONS.sl;
      expect(sl.greeting).toContain('Hvala');
      expect(sl.trackOrder).toBe('Sledite statusu');
    });

    it('HR market translations are in Croatian', () => {
      const hr = TRANSLATIONS.hr;
      expect(hr.greeting).toContain('Hvala');
      expect(hr.trackOrder).toBe('Pratite status');
    });
  });

  describe('currency configuration', () => {
    it('CS market uses CZK', () => {
      const cs = MARKETS.find(m => m.code === 'cs');
      expect(cs?.currency).toBe('CZK');
      expect(cs?.currencySymbol).toBe('Kč');
    });

    it('PL market uses PLN', () => {
      const pl = MARKETS.find(m => m.code === 'pl');
      expect(pl?.currency).toBe('PLN');
      expect(pl?.currencySymbol).toBe('zł');
    });

    it('DE/SK/HU/SL/HR markets use EUR', () => {
      const euroMarkets = ['de', 'sk', 'hu', 'sl', 'hr'];

      for (const code of euroMarkets) {
        const market = MARKETS.find(m => m.code === code);
        expect(market?.currency, `Market ${code} should use EUR`).toBe('EUR');
        expect(market?.currencySymbol).toBe('€');
      }
    });
  });
});
