import { describe, it, expect } from 'vitest';
import {
  extractBaseLinkerVariables,
  validateVariables,
  validateSeznamPolozek,
  validateBaseLinkerTemplate,
  VALID_ORDER_TAGS,
  VALID_ITEM_TAGS,
  extractSeznamPolozekContent,
} from '../validators/baselinker';

describe('BaseLinker Validator', () => {
  describe('extractBaseLinkerVariables', () => {
    it('extracts simple tags', () => {
      const html = '<p>[jméno] [příjmení]</p>';
      const tags = extractBaseLinkerVariables(html);

      expect(tags).toContain('jméno');
      expect(tags).toContain('příjmení');
    });

    it('extracts tags with spaces', () => {
      const html = '<p>[jméno a příjmení] - [číslo_objednávky]</p>';
      const tags = extractBaseLinkerVariables(html);

      expect(tags).toContain('jméno a příjmení');
      expect(tags).toContain('číslo_objednávky');
    });

    it('extracts parameterized tags', () => {
      const html = '<p>[seznam_položek(<tr><td>[i_name]</td></tr>)]</p>';
      const tags = extractBaseLinkerVariables(html);

      expect(tags).toContain('seznam_položek');
    });

    it('does not duplicate tags', () => {
      const html = '<p>[jméno] [jméno] [jméno]</p>';
      const tags = extractBaseLinkerVariables(html);

      const jmenoCount = tags.filter(t => t === 'jméno').length;
      expect(jmenoCount).toBe(1);
    });

    it('handles nested brackets correctly', () => {
      const html = '[seznam_položek(<img src="[i_sku].png">[i_name])]';
      const tags = extractBaseLinkerVariables(html);

      expect(tags).toContain('seznam_položek');
    });
  });

  describe('validateVariables', () => {
    it('validates known order-level tags', () => {
      const tags = ['jméno', 'příjmení', 'číslo_objednávky'];
      const result = validateVariables(tags);

      expect(result.valid).toBe(true);
      expect(result.unknown).toHaveLength(0);
    });

    it('detects unknown tags', () => {
      const tags = ['jméno', 'neznamy_tag', 'invalid'];
      const result = validateVariables(tags);

      expect(result.valid).toBe(false);
      expect(result.unknown).toContain('neznamy_tag');
      expect(result.unknown).toContain('invalid');
    });

    it('skips item-level tags (i_* prefix)', () => {
      const tags = ['i_name', 'i_sku', 'i_price'];
      const result = validateVariables(tags);

      // i_* tags should not be flagged as unknown at order level
      expect(result.valid).toBe(true);
    });

    it('validates all documented order tags', () => {
      const allOrderTags = [...VALID_ORDER_TAGS];
      const result = validateVariables(allOrderTags);

      expect(result.valid).toBe(true);
      expect(result.unknown).toHaveLength(0);
    });
  });

  describe('extractSeznamPolozekContent', () => {
    it('extracts content from seznam_položek tag', () => {
      const html = '[seznam_položek(<tr><td>[i_name]</td><td>[i_price]</td></tr>)]';
      const content = extractSeznamPolozekContent(html);

      expect(content).toBe('<tr><td>[i_name]</td><td>[i_price]</td></tr>');
    });

    it('returns null when no seznam_položek exists', () => {
      const html = '<p>No items list here</p>';
      const content = extractSeznamPolozekContent(html);

      expect(content).toBeNull();
    });

    it('handles multiline content', () => {
      const html = `[seznam_položek(
        <tr>
          <td>[i_name]</td>
        </tr>
      )]`;
      const content = extractSeznamPolozekContent(html);

      expect(content).toContain('[i_name]');
    });
  });

  describe('validateSeznamPolozek', () => {
    it('validates correct item-level tags', () => {
      const html = '[seznam_položek(<td>[i_sku] [i_name] [i_quantity] [i_price] [i_currency]</td>)]';
      const result = validateSeznamPolozek(html);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects invalid item-level tags', () => {
      const html = '[seznam_položek(<td>[i_invalid_tag]</td>)]';
      const result = validateSeznamPolozek(html);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('i_invalid_tag'))).toBe(true);
    });

    it('warns when required i_name is missing', () => {
      const html = '[seznam_položek(<td>[i_sku] [i_price]</td>)]';
      const result = validateSeznamPolozek(html);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('i_name'))).toBe(true);
    });

    it('passes when no seznam_položek exists', () => {
      const html = '<p>Simple content without items list</p>';
      const result = validateSeznamPolozek(html);

      expect(result.valid).toBe(true);
    });

    it('validates all documented item tags', () => {
      const allItemTags = [...VALID_ITEM_TAGS].map(t => `[${t}]`).join(' ');
      const html = `[seznam_položek(<td>${allItemTags}</td>)]`;
      const result = validateSeznamPolozek(html);

      expect(result.valid).toBe(true);
    });
  });

  describe('validateBaseLinkerTemplate', () => {
    it('validates a complete valid template', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <body>
          <p>Vážený/á [jméno] [příjmení],</p>
          <p>Vaše objednávka č. [číslo_objednávky] byla přijata.</p>
          <p>Celková cena: [cena_za objednávku] [měna]</p>
          [seznam_položek(<tr><td>[i_name]</td><td>[i_quantity]x</td><td>[i_price] [i_currency]</td></tr>)]
        </body>
        </html>
      `;
      const result = validateBaseLinkerTemplate(html);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects unknown tags in template', () => {
      const html = `<p>[unknown_tag] [another_invalid]</p>`;
      const result = validateBaseLinkerTemplate(html);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('unknown_tag'))).toBe(true);
      expect(result.errors.some(e => e.includes('another_invalid'))).toBe(true);
    });

    it('warns about common typos', () => {
      const html = `<p>[jmeno] [prijmeni]</p>`;
      const result = validateBaseLinkerTemplate(html);

      expect(result.warnings.some(w => w.includes('jmeno'))).toBe(true);
      expect(result.warnings.some(w => w.includes('prijmeni'))).toBe(true);
    });

    it('returns extracted tags', () => {
      const html = `<p>[jméno] [e-mail]</p>`;
      const result = validateBaseLinkerTemplate(html);

      expect(result.extractedTags).toContain('jméno');
      expect(result.extractedTags).toContain('e-mail');
    });

    it('validates real-world template tags', () => {
      // Tags used in the actual template.ts
      const templateTags = [
        'jméno', 'číslo_objednávky', 'odkaz_na_objednávku',
        'i_sku', 'i_name', 'i_quantity', 'i_price', 'i_currency',
        'cena_za objednávku', 'měna', 'název_faktury_a_příjmení',
        'fakturační adresa', 'faktura_postal_code', 'faktura_city',
        'faktura_země', 'příjmení', 'adresa', 'poštovní směrovací číslo',
        'město', 'země', 'způsob platby', 'metoda_zásilky',
      ];

      const result = validateVariables(templateTags);

      expect(result.valid).toBe(true);
      expect(result.unknown).toHaveLength(0);
    });
  });
});
