# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Springfree Email Generator - A Next.js 16 application that generates multilingual HTML email templates for Baselinker order confirmations with upsell products. Supports 7 European markets: Czechia, Slovakia, Austria, Poland, Hungary, Slovenia, and Croatia.

## Commands

```bash
npm run dev      # Start development server on port 3000
npm run build    # Build for production
npm start        # Run production server
npm test         # Run Vitest tests (validates templates, tags, translations)
```

## Architecture

### Directory Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # POST - generates HTML email template
│   │   └── products/route.ts    # GET - fetches products from Baselinker API
│   ├── page.tsx                 # Main UI component (client-side)
│   └── globals.css              # Global styles with CSS variables
└── lib/
    ├── types.ts                 # TypeScript type definitions
    ├── template.ts              # Email template generation logic
    ├── markets.ts               # Market configs & all translations
    └── product_dictionary.ts    # Product SKUs, names, and URL slugs
```

### Data Flow

1. `page.tsx` calls `GET /api/products` to fetch product prices from Baselinker (falls back to hardcoded prices if API key missing)
2. User selects market and toggles price visibility
3. `POST /api/generate` receives market code, products, and settings
4. `lib/template.ts` generates complete HTML email with translations from `lib/markets.ts`
5. Output is minified to stay under Baselinker's 25KB limit

### Key Files

- **Translations**: All UI strings and email content are in the `TRANSLATIONS` object in `lib/markets.ts`
- **Market Configs**: `MARKETS` array in `lib/markets.ts` contains URLs, phone numbers, currencies per market
- **Product Names**: Multilingual product names in `lib/product_dictionary.ts` must match Baselinker exactly
- **Template Tags**: Email uses Baselinker dynamic tags like `[seznam_položek()]` documented in `docs/BASELINKER_TAGS_REFERENCE.md`

### Type System

```typescript
type MarketCode = 'cs' | 'sk' | 'de' | 'pl' | 'hu' | 'sl' | 'hr';
```

Markets use these codes throughout - for translations lookup, currency formatting, and URL generation.

## Environment Variables

Create `.env.local` with:
```
BASELINKER_API_KEY=<your_key>
```

Without this key, the app falls back to hardcoded product prices.

## Email Template Constraints

- **Size limit**: 25,000 characters (NOT bytes!) for Baselinker compatibility
- **Outlook compatibility**: Template uses MSO conditional comments and VML for rounded corners
- **Mobile responsive**: CSS @media queries for screens < 600px
- **Image hosting**: All images must be hosted at `https://jumpsafe.eu/mail-images/`

## ⛔ CRITICAL: `[seznam_položek()]` Tag Structure

> **POZOR: Toto nastavení stálo hodiny debugování. NIKDY NEMĚNIT bez důkladného testování v Baselinkeru!**

**Fungující konfigurace (ověřeno 2026-01-27):**

### Pravidla pro `[seznam_položek()]`:

1. **Tag MUSÍ být MEZI řádky tabulky** (ne uvnitř `<td>`)
2. **Obsah MUSÍ začínat `<tr>` a končit `</tr>`**
3. **Vše MUSÍ být na JEDNOM ŘÁDKU** (žádné newlines uvnitř tagu)
4. **ŽÁDNÁ sekvence `)]` nikde jinde v šabloně!** (Baselinker matchuje PRVNÍ `)]` které najde)

### Fungující příklad:
```html
</tr>
[seznam_položek(<tr><td style="padding:0 40px 15px 40px;" class="mobile-padding"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;"><tr><td width="80" style="padding:15px;vertical-align:middle;"><img src="https://jumpsafe.eu/mail-images/[i_sku].png" alt="[i_name]" width="60" height="60" style="display:block;border-radius:6px;"></td><td style="padding:15px 10px;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;"><p style="font-size:14px;font-weight:bold;color:#334155;margin:0 0 4px 0;">[i_name]</p><p style="font-size:12px;color:#64748b;margin:0;">Množství: [i_quantity]x</p></td><td style="padding:15px;text-align:right;vertical-align:middle;white-space:nowrap;font-family:Arial,Helvetica,sans-serif;"><p style="font-size:15px;font-weight:bold;color:#0088CE;margin:0;">[i_price] [i_currency]</p></td></tr></table></td></tr>)]
<!-- TOTAL -->
<tr>
```

### Co NEFUNGUJE (způsobuje duplikaci celého emailu):
```html
<!-- ❌ ŠPATNĚ - tag uvnitř <td> -->
<tr><td>[seznam_položek(<table>...</table>)]</td></tr>

<!-- ❌ ŠPATNĚ - obsah nezačíná <tr> -->
[seznam_položek(<table>...</table>)]

<!-- ❌ ŠPATNĚ - MSO komentář s )] -->
<!--[if (gte mso 9)|(IE)]>  <!-- obsahuje )] !!! -->
```

### MSO komentáře:
```html
<!-- ✅ SPRÁVNĚ -->
<!--[if mso]>...<![endif]-->

<!-- ❌ ŠPATNĚ - obsahuje )] které rozbije [seznam_položek()] -->
<!--[if (gte mso 9)|(IE)]>...<![endif]-->
```

### Preview vs. Realita:
- **Preview v prohlížeči bude vypadat divně** - prohlížeč interpretuje `<tr>` uvnitř tagu jako HTML
- **To je NORMÁLNÍ** - v Baselinkeru tag zmizí a nahradí se skutečnými produkty
- **Testovat VŽDY v Baselinkeru**, ne v browser preview

See `docs/BASELINKER_TAGS_REFERENCE.md` for full documentation.

## Naming Conventions

- Types: `PascalCase` (`MarketCode`, `ProductData`)
- Constants: `SCREAMING_SNAKE_CASE` (`MARKETS`, `UPSELL_SKUS`)
- CSS classes: BEM-like (`.main-grid`, `.preview-container`)
