// BaseLinker Variable Validator
// Validates that email templates only use documented BaseLinker tags

// Valid order-level tags (from docs/BASELINKER_TAGS_REFERENCE.md)
export const VALID_ORDER_TAGS = new Set([
  // Order Tags
  'status', 'status_name_short', 'status_name', 'název_zdroje', 'datum objednávky',
  'status_date', 'způsob platby', 'payment_id', 'status_payment', 'uhrazená suma',
  'nezaplacená částka', 'cena_za objednávku', 'items_price', 'měna', 'položky_váha',
  'další_pole_1', 'další_pole_2', 'i__o_97218', 'client_comments', 'sell_comments',
  'číslo_objednávky', 'číslo_objednávky_obchod', 'číslo_objednávky_zdroj',
  'číslo_objednávky_zdroj_2', 'číslo_objednávky_warehouse', 'order_aa_last_error',
  'order_hash', 'odkaz_na_objednávku', 'odkaz_na_objednávku_68172', 'products_photo_link',

  // Client Tags
  'e-mail', 'telefon', 'jméno a příjmení', 'jméno', 'příjmení', 'společnost',
  'adresa', 'poštovní směrovací číslo', 'město', 'stát', 'země', 'country_en',
  'country_de', 'client_login',

  // Product Tags
  'items_count', 'items_list', 'items_list2', 'items_list3', 'seznam_položek4',
  'items_list_sku', 'items_list_sku2', 'items_list_missing', 'items_list_missing2',
  'items_list_picked', 'items_list_packed', 'products_sku', 'seznam aukcí',

  // Invoice Tags
  'název_faktury_a_příjmení', 'číslo faktury', 'fakturační adresa',
  'faktura_postal_code', 'faktura_city', 'invoice_state', 'faktura_země',
  'faktura_firma', 'faktura_vat_reg_no', 'externí_číslo_faktury', 'invoice_deadline',
  'invoice_deadline_days', 'days_of_deferred_payment', 'invoice_gov_id',
  'invoice_gov_date', 'invoice_gov_status', 'client_want_invoice', 'proforma_number',
  'opravné_číslo', 'corrections_numbers', 'číslo účtenky', 'payment_link',
  'faktura_odkaz', 'opravný_odkaz', 'příjem_odkaz',

  // Delivery Tags
  'cena_zásilky', 'metoda_zásilky', 'číslo zásilky', 'shipment_number_oldest',
  'číslo_ zásilky', 'shipment_track_link', 'shipment_track_link_oldest',
  'shipment_track_link_en', 'shipment_track_link_all', 'shipment_track_link_all2',
  'shipment_track_link_all_en', 'shipment_track_link_all_en2', 'shipment_courier',
  'místo vyzvednutí', 'pickup_point_name', 'pickup_point_address',
  'pickup_point_postal_code', 'pickup_point_city', 'pickup_point_id',

  // Other Tags
  'jméno_profilu', 'aktuální čas', 'dnešní datum',
]);

// Valid item-level tags (used inside [items_list(...)] or [seznam_položek(...)])
export const VALID_ITEM_TAGS = new Set([
  'i_ord', 'i_id', 'i_variant_id', 'i_sku', 'i_ean', 'p_location',
  'i_name', 'i_quantity', 'i_atributy', 'i_price', 'i_currency',
  'i_auction_nr', 'i_source', 'p_stop',
]);

// Tags that take parameters (function-style tags)
// Both English (items_list) and Czech (seznam_položek) versions are valid
export const PARAMETERIZED_TAGS = new Set([
  'items_list',
  'seznam_položek',
  'vypočítat',
]);

// Patterns to ignore (not BaseLinker tags)
// These are MSO conditional comments, CSS selectors, etc.
const IGNORE_PATTERNS = [
  /^if\s/,           // [if mso], [if !mso], etc. (MSO conditionals)
  /^endif/,          // [endif] (MSO conditional end)
  /^x-apple-/,       // CSS selectors like [x-apple-data-detectors]
  /^mso/,            // MSO-related patterns
  /^-webkit-/,       // Webkit CSS selectors
  /^-moz-/,          // Firefox CSS selectors
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  extractedTags: string[];
}

/**
 * Extracts all BaseLinker variables from HTML
 * Handles both simple [tag] and parameterized [tag(content)] formats
 */
export function extractBaseLinkerVariables(html: string): string[] {
  const tags: string[] = [];

  // Match simple tags: [tag_name]
  const simpleTagRegex = /\[([^\[\]()]+)\]/g;
  let match;

  while ((match = simpleTagRegex.exec(html)) !== null) {
    tags.push(match[1]);
  }

  // Match parameterized tags: [tag_name(content)]
  const parameterizedTagRegex = /\[([a-zA-Z_áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+)\(/g;

  while ((match = parameterizedTagRegex.exec(html)) !== null) {
    tags.push(match[1]);
  }

  return [...new Set(tags)];
}

/**
 * Extracts the content inside [seznam_položek(...)] tag
 */
export function extractSeznamPolozekContent(html: string): string | null {
  // Find [seznam_položek(CONTENT)]
  const match = html.match(/\[seznam_položek\(([\s\S]*?)\)\]/);
  return match ? match[1] : null;
}

/**
 * Checks if a tag should be ignored (not a BaseLinker tag)
 */
function shouldIgnoreTag(tag: string): boolean {
  return IGNORE_PATTERNS.some(pattern => pattern.test(tag));
}

/**
 * Validates that all extracted variables are documented BaseLinker tags
 */
export function validateVariables(variables: string[]): { valid: boolean; unknown: string[] } {
  const unknown: string[] = [];

  for (const variable of variables) {
    // Skip item-level tags (will be validated separately)
    if (variable.startsWith('i_')) {
      continue;
    }

    // Skip patterns that aren't BaseLinker tags (MSO conditionals, CSS selectors)
    if (shouldIgnoreTag(variable)) {
      continue;
    }

    // Check if it's a valid order-level tag or parameterized tag
    if (!VALID_ORDER_TAGS.has(variable) && !PARAMETERIZED_TAGS.has(variable)) {
      unknown.push(variable);
    }
  }

  return {
    valid: unknown.length === 0,
    unknown,
  };
}

/**
 * Validates the syntax and content of [seznam_položek(...)]
 */
export function validateSeznamPolozek(html: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const content = extractSeznamPolozekContent(html);

  if (!content) {
    // If there's no seznam_položek, that's fine - it's optional
    return { valid: true, errors: [] };
  }

  // Extract item-level tags from the content
  const itemTagRegex = /\[([^\[\]]+)\]/g;
  let match;
  const itemTags: string[] = [];

  while ((match = itemTagRegex.exec(content)) !== null) {
    itemTags.push(match[1]);
  }

  // Validate each item tag
  for (const tag of itemTags) {
    if (!VALID_ITEM_TAGS.has(tag)) {
      errors.push(`Invalid item-level tag: [${tag}]. Valid tags are: ${[...VALID_ITEM_TAGS].join(', ')}`);
    }
  }

  // Check for required item tags
  if (!itemTags.includes('i_name')) {
    errors.push('Missing required item tag [i_name] in seznam_položek template');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Full validation of BaseLinker variables in an HTML template
 */
export function validateBaseLinkerTemplate(html: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Extract all variables
  const extractedTags = extractBaseLinkerVariables(html);

  // Validate order-level variables
  const orderValidation = validateVariables(extractedTags);
  if (!orderValidation.valid) {
    for (const unknown of orderValidation.unknown) {
      errors.push(`Unknown BaseLinker tag: [${unknown}]`);
    }
  }

  // Validate seznam_položek content
  const seznamValidation = validateSeznamPolozek(html);
  if (!seznamValidation.valid) {
    errors.push(...seznamValidation.errors);
  }

  // Check for common typos
  const typoChecks = [
    { wrong: 'jmeno', correct: 'jméno' },
    { wrong: 'prijmeni', correct: 'příjmení' },
    { wrong: 'cislo_objednavky', correct: 'číslo_objednávky' },
    { wrong: 'cena_za_objednavku', correct: 'cena_za objednávku' },
  ];

  for (const check of typoChecks) {
    if (html.includes(`[${check.wrong}]`)) {
      warnings.push(`Possible typo: [${check.wrong}] should be [${check.correct}]`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    extractedTags,
  };
}
