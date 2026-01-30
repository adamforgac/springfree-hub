import { describe, it, expect } from 'vitest';
import {
  validateEmailSize,
  validateRequiredElements,
  validateMsoElements,
  validateInlineStyles,
  validateTableStructure,
  validateImageUrls,
  validateResponsiveStyles,
  validateHtmlTemplate,
} from '../validators/html';

describe('HTML Validator', () => {
  describe('validateEmailSize', () => {
    it('validates size under 25,000 char limit', () => {
      const html = '<p>Small content</p>';
      const result = validateEmailSize(html);

      expect(result.valid).toBe(true);
      expect(result.size).toBeLessThan(result.limit);
    });

    it('fails when size exceeds 25,000 chars', () => {
      // Generate 30,000 characters
      const html = 'x'.repeat(30000);
      const result = validateEmailSize(html);

      expect(result.valid).toBe(false);
      expect(result.size).toBeGreaterThan(result.limit);
    });

    it('reports correct size in characters', () => {
      const html = 'hello'; // 5 characters
      const result = validateEmailSize(html);

      expect(result.size).toBe(5);
    });

    it('handles UTF-8 characters correctly', () => {
      const html = 'Česká trampolína'; // Czech chars with diacritics
      const result = validateEmailSize(html);

      // Baselinker counts characters, not bytes - size equals character count
      expect(result.size).toBe(html.length);
      expect(result.size).toBe(16); // 16 characters
    });
  });

  describe('validateRequiredElements', () => {
    it('validates complete HTML structure', () => {
      const html = `
        <!DOCTYPE html>
        <html lang="cs">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width">
          <title>Test Email</title>
        </head>
        <body></body>
        </html>
      `;
      const result = validateRequiredElements(html);

      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('detects missing DOCTYPE', () => {
      const html = '<html><body></body></html>';
      const result = validateRequiredElements(html);

      expect(result.valid).toBe(false);
      expect(result.missing).toContain('DOCTYPE');
    });

    it('detects missing lang attribute', () => {
      const html = '<!DOCTYPE html><html><body></body></html>';
      const result = validateRequiredElements(html);

      expect(result.missing).toContain('html tag with lang');
    });

    it('detects missing title', () => {
      const html = '<!DOCTYPE html><html lang="cs"><head></head><body></body></html>';
      const result = validateRequiredElements(html);

      expect(result.missing).toContain('title tag');
    });
  });

  describe('validateMsoElements', () => {
    it('validates MSO conditional comments', () => {
      const html = `
        <!--[if mso]>
        <xml><o:OfficeDocumentSettings></o:OfficeDocumentSettings></xml>
        <![endif]-->
      `;
      const result = validateMsoElements(html);

      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('detects missing MSO elements', () => {
      const html = '<p>Plain HTML without MSO</p>';
      const result = validateMsoElements(html);

      expect(result.valid).toBe(false);
      expect(result.missing.length).toBeGreaterThan(0);
    });
  });

  describe('validateInlineStyles', () => {
    it('passes when most elements have inline styles', () => {
      const html = `
        <table style="width:100%">
          <tr><td style="padding:10px">Content</td></tr>
        </table>
        <p style="color:black">Text</p>
      `;
      const result = validateInlineStyles(html);

      expect(result.warnings).toHaveLength(0);
    });

    it('warns when many elements lack inline styles', () => {
      const html = `
        <p style="color:black">Styled</p>
        <p>Unstyled 1</p>
        <p>Unstyled 2</p>
        <p>Unstyled 3</p>
        <p>Unstyled 4</p>
      `;
      const result = validateInlineStyles(html);

      // Should warn about p elements lacking styles
      expect(result.warnings.some(w => w.includes('<p>'))).toBe(true);
    });
  });

  describe('validateTableStructure', () => {
    it('validates proper table attributes', () => {
      const html = `
        <table border="0" cellpadding="0" cellspacing="0">
          <tr><td>Content</td></tr>
        </table>
      `;
      const result = validateTableStructure(html);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects missing cellpadding', () => {
      const html = '<table border="0" cellspacing="0"><tr><td></td></tr></table>';
      const result = validateTableStructure(html);

      expect(result.errors.some(e => e.includes('cellpadding'))).toBe(true);
    });

    it('detects missing cellspacing', () => {
      const html = '<table border="0" cellpadding="0"><tr><td></td></tr></table>';
      const result = validateTableStructure(html);

      expect(result.errors.some(e => e.includes('cellspacing'))).toBe(true);
    });
  });

  describe('validateImageUrls', () => {
    it('validates images on correct domain', () => {
      const html = '<img src="https://jumpsafe.eu/mail-images/test.png">';
      const result = validateImageUrls(html);

      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('warns about images on other domains', () => {
      const html = '<img src="https://example.com/image.png">';
      const result = validateImageUrls(html);

      expect(result.warnings.some(w => w.includes('example.com'))).toBe(true);
    });

    it('fails for HTTP images', () => {
      const html = '<img src="http://example.com/image.png">';
      const result = validateImageUrls(html);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('HTTP instead of HTTPS'))).toBe(true);
    });

    it('skips dynamic baselinker tags', () => {
      const html = '<img src="https://jumpsafe.eu/mail-images/[i_sku].png">';
      const result = validateImageUrls(html);

      expect(result.valid).toBe(true);
    });
  });

  describe('validateResponsiveStyles', () => {
    it('validates responsive media queries', () => {
      const html = `
        <style>
          @media screen and (max-width:600px) {
            .mobile { width: 100%; }
          }
        </style>
      `;
      const result = validateResponsiveStyles(html);

      expect(result.warnings).toHaveLength(0);
    });

    it('warns when no media queries found', () => {
      const html = '<p>No responsive styles</p>';
      const result = validateResponsiveStyles(html);

      expect(result.warnings.some(w => w.includes('@media'))).toBe(true);
    });
  });

  describe('validateHtmlTemplate', () => {
    it('validates a complete template', () => {
      const html = `
        <!DOCTYPE html>
        <html lang="cs" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Email</title>
          <!--[if mso]>
          <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
          <![endif]-->
          <style>@media screen and (max-width:600px){}</style>
        </head>
        <body>
          <table border="0" cellpadding="0" cellspacing="0" style="width:100%">
            <tr><td style="padding:10px"><img src="https://jumpsafe.eu/mail-images/logo.png"></td></tr>
          </table>
        </body>
        </html>
      `;
      const result = validateHtmlTemplate(html);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns size information', () => {
      const html = '<!DOCTYPE html><html lang="cs"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>T</title></head></html>';
      const result = validateHtmlTemplate(html);

      expect(result.size).toBeGreaterThan(0);
    });

    it('collects all errors and warnings', () => {
      const html = '<p>Minimal invalid template</p>';
      const result = validateHtmlTemplate(html);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});
