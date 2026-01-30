// HTML Email Validator
// Validates email templates for compatibility and size constraints

export interface HtmlValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  size: number;
}

// Maximum size for Baselinker templates (25,000 characters)
const MAX_EMAIL_SIZE_CHARS = 25000;

// Required HTML elements for email templates
const REQUIRED_ELEMENTS = [
  { name: 'DOCTYPE', pattern: /<!DOCTYPE\s+html/i },
  { name: 'html tag with lang', pattern: /<html[^>]+lang=/i },
  { name: 'charset meta', pattern: /<meta[^>]+charset/i },
  { name: 'viewport meta', pattern: /<meta[^>]+viewport/i },
  { name: 'title tag', pattern: /<title>[^<]+<\/title>/i },
];

// MSO conditional comments for Outlook compatibility
const MSO_ELEMENTS = [
  { name: 'MSO conditional start', pattern: /<!--\[if\s+mso\]/i },
  { name: 'MSO conditional end', pattern: /<!\[endif\]-->/i },
  { name: 'OfficeDocumentSettings', pattern: /o:OfficeDocumentSettings/i },
];

// Critical elements that should have inline styles
const INLINE_STYLE_ELEMENTS = [
  'table',
  'td',
  'p',
  'h1',
  'a',
  'img',
];

/**
 * Validates email size is within Baselinker limit (25,000 characters)
 */
export function validateEmailSize(html: string): { valid: boolean; size: number; limit: number } {
  const size = html.length; // Baselinker counts characters, not bytes
  return {
    valid: size <= MAX_EMAIL_SIZE_CHARS,
    size,
    limit: MAX_EMAIL_SIZE_CHARS,
  };
}

/**
 * Validates required HTML elements are present
 */
export function validateRequiredElements(html: string): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const element of REQUIRED_ELEMENTS) {
    if (!element.pattern.test(html)) {
      missing.push(element.name);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Validates MSO (Microsoft Office/Outlook) conditional comments are present
 */
export function validateMsoElements(html: string): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const element of MSO_ELEMENTS) {
    if (!element.pattern.test(html)) {
      missing.push(element.name);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Checks for inline styles on critical elements
 * Returns warnings (not errors) for elements without inline styles
 */
export function validateInlineStyles(html: string): { warnings: string[] } {
  const warnings: string[] = [];

  for (const tag of INLINE_STYLE_ELEMENTS) {
    // Find elements without style attribute
    const withoutStyleRegex = new RegExp(`<${tag}(?![^>]*style=)[^>]*>`, 'gi');
    const withStyleRegex = new RegExp(`<${tag}[^>]*style=`, 'gi');

    const withoutStyleCount = (html.match(withoutStyleRegex) || []).length;
    const withStyleCount = (html.match(withStyleRegex) || []).length;

    // If most elements have styles but some don't, warn
    if (withoutStyleCount > 0 && withStyleCount > 0) {
      const total = withoutStyleCount + withStyleCount;
      const percentage = Math.round((withoutStyleCount / total) * 100);

      if (percentage > 10) {
        warnings.push(`${percentage}% of <${tag}> elements lack inline styles (${withoutStyleCount}/${total})`);
      }
    }
  }

  return { warnings };
}

/**
 * Validates table structure for email compatibility
 */
export function validateTableStructure(html: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for proper table attributes
  if (!html.includes('cellpadding="0"') && !html.includes("cellpadding='0'")) {
    errors.push('Tables should have cellpadding="0" for consistent rendering');
  }

  if (!html.includes('cellspacing="0"') && !html.includes("cellspacing='0'")) {
    errors.push('Tables should have cellspacing="0" for consistent rendering');
  }

  if (!html.includes('border="0"') && !html.includes("border='0'")) {
    errors.push('Tables should have border="0" unless borders are intended');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates image hosting is on the correct domain
 */
export function validateImageUrls(html: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Find all image sources
  const imgSrcRegex = /src=["']([^"']+)["']/gi;
  let match;

  while ((match = imgSrcRegex.exec(html)) !== null) {
    const src = match[1];

    // Skip dynamic baselinker tags
    if (src.includes('[') && src.includes(']')) {
      continue;
    }

    // Check if hosted on correct domain
    if (src.startsWith('http') && !src.includes('jumpsafe.eu/mail-images/')) {
      warnings.push(`Image not hosted on jumpsafe.eu: ${src}`);
    }

    // Check for HTTP (should be HTTPS)
    if (src.startsWith('http://')) {
      errors.push(`Image uses HTTP instead of HTTPS: ${src}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates responsive CSS media queries are present
 */
export function validateResponsiveStyles(html: string): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!html.includes('@media')) {
    warnings.push('No @media queries found - email may not be mobile responsive');
  } else if (!html.includes('max-width:600px') && !html.includes('max-width: 600px')) {
    warnings.push('No mobile breakpoint (@media max-width:600px) found');
  }

  return {
    valid: true, // Responsive styles are recommended but not required
    warnings,
  };
}

/**
 * Full HTML validation
 */
export function validateHtmlTemplate(html: string): HtmlValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Size validation
  const sizeResult = validateEmailSize(html);
  if (!sizeResult.valid) {
    errors.push(`Email size (${sizeResult.size.toLocaleString()} chars) exceeds Baselinker limit (${sizeResult.limit.toLocaleString()} chars)`);
  }

  // Required elements
  const requiredResult = validateRequiredElements(html);
  if (!requiredResult.valid) {
    for (const missing of requiredResult.missing) {
      errors.push(`Missing required element: ${missing}`);
    }
  }

  // MSO elements
  const msoResult = validateMsoElements(html);
  if (!msoResult.valid) {
    for (const missing of msoResult.missing) {
      warnings.push(`Missing MSO element for Outlook compatibility: ${missing}`);
    }
  }

  // Inline styles
  const inlineResult = validateInlineStyles(html);
  warnings.push(...inlineResult.warnings);

  // Table structure
  const tableResult = validateTableStructure(html);
  if (!tableResult.valid) {
    warnings.push(...tableResult.errors); // Tables issues are warnings, not errors
  }

  // Image URLs
  const imageResult = validateImageUrls(html);
  errors.push(...imageResult.errors);
  warnings.push(...imageResult.warnings);

  // Responsive styles
  const responsiveResult = validateResponsiveStyles(html);
  warnings.push(...responsiveResult.warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    size: sizeResult.size,
  };
}
