# Multi-Email Templates Architecture

**Datum:** 2026-02-01
**Status:** Schváleno

## Kontext

Springfree Email Generator aktuálně generuje jeden typ e-mailu (potvrzení objednávky) pro 7 evropských trhů. Potřebujeme rozšířit platformu na podporu více typů e-mailů.

## Požadavky

### Zákaznické e-maily (7 jazyků: cs, sk, de, pl, hu, sl, hr)
- Objednávka přijata - platba kartou
- Objednávka přijata - platba převodem (s platebními údaji)
- Připomínka platby (když nepřišly peníze)
- Zásilka odeslána
- Další dle potřeby

### Interní e-maily (pouze čeština)
- Notifikace o nové objednávce s instrukcemi pro zpracování
- Další dle potřeby

### Klíčové principy
- Všechny e-maily sdílí stejný vizuální základ (header, footer, styly)
- Každý e-mail má vlastní obsah a překlady
- Úpravy probíhají v kódu s pomocí Claude (žádný vizuální editor)
- UI slouží pro preview a export

## Architektura

### Struktura souborů

```
src/lib/
├── templates/
│   ├── base/
│   │   ├── styles.ts        # CSS proměnné, barvy, fonty
│   │   ├── header.ts        # Logo + hlavička
│   │   ├── footer.ts        # Kontakty, sociální sítě, právní text
│   │   └── components.ts    # Znovupoužitelné bloky (tlačítko, box, oddělovač)
│   ├── customer/
│   │   ├── order-card-payment.ts
│   │   ├── order-bank-transfer.ts
│   │   ├── payment-reminder.ts
│   │   └── shipment-sent.ts
│   └── internal/
│       └── new-order-processing.ts
├── translations/
│   ├── shared.ts            # Sdílené texty (footer, kontakty)
│   ├── order-card-payment.ts
│   ├── order-bank-transfer.ts
│   ├── payment-reminder.ts
│   └── shipment-sent.ts
└── markets.ts               # Market konfigurace (URL, měny, telefony)
```

### Jak funguje šablona

```typescript
// templates/customer/shipment-sent.ts
import { header, footer, blueButton } from '../base/components';
import { translations } from '../../translations/shipment-sent';

export function generateShipmentEmail(market: MarketCode, data: ShipmentData) {
  const t = translations[market];

  return `
    ${header(market)}

    <h1>${t.title}</h1>
    <p>${t.trackingInfo}</p>
    ${blueButton(t.trackButton, data.trackingUrl)}

    ${footer(market)}
  `;
}
```

### Struktura překladů

```typescript
// translations/shipment-sent.ts
export const translations = {
  cs: {
    subject: "Vaše zásilka byla odeslána",
    title: "Zásilka je na cestě!",
    trackingInfo: "Sledujte svou zásilku:",
    trackButton: "Sledovat zásilku",
  },
  sk: {
    subject: "Vaša zásielka bola odoslaná",
    title: "Zásielka je na ceste!",
    trackingInfo: "Sledujte svoju zásielku:",
    trackButton: "Sledovať zásielku",
  },
  // ... všech 7 jazyků
};
```

### Frontend změny

**Nové UI prvky:**
1. Dropdown pro výběr kategorie e-mailu (Zákaznické / Interní)
2. Dropdown pro výběr typu e-mailu
3. Dropdown pro výběr trhu (skrytý pro interní e-maily)

**Workflow:**
1. Uživatel vybere typ e-mailu
2. Vybere trh/jazyk
3. Vidí live preview
4. Exportuje HTML

### Testovací strategie

```
tests/
├── base/
│   └── components.test.ts     # Testy sdílených komponent
├── templates/
│   ├── order-card-payment.test.ts
│   ├── shipment-sent.test.ts
│   └── ...
└── translations/
    └── completeness.test.ts   # Všechny jazyky pro všechny e-maily
```

**Automatické testy:**
- Kompletnost překladů (všechny klíče ve všech jazycích)
- Velikost e-mailu < 25 000 znaků
- Validita Baselinker tagů
- HTML struktura

## Migrace

Aktuální `template.ts` (319 řádků) se rozloží:
1. Header → `base/header.ts`
2. Footer → `base/footer.ts`
3. Styly → `base/styles.ts`
4. Komponenty → `base/components.ts`
5. Obsah → `customer/order-card-payment.ts`
6. Překlady → `translations/order-card-payment.ts`

Stávající funkcionalita zůstane zachována.

## Omezení

- Žádný vizuální editor - úpravy pouze v kódu
- Baselinker 25KB limit platí pro všechny e-maily
- MSO/Outlook kompatibilita musí být zachována

## Další kroky

1. Refaktoring stávajícího kódu do nové struktury
2. Úprava frontend UI pro výběr typu e-mailu
3. Rozšíření testů
4. Přidání dalších typů e-mailů dle potřeby
