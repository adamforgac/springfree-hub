// Translation Validator
// Ensures all translation keys exist for all markets

import { MarketCode } from '../types';
import { TRANSLATIONS, MARKETS } from '../markets';
import { PRODUCT_NAMES, PRODUCT_SKUS } from '../product_dictionary';

export interface TranslationValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// All expected translation keys
const REQUIRED_TRANSLATION_KEYS = [
  'emailTitle',
  'greeting',
  'orderConfirmed',
  'trackOrder',
  'timelineConfirmed',
  'timelineSent',
  'timelineDelivered',
  'yourOrder',
  'totalToPay',
  'deliveryDetails',
  'billingAddress',
  'shippingAddress',
  'payment',
  'shipping',
  'needHelp',
  'needHelpText',
  'upsellTitle',
  'upsellSubtitle',
  'addButton',
  'moreAccessories',
  'copyright',
  'products',
] as const;

// All market codes
const ALL_MARKETS: MarketCode[] = ['cs', 'sk', 'de', 'pl', 'hu', 'sl', 'hr'];

/**
 * Validates that all translation keys exist for all markets
 */
export function validateTranslationCompleteness(): TranslationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const market of ALL_MARKETS) {
    const translations = TRANSLATIONS[market];

    if (!translations) {
      errors.push(`Missing translations for market: ${market}`);
      continue;
    }

    // Check each required key
    for (const key of REQUIRED_TRANSLATION_KEYS) {
      const value = translations[key as keyof typeof translations];

      if (value === undefined) {
        errors.push(`Missing translation key '${key}' for market '${market}'`);
      } else if (typeof value === 'string' && value.trim() === '') {
        errors.push(`Empty translation value for key '${key}' in market '${market}'`);
      }
    }

    // Check products sub-object
    if (translations.products) {
      const upsellSkus = [
        PRODUCT_SKUS.FLEXRHOOP,
        PRODUCT_SKUS.SUNSHADE,
        PRODUCT_SKUS.COVER,
        PRODUCT_SKUS.WHEELS,
      ];

      for (const sku of upsellSkus) {
        if (!translations.products[sku]) {
          errors.push(`Missing product name for SKU '${sku}' in market '${market}'`);
        } else if (translations.products[sku].trim() === '') {
          errors.push(`Empty product name for SKU '${sku}' in market '${market}'`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates product names dictionary consistency
 */
export function validateProductNames(): TranslationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const allSkus = Object.values(PRODUCT_SKUS);

  for (const sku of allSkus) {
    const names = PRODUCT_NAMES[sku];

    if (!names) {
      errors.push(`Missing product names for SKU: ${sku}`);
      continue;
    }

    for (const market of ALL_MARKETS) {
      const name = names[market];

      if (!name) {
        errors.push(`Missing product name for SKU '${sku}' in market '${market}'`);
      } else if (name.trim() === '') {
        errors.push(`Empty product name for SKU '${sku}' in market '${market}'`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Finds missing translations across all markets
 */
export function findMissingTranslations(): Map<MarketCode, string[]> {
  const missing = new Map<MarketCode, string[]>();

  for (const market of ALL_MARKETS) {
    const marketMissing: string[] = [];
    const translations = TRANSLATIONS[market];

    if (!translations) {
      marketMissing.push('ALL (market not defined)');
    } else {
      for (const key of REQUIRED_TRANSLATION_KEYS) {
        const value = translations[key as keyof typeof translations];
        if (value === undefined || (typeof value === 'string' && value.trim() === '')) {
          marketMissing.push(key);
        }
      }
    }

    if (marketMissing.length > 0) {
      missing.set(market, marketMissing);
    }
  }

  return missing;
}

/**
 * Validates all market configurations are complete
 */
export function validateMarketConfigs(): TranslationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredMarketFields = [
    'code', 'name', 'flag', 'currency', 'currencySymbol',
    'language', 'websiteUrl', 'accessoriesUrl', 'email', 'phone'
  ];

  for (const market of MARKETS) {
    for (const field of requiredMarketFields) {
      const value = market[field as keyof typeof market];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors.push(`Missing or empty field '${field}' in market config for '${market.code}'`);
      }
    }

    // Validate URL format
    if (market.websiteUrl && !market.websiteUrl.startsWith('https://')) {
      warnings.push(`Website URL for market '${market.code}' should use HTTPS`);
    }

    if (market.accessoriesUrl && !market.accessoriesUrl.startsWith('https://')) {
      warnings.push(`Accessories URL for market '${market.code}' should use HTTPS`);
    }
  }

  // Check that all expected markets are defined
  for (const marketCode of ALL_MARKETS) {
    if (!MARKETS.find(m => m.code === marketCode)) {
      errors.push(`Missing market configuration for: ${marketCode}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Full translation validation
 */
export function validateAllTranslations(): TranslationValidationResult {
  const results = [
    validateTranslationCompleteness(),
    validateProductNames(),
    validateMarketConfigs(),
  ];

  return {
    valid: results.every(r => r.valid),
    errors: results.flatMap(r => r.errors),
    warnings: results.flatMap(r => r.warnings),
  };
}
