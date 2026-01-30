// Main validator exports

export {
  validateBaseLinkerTemplate,
  extractBaseLinkerVariables,
  validateVariables,
  validateSeznamPolozek,
  VALID_ORDER_TAGS,
  VALID_ITEM_TAGS,
  PARAMETERIZED_TAGS,
} from './baselinker';

export {
  validateTranslationCompleteness,
  validateProductNames,
  validateMarketConfigs,
  validateAllTranslations,
  findMissingTranslations,
} from './translations';

export {
  validateHtmlTemplate,
  validateEmailSize,
  validateRequiredElements,
  validateMsoElements,
  validateInlineStyles,
  validateTableStructure,
  validateImageUrls,
  validateResponsiveStyles,
} from './html';

export type { ValidationResult } from './baselinker';
export type { TranslationValidationResult } from './translations';
export type { HtmlValidationResult } from './html';

// Combined template validation
import { validateBaseLinkerTemplate, ValidationResult } from './baselinker';
import { validateHtmlTemplate, HtmlValidationResult } from './html';

export interface FullValidationResult {
  valid: boolean;
  baselinker: ValidationResult;
  html: HtmlValidationResult;
  allErrors: string[];
  allWarnings: string[];
}

/**
 * Validates a complete email template
 * Combines BaseLinker tag validation with HTML validation
 */
export function validateTemplate(html: string): FullValidationResult {
  const baselinker = validateBaseLinkerTemplate(html);
  const htmlValidation = validateHtmlTemplate(html);

  const allErrors = [...baselinker.errors, ...htmlValidation.errors];
  const allWarnings = [...baselinker.warnings, ...htmlValidation.warnings];

  return {
    valid: baselinker.valid && htmlValidation.valid,
    baselinker,
    html: htmlValidation,
    allErrors,
    allWarnings,
  };
}
