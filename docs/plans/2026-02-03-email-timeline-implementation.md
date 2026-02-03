# Email Timeline States Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement 3 email templates with new timeline states: order confirmation (no timeline), awaiting payment (orange state), payment confirmed (blue state).

**Architecture:** Refactor existing templates to share common components (header, footer, upsell, product list). Create new `order-confirmation.ts` template with status box instead of timeline. Modify `templateBankTransfer.ts` to use new timeline. Create new `payment-confirmed.ts` template.

**Tech Stack:** TypeScript, Next.js, HTML email (MSO-compatible)

---

## Task 1: Add new translations for timeline states

**Files:**
- Modify: `src/lib/markets.ts:41-286` (TRANSLATIONS object)
- Modify: `src/lib/markets.ts:288-417` (BANK_TRANSFER_TRANSLATIONS object)

**Step 1: Add new translation keys to TRANSLATIONS type**

In `src/lib/markets.ts`, add these keys to the TRANSLATIONS type (around line 41):

```typescript
// Add after timelineDelivered:
timelineConfirmed: string;
timelinePaid: string;
timelineShipped: string;
orderReceivedTitle: string;  // For status box in order confirmation email
```

**Step 2: Add translations for all 7 markets**

Add to each market in TRANSLATIONS object:

**cs (line ~69):**
```typescript
timelinePaid: 'Zaplaceno',
timelineShipped: 'Odesláno',
orderReceivedTitle: 'Objednávka přijata',
```

**sk (line ~100):**
```typescript
timelinePaid: 'Zaplatené',
timelineShipped: 'Odoslané',
orderReceivedTitle: 'Objednávka prijatá',
```

**de (line ~131):**
```typescript
timelinePaid: 'Bezahlt',
timelineShipped: 'Versandt',
orderReceivedTitle: 'Bestellung eingegangen',
```

**pl (line ~162):**
```typescript
timelinePaid: 'Opłacone',
timelineShipped: 'Wysłane',
orderReceivedTitle: 'Zamówienie przyjęte',
```

**hu (line ~193):**
```typescript
timelinePaid: 'Kifizetve',
timelineShipped: 'Elküldve',
orderReceivedTitle: 'Rendelés beérkezett',
```

**sl (line ~224):**
```typescript
timelinePaid: 'Plačano',
timelineShipped: 'Poslano',
orderReceivedTitle: 'Naročilo sprejeto',
```

**hr (line ~255):**
```typescript
timelinePaid: 'Plaćeno',
timelineShipped: 'Poslano',
orderReceivedTitle: 'Narudžba zaprimljena',
```

**Step 3: Add PAYMENT_CONFIRMED_TRANSLATIONS**

Add new translation object after BANK_TRANSFER_TRANSLATIONS (around line 418):

```typescript
// Payment confirmed email specific translations
export const PAYMENT_CONFIRMED_TRANSLATIONS: Record<MarketCode, {
  emailTitle: string;
  greeting: string;
  paymentReceived: string;
  preparingShipment: string;
}> = {
  cs: {
    emailTitle: 'Platba přijata',
    greeting: 'Děkujeme za platbu!',
    paymentReceived: 'Vážený/á {{name}}, platba za objednávku č. {{order_number}} byla úspěšně přijata.',
    preparingShipment: 'Vaši objednávku nyní připravujeme k odeslání.',
  },
  sk: {
    emailTitle: 'Platba prijatá',
    greeting: 'Ďakujeme za platbu!',
    paymentReceived: 'Vážený/á {{name}}, platba za objednávku č. {{order_number}} bola úspešne prijatá.',
    preparingShipment: 'Vašu objednávku teraz pripravujeme na odoslanie.',
  },
  de: {
    emailTitle: 'Zahlung eingegangen',
    greeting: 'Vielen Dank für Ihre Zahlung!',
    paymentReceived: 'Sehr geehrte/r {{name}}, die Zahlung für Ihre Bestellung Nr. {{order_number}} wurde erfolgreich empfangen.',
    preparingShipment: 'Wir bereiten Ihre Bestellung jetzt für den Versand vor.',
  },
  pl: {
    emailTitle: 'Płatność otrzymana',
    greeting: 'Dziękujemy za płatność!',
    paymentReceived: 'Szanowny/a {{name}}, płatność za zamówienie nr {{order_number}} została pomyślnie zaksięgowana.',
    preparingShipment: 'Twoje zamówienie jest teraz przygotowywane do wysyłki.',
  },
  hu: {
    emailTitle: 'Fizetés megérkezett',
    greeting: 'Köszönjük a fizetést!',
    paymentReceived: 'Tisztelt {{name}}, a(z) {{order_number}} számú rendelése fizetése sikeresen megérkezett.',
    preparingShipment: 'Rendelését most készítjük elő a szállításra.',
  },
  sl: {
    emailTitle: 'Plačilo prejeto',
    greeting: 'Hvala za plačilo!',
    paymentReceived: 'Spoštovani {{name}}, plačilo za vaše naročilo št. {{order_number}} je bilo uspešno prejeto.',
    preparingShipment: 'Vaše naročilo zdaj pripravljamo za pošiljanje.',
  },
  hr: {
    emailTitle: 'Uplata primljena',
    greeting: 'Hvala na uplati!',
    paymentReceived: 'Poštovani {{name}}, uplata za Vašu narudžbu br. {{order_number}} je uspješno zaprimljena.',
    preparingShipment: 'Vašu narudžbu sada pripremamo za slanje.',
  },
};
```

**Step 4: Run build to verify types**

Run: `npm run build`
Expected: Build succeeds with no type errors

**Step 5: Commit**

```bash
git add src/lib/markets.ts
git commit -m "feat: add translations for new email timeline states

Add timelinePaid, timelineShipped, orderReceivedTitle to all 7 markets.
Add PAYMENT_CONFIRMED_TRANSLATIONS for payment confirmation email.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create order confirmation template (Email 1)

**Files:**
- Create: `src/lib/templateOrderConfirmation.ts`

**Step 1: Create the template file**

Create `src/lib/templateOrderConfirmation.ts` with status box instead of timeline:

```typescript
import { MarketCode } from './types';
import { MARKETS, TRANSLATIONS } from './markets';
import { PRODUCT_SLUGS } from './product_dictionary';

interface UpsellProduct {
  sku: string;
  name: string;
  price: string;
  pricePrefix: string;
  link: string;
}

interface TemplateData {
  market: MarketCode;
  products: UpsellProduct[];
  showPrices: boolean;
}

function getProductLink(sku: string, market: MarketCode): string {
  const marketData = MARKETS.find(m => m.code === market);
  const baseUrl = marketData?.websiteUrl || 'https://www.trampoliny-springfree.cz';
  const slug = PRODUCT_SLUGS[sku as keyof typeof PRODUCT_SLUGS]?.[market] || 'produkt';
  if (market === 'cs') {
    return `${baseUrl}/produkt/${slug}/`;
  }
  return `${baseUrl}/${slug}/`;
}

export function generateOrderConfirmationEmailTemplate(data: TemplateData): string {
  const { market, products, showPrices } = data;
  const t = TRANSLATIONS[market];
  const marketData = MARKETS.find(m => m.code === market)!;

  const phoneNbsp = marketData.phone.replace(/ /g, '&nbsp;') + (marketData.phoneHint ? '&nbsp;' + marketData.phoneHint.replace(/ /g, '&nbsp;') : '');
  const phoneNbspClean = marketData.phone.replace(/ /g, '&nbsp;');

  const generateUpsellCard = (product: UpsellProduct) => `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;"><tr><td align="center" style="padding:14px 14px 10px 14px;"><img src="https://jumpsafe.eu/mail-images/${product.sku}.png" alt="${product.name}" width="80" height="80" style="display:block;border-radius:6px;"></td></tr><tr><td align="center" style="padding:0 14px;font-family:Arial,Helvetica,sans-serif;"><p style="font-size:12px;font-weight:bold;color:#334155;margin:0 0 3px 0;">${product.name}</p>${showPrices ? `<p style="font-size:13px;font-weight:bold;color:#0088CE;margin:0;white-space:nowrap;">${product.pricePrefix}${product.price}</p>` : ''}</td></tr><tr><td align="center" style="padding:10px 14px 14px 14px;"><a href="${getProductLink(product.sku, market)}" target="_blank" style="display:inline-block;padding:8px 16px;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;color:#0088CE;text-decoration:none;background-color:#ffffff;border:2px solid #0088CE;border-radius:5px;">${t.addButton}</a></td></tr></table>`;

  return `<!DOCTYPE html>
<html lang="${market}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
<title>${t.emailTitle}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<style>table{border-collapse:collapse;}td,th,div,p,a,h1,h2,h3,h4,h5,h6{font-family:Arial,sans-serif;}</style>
<![endif]-->
<style type="text/css">
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}
body{margin:0!important;padding:0!important;width:100%!important;background-color:#f5f7f9;}
a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;}
u+#body a{color:inherit;text-decoration:none;}
@media screen and (max-width:600px){
.mobile-wrapper{width:100%!important;max-width:100%!important;}
.mobile-padding{padding-left:20px!important;padding-right:20px!important;}
.mobile-stack{display:block!important;width:100%!important;margin-bottom:12px!important;}
.mobile-hide{display:none!important;}
.mobile-total{font-size:20px!important;}
}
</style>
</head>
<body id="body" style="margin:0!important;padding:0!important;background-color:#f5f7f9;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f5f7f9;">
<tr>
<td align="center" valign="top" style="padding:30px 10px;">
<!--[if mso]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center" valign="top" width="600"><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;" class="mobile-wrapper">
<!-- HEADER -->
<tr>
<td align="center" valign="middle" style="background-color:#0088CE;padding:28px 40px;" class="mobile-padding">
<a href="${marketData.websiteUrl}" target="_blank" style="text-decoration:none;">
<img src="https://jumpsafe.eu/mail-images/springfree-logo-white.png" alt="${t.brandName}" width="160" height="160" style="display:block;max-width:160px;">
</a>
</td>
</tr>
<!-- HERO -->
<tr>
<td align="center" valign="top" style="padding:40px 40px 16px 40px;" class="mobile-padding">
<h1 style="font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:bold;color:#2d3748;margin:0 0 14px 0;line-height:1.2;">${t.greeting}</h1>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#64748b;margin:0;max-width:480px;">${t.orderConfirmed.replace('{{name}}', '[jméno]').replace('{{order_number}}', '<strong style="color:#0088CE;">[číslo_objednávky]</strong>')}</p>
</td>
</tr>
<!-- STATUS BOX (instead of timeline) -->
<tr>
<td style="padding:16px 40px 30px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ecfdf5;border-radius:10px;border:2px solid #10b981;">
<tr>
<td align="center" style="padding:20px;font-family:Arial,Helvetica,sans-serif;">
<!--[if mso]><table border="0" cellpadding="0" cellspacing="0"><tr><td width="32" height="32" bgcolor="#10b981" style="border-radius:16px;text-align:center;vertical-align:middle;"><span style="font-family:Arial,sans-serif;font-size:16px;color:#ffffff;line-height:32px;">&#10003;</span></td></tr></table><![endif]-->
<!--[if !mso]><!--><div style="width:32px;height:32px;background-color:#10b981;border-radius:50%;text-align:center;line-height:32px;margin:0 auto 10px auto;"><span style="font-family:Arial,sans-serif;font-size:16px;color:#ffffff;">&#10003;</span></div><!--<![endif]-->
<p style="font-size:16px;font-weight:bold;color:#065f46;margin:0;">${t.orderReceivedTitle}</p>
</td>
</tr>
</table>
</td>
</tr>
<!-- DIVIDER -->
<tr>
<td style="padding:0 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:1px solid #e2e8f0;"></td></tr></table>
</td>
</tr>
<!-- PRODUCTS HEADER -->
<tr>
<td style="padding:25px 40px 16px 40px;" class="mobile-padding">
<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#94a3b8;letter-spacing:1px;margin:0;">${t.yourOrder.toUpperCase()}</p>
</td>
</tr>
[seznam_položek(<tr><td style="padding:0 40px 10px 40px;" class="mobile-padding"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;"><tr><td width="60" style="padding:12px;vertical-align:middle;"><img src="https://jumpsafe.eu/mail-images/[i_sku].png" alt="[i_name]" width="50" height="50" style="display:block;border-radius:6px;"></td><td style="padding:12px 8px;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;"><p style="font-size:14px;font-weight:bold;color:#334155;margin:0 0 4px 0;line-height:1.3;">[i_name]</p><p style="font-size:12px;color:#94a3b8;margin:0;">[i_quantity]x</p></td><td style="padding:12px;text-align:right;vertical-align:middle;white-space:nowrap;font-family:Arial,Helvetica,sans-serif;"><p style="font-size:14px;font-weight:bold;color:#334155;margin:0;white-space:nowrap;">[i_price]&nbsp;[i_currency]</p></td></tr></table></td></tr>)]
<!-- TOTAL -->
<tr>
<td style="padding:15px 40px 30px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#0088CE;border-radius:10px;">
<tr>
<td align="center" style="padding:22px;font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:12px;color:rgba(255,255,255,0.85);margin:0 0 6px 0;letter-spacing:1px;">${t.totalToPay.toUpperCase()}</p>
<p style="font-size:26px;font-weight:bold;color:#ffffff;margin:0;" class="mobile-total">[cena_za objednávku] [měna]</p>
</td>
</tr>
</table>
</td>
</tr>
<!-- DIVIDER -->
<tr>
<td style="padding:0 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:1px solid #e2e8f0;"></td></tr></table>
</td>
</tr>
<!-- DELIVERY INFO -->
<tr>
<td style="padding:25px 40px 16px 40px;" class="mobile-padding">
<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#94a3b8;letter-spacing:1px;margin:0;">${t.deliveryDetails.toUpperCase()}</p>
</td>
</tr>
<!-- ADDRESSES -->
<tr>
<td style="padding:0 40px 20px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="48%" valign="top" class="mobile-stack">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-radius:8px;">
<tr>
<td style="padding:16px;font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:11px;color:#94a3b8;margin:0 0 6px 0;font-weight:bold;">${t.billingAddress.toUpperCase()}</p>
<p style="font-size:13px;color:#334155;margin:0;line-height:19px;">[název_faktury_a_příjmení]<br>[fakturační adresa]<br>[faktura_postal_code] [faktura_city]<br>[faktura_země]</p>
</td>
</tr>
</table>
</td>
<td width="4%" class="mobile-hide"></td>
<td width="48%" valign="top" class="mobile-stack">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-radius:8px;">
<tr>
<td style="padding:16px;font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:11px;color:#94a3b8;margin:0 0 6px 0;font-weight:bold;">${t.shippingAddress.toUpperCase()}</p>
<p style="font-size:13px;color:#334155;margin:0;line-height:19px;">[jméno] [příjmení]<br>[adresa]<br>[poštovní směrovací číslo] [město]<br>[země]</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<!-- PAYMENT & SHIPPING -->
<tr>
<td style="padding:0 40px 25px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="48%" valign="top" class="mobile-stack" style="font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:11px;color:#94a3b8;margin:0 0 4px 0;font-weight:bold;">${t.payment.toUpperCase()}</p>
<p style="font-size:13px;color:#0088CE;margin:0;font-weight:bold;">[způsob platby]</p>
</td>
<td width="4%" class="mobile-hide"></td>
<td width="48%" valign="top" class="mobile-stack" style="font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:11px;color:#94a3b8;margin:0 0 4px 0;font-weight:bold;">${t.shipping.toUpperCase()}</p>
<p style="font-size:13px;color:#0088CE;margin:0;font-weight:bold;">[metoda_zásilky]</p>
</td>
</tr>
</table>
</td>
</tr>
<!-- DIVIDER -->
<tr>
<td style="padding:0 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:1px solid #e2e8f0;"></td></tr></table>
</td>
</tr>
<!-- CONTACT SECTION -->
<tr>
<td style="padding:25px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f9ff;border-radius:8px;border-left:4px solid #0088CE;">
<tr>
<td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:14px;font-weight:bold;color:#334155;margin:0 0 6px 0;">${t.needHelp}</p>
<p style="font-size:13px;color:#64748b;margin:0;line-height:20px;">${t.needHelpText.replace('{{phone}}', `<a href="tel:${marketData.phone.replace(/\s/g, '')}" style="color:#0088CE;text-decoration:none;font-weight:bold;">${phoneNbsp}</a>`).replace('{{email}}', `<a href="mailto:${marketData.email}" style="color:#0088CE;text-decoration:none;font-weight:bold;">${marketData.email}</a>`)}</p>
</td>
</tr>
</table>
</td>
</tr>
<!-- DIVIDER -->
<tr>
<td style="padding:0 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:1px solid #e2e8f0;"></td></tr></table>
</td>
</tr>
<!-- UPSELL SECTION -->
<tr>
<td style="padding:25px 40px 16px 40px;" class="mobile-padding">
<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#0088CE;letter-spacing:1px;margin:0 0 6px 0;">${t.upsellTitle.toUpperCase()}</p>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#64748b;margin:0;line-height:20px;">${t.upsellSubtitle}</p>
</td>
</tr>
<!-- UPSELL PRODUCTS ROW 1 -->
<tr>
<td style="padding:0 40px 12px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="48%" valign="top" class="mobile-stack">
${products[0] ? generateUpsellCard(products[0]) : ''}
</td>
<td width="4%" class="mobile-hide"></td>
<td width="48%" valign="top" class="mobile-stack">
${products[1] ? generateUpsellCard(products[1]) : ''}
</td>
</tr>
</table>
</td>
</tr>
<!-- UPSELL PRODUCTS ROW 2 -->
<tr>
<td style="padding:0 40px 20px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="48%" valign="top" class="mobile-stack">
${products[2] ? generateUpsellCard(products[2]) : ''}
</td>
<td width="4%" class="mobile-hide"></td>
<td width="48%" valign="top" class="mobile-stack">
${products[3] ? generateUpsellCard(products[3]) : ''}
</td>
</tr>
</table>
</td>
</tr>
<!-- MORE PRODUCTS -->
<tr>
<td align="center" style="padding:0 40px 35px 40px;" class="mobile-padding">
<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#64748b;margin:0;">
<a href="${marketData.accessoriesUrl}" target="_blank" style="color:#0088CE;text-decoration:none;font-weight:bold;">${t.moreAccessories}</a>
</p>
</td>
</tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
<!-- FOOTER -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;" class="mobile-wrapper">
<tr>
<td align="center" style="padding:25px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td align="center" style="padding-bottom:14px;">
<img src="https://jumpsafe.eu/mail-images/springfree-logo-blue.png" alt="${t.brandName}" width="80" height="80" style="display:block;opacity:0.5;">
</td>
</tr>
<tr>
<td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#94a3b8;padding-bottom:6px;">${t.brandName}&nbsp;|&nbsp;${marketData.email}&nbsp;|&nbsp;${phoneNbspClean}</td>
</tr>
<tr>
<td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#94a3b8;">${t.copyright}</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/lib/templateOrderConfirmation.ts
git commit -m "feat: add order confirmation email template with status box

Email 1 - sent to all customers immediately after order.
Uses green status box instead of timeline (no payment mention).

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Update bank transfer template with new timeline (Email 2a)

**Files:**
- Modify: `src/lib/templateBankTransfer.ts:96-124` (timeline section)

**Step 1: Update timeline to use new states**

In `templateBankTransfer.ts`, replace the TIMELINE section (lines ~96-124) with:

```typescript
<!-- TIMELINE -->
<tr>
<td style="padding:24px 40px 30px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="80" align="center" valign="top">
<!--[if mso]><table border="0" cellpadding="0" cellspacing="0"><tr><td width="32" height="32" bgcolor="#0088CE" style="border-radius:16px;text-align:center;"><span style="font-family:Arial,sans-serif;font-size:16px;color:#ffffff;line-height:32px;">&#10003;</span></td></tr></table><![endif]-->
<!--[if !mso]><!--><div style="width:32px;height:32px;background-color:#0088CE;border-radius:50%;text-align:center;line-height:32px;margin:0 auto;"><span style="font-family:Arial,sans-serif;font-size:16px;color:#ffffff;">&#10003;</span></div><!--<![endif]-->
<div style="padding-top:8px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:#0088CE;text-align:center;">${t.timelineConfirmed}</div>
</td>
<td valign="top" style="padding-top:15px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:2px solid #f59e0b;"></td></tr></table>
</td>
<td width="80" align="center" valign="top">
<!--[if mso]><table border="0" cellpadding="0" cellspacing="0"><tr><td width="32" height="32" bgcolor="#f59e0b" style="border-radius:16px;text-align:center;"><span style="font-family:Arial,sans-serif;font-size:14px;color:#ffffff;line-height:32px;">&#9679;</span></td></tr></table><![endif]-->
<!--[if !mso]><!--><div style="width:32px;height:32px;background-color:#f59e0b;border-radius:50%;text-align:center;line-height:32px;margin:0 auto;"><span style="font-family:Arial,sans-serif;font-size:14px;color:#ffffff;">&#9679;</span></div><!--<![endif]-->
<div style="padding-top:8px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:#f59e0b;text-align:center;">${bt.timelineWaitingPayment}</div>
</td>
<td valign="top" style="padding-top:15px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:2px solid #e2e8f0;"></td></tr></table>
</td>
<td width="80" align="center" valign="top">
<!--[if mso]><table border="0" cellpadding="0" cellspacing="0"><tr><td width="32" height="32" bgcolor="#e2e8f0" style="border-radius:16px;text-align:center;"><span style="font-family:Arial,sans-serif;font-size:14px;color:#94a3b8;line-height:32px;">3</span></td></tr></table><![endif]-->
<!--[if !mso]><!--><div style="width:32px;height:32px;background-color:#e2e8f0;border-radius:50%;text-align:center;line-height:32px;margin:0 auto;"><span style="font-family:Arial,sans-serif;font-size:14px;color:#94a3b8;">3</span></div><!--<![endif]-->
<div style="padding-top:8px;font-family:Arial,sans-serif;font-size:12px;color:#94a3b8;text-align:center;">${t.timelineShipped}</div>
</td>
</tr>
</table>
</td>
</tr>
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/lib/templateBankTransfer.ts
git commit -m "feat: update bank transfer email with orange 'awaiting payment' state

Timeline now shows: Potvrzeno ✓ → Čeká na platbu (orange) → Odesláno (gray)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create payment confirmed template (Email 2b)

**Files:**
- Create: `src/lib/templatePaymentConfirmed.ts`

**Step 1: Create the template file**

Create `src/lib/templatePaymentConfirmed.ts` - similar to bank transfer but with "paid" timeline state and different message:

```typescript
import { MarketCode } from './types';
import { MARKETS, TRANSLATIONS, PAYMENT_CONFIRMED_TRANSLATIONS } from './markets';
import { PRODUCT_SLUGS } from './product_dictionary';

interface UpsellProduct {
  sku: string;
  name: string;
  price: string;
  pricePrefix: string;
  link: string;
}

interface TemplateData {
  market: MarketCode;
  products: UpsellProduct[];
  showPrices: boolean;
}

function getProductLink(sku: string, market: MarketCode): string {
  const marketData = MARKETS.find(m => m.code === market);
  const baseUrl = marketData?.websiteUrl || 'https://www.trampoliny-springfree.cz';
  const slug = PRODUCT_SLUGS[sku as keyof typeof PRODUCT_SLUGS]?.[market] || 'produkt';
  if (market === 'cs') {
    return `${baseUrl}/produkt/${slug}/`;
  }
  return `${baseUrl}/${slug}/`;
}

export function generatePaymentConfirmedEmailTemplate(data: TemplateData): string {
  const { market, products, showPrices } = data;
  const t = TRANSLATIONS[market];
  const pc = PAYMENT_CONFIRMED_TRANSLATIONS[market];
  const marketData = MARKETS.find(m => m.code === market)!;

  const phoneNbsp = marketData.phone.replace(/ /g, '&nbsp;') + (marketData.phoneHint ? '&nbsp;' + marketData.phoneHint.replace(/ /g, '&nbsp;') : '');
  const phoneNbspClean = marketData.phone.replace(/ /g, '&nbsp;');

  const generateUpsellCard = (product: UpsellProduct) => `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;"><tr><td align="center" style="padding:14px 14px 10px 14px;"><img src="https://jumpsafe.eu/mail-images/${product.sku}.png" alt="${product.name}" width="80" height="80" style="display:block;border-radius:6px;"></td></tr><tr><td align="center" style="padding:0 14px;font-family:Arial,Helvetica,sans-serif;"><p style="font-size:12px;font-weight:bold;color:#334155;margin:0 0 3px 0;">${product.name}</p>${showPrices ? `<p style="font-size:13px;font-weight:bold;color:#0088CE;margin:0;white-space:nowrap;">${product.pricePrefix}${product.price}</p>` : ''}</td></tr><tr><td align="center" style="padding:10px 14px 14px 14px;"><a href="${getProductLink(product.sku, market)}" target="_blank" style="display:inline-block;padding:8px 16px;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;color:#0088CE;text-decoration:none;background-color:#ffffff;border:2px solid #0088CE;border-radius:5px;">${t.addButton}</a></td></tr></table>`;

  return `<!DOCTYPE html>
<html lang="${market}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
<title>${pc.emailTitle}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<style>table{border-collapse:collapse;}td,th,div,p,a,h1,h2,h3,h4,h5,h6{font-family:Arial,sans-serif;}</style>
<![endif]-->
<style type="text/css">
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}
body{margin:0!important;padding:0!important;width:100%!important;background-color:#f5f7f9;}
a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;}
u+#body a{color:inherit;text-decoration:none;}
@media screen and (max-width:600px){
.mobile-wrapper{width:100%!important;max-width:100%!important;}
.mobile-padding{padding-left:20px!important;padding-right:20px!important;}
.mobile-stack{display:block!important;width:100%!important;margin-bottom:12px!important;}
.mobile-hide{display:none!important;}
.mobile-total{font-size:20px!important;}
}
</style>
</head>
<body id="body" style="margin:0!important;padding:0!important;background-color:#f5f7f9;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f5f7f9;">
<tr>
<td align="center" valign="top" style="padding:30px 10px;">
<!--[if mso]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600"><tr><td align="center" valign="top" width="600"><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;" class="mobile-wrapper">
<!-- HEADER -->
<tr>
<td align="center" valign="middle" style="background-color:#0088CE;padding:28px 40px;" class="mobile-padding">
<a href="${marketData.websiteUrl}" target="_blank" style="text-decoration:none;">
<img src="https://jumpsafe.eu/mail-images/springfree-logo-white.png" alt="${t.brandName}" width="160" height="160" style="display:block;max-width:160px;">
</a>
</td>
</tr>
<!-- HERO -->
<tr>
<td align="center" valign="top" style="padding:40px 40px 16px 40px;" class="mobile-padding">
<h1 style="font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:bold;color:#2d3748;margin:0 0 14px 0;line-height:1.2;">${pc.greeting}</h1>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#64748b;margin:0 0 12px 0;max-width:480px;">${pc.paymentReceived.replace('{{name}}', '[jméno]').replace('{{order_number}}', '<strong style="color:#0088CE;">[číslo_objednávky]</strong>')}</p>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#334155;margin:0;max-width:480px;font-weight:500;">${pc.preparingShipment}</p>
</td>
</tr>
<!-- TIMELINE: Potvrzeno ✓ → Zaplaceno ✓ → Odesláno (gray) -->
<tr>
<td style="padding:24px 40px 30px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="80" align="center" valign="top">
<!--[if mso]><table border="0" cellpadding="0" cellspacing="0"><tr><td width="32" height="32" bgcolor="#0088CE" style="border-radius:16px;text-align:center;"><span style="font-family:Arial,sans-serif;font-size:16px;color:#ffffff;line-height:32px;">&#10003;</span></td></tr></table><![endif]-->
<!--[if !mso]><!--><div style="width:32px;height:32px;background-color:#0088CE;border-radius:50%;text-align:center;line-height:32px;margin:0 auto;"><span style="font-family:Arial,sans-serif;font-size:16px;color:#ffffff;">&#10003;</span></div><!--<![endif]-->
<div style="padding-top:8px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:#0088CE;text-align:center;">${t.timelineConfirmed}</div>
</td>
<td valign="top" style="padding-top:15px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:2px solid #0088CE;"></td></tr></table>
</td>
<td width="80" align="center" valign="top">
<!--[if mso]><table border="0" cellpadding="0" cellspacing="0"><tr><td width="32" height="32" bgcolor="#0088CE" style="border-radius:16px;text-align:center;"><span style="font-family:Arial,sans-serif;font-size:16px;color:#ffffff;line-height:32px;">&#10003;</span></td></tr></table><![endif]-->
<!--[if !mso]><!--><div style="width:32px;height:32px;background-color:#0088CE;border-radius:50%;text-align:center;line-height:32px;margin:0 auto;"><span style="font-family:Arial,sans-serif;font-size:16px;color:#ffffff;">&#10003;</span></div><!--<![endif]-->
<div style="padding-top:8px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:#0088CE;text-align:center;">${t.timelinePaid}</div>
</td>
<td valign="top" style="padding-top:15px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:2px solid #e2e8f0;"></td></tr></table>
</td>
<td width="80" align="center" valign="top">
<!--[if mso]><table border="0" cellpadding="0" cellspacing="0"><tr><td width="32" height="32" bgcolor="#e2e8f0" style="border-radius:16px;text-align:center;"><span style="font-family:Arial,sans-serif;font-size:14px;color:#94a3b8;line-height:32px;">3</span></td></tr></table><![endif]-->
<!--[if !mso]><!--><div style="width:32px;height:32px;background-color:#e2e8f0;border-radius:50%;text-align:center;line-height:32px;margin:0 auto;"><span style="font-family:Arial,sans-serif;font-size:14px;color:#94a3b8;">3</span></div><!--<![endif]-->
<div style="padding-top:8px;font-family:Arial,sans-serif;font-size:12px;color:#94a3b8;text-align:center;">${t.timelineShipped}</div>
</td>
</tr>
</table>
</td>
</tr>
<!-- DIVIDER -->
<tr>
<td style="padding:0 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:1px solid #e2e8f0;"></td></tr></table>
</td>
</tr>
<!-- PRODUCTS HEADER -->
<tr>
<td style="padding:25px 40px 16px 40px;" class="mobile-padding">
<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#94a3b8;letter-spacing:1px;margin:0;">${t.yourOrder.toUpperCase()}</p>
</td>
</tr>
[seznam_položek(<tr><td style="padding:0 40px 10px 40px;" class="mobile-padding"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;"><tr><td width="60" style="padding:12px;vertical-align:middle;"><img src="https://jumpsafe.eu/mail-images/[i_sku].png" alt="[i_name]" width="50" height="50" style="display:block;border-radius:6px;"></td><td style="padding:12px 8px;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;"><p style="font-size:14px;font-weight:bold;color:#334155;margin:0 0 4px 0;line-height:1.3;">[i_name]</p><p style="font-size:12px;color:#94a3b8;margin:0;">[i_quantity]x</p></td><td style="padding:12px;text-align:right;vertical-align:middle;white-space:nowrap;font-family:Arial,Helvetica,sans-serif;"><p style="font-size:14px;font-weight:bold;color:#334155;margin:0;white-space:nowrap;">[i_price]&nbsp;[i_currency]</p></td></tr></table></td></tr>)]
<!-- TOTAL -->
<tr>
<td style="padding:15px 40px 30px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#0088CE;border-radius:10px;">
<tr>
<td align="center" style="padding:22px;font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:12px;color:rgba(255,255,255,0.85);margin:0 0 6px 0;letter-spacing:1px;">${t.totalToPay.toUpperCase()}</p>
<p style="font-size:26px;font-weight:bold;color:#ffffff;margin:0;" class="mobile-total">[cena_za objednávku] [měna]</p>
</td>
</tr>
</table>
</td>
</tr>
<!-- DIVIDER -->
<tr>
<td style="padding:0 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:1px solid #e2e8f0;"></td></tr></table>
</td>
</tr>
<!-- DELIVERY INFO -->
<tr>
<td style="padding:25px 40px 16px 40px;" class="mobile-padding">
<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#94a3b8;letter-spacing:1px;margin:0;">${t.deliveryDetails.toUpperCase()}</p>
</td>
</tr>
<!-- ADDRESSES -->
<tr>
<td style="padding:0 40px 20px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="48%" valign="top" class="mobile-stack">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-radius:8px;">
<tr>
<td style="padding:16px;font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:11px;color:#94a3b8;margin:0 0 6px 0;font-weight:bold;">${t.billingAddress.toUpperCase()}</p>
<p style="font-size:13px;color:#334155;margin:0;line-height:19px;">[název_faktury_a_příjmení]<br>[fakturační adresa]<br>[faktura_postal_code] [faktura_city]<br>[faktura_země]</p>
</td>
</tr>
</table>
</td>
<td width="4%" class="mobile-hide"></td>
<td width="48%" valign="top" class="mobile-stack">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-radius:8px;">
<tr>
<td style="padding:16px;font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:11px;color:#94a3b8;margin:0 0 6px 0;font-weight:bold;">${t.shippingAddress.toUpperCase()}</p>
<p style="font-size:13px;color:#334155;margin:0;line-height:19px;">[jméno] [příjmení]<br>[adresa]<br>[poštovní směrovací číslo] [město]<br>[země]</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<!-- PAYMENT & SHIPPING -->
<tr>
<td style="padding:0 40px 25px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="48%" valign="top" class="mobile-stack" style="font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:11px;color:#94a3b8;margin:0 0 4px 0;font-weight:bold;">${t.payment.toUpperCase()}</p>
<p style="font-size:13px;color:#0088CE;margin:0;font-weight:bold;">[způsob platby]</p>
</td>
<td width="4%" class="mobile-hide"></td>
<td width="48%" valign="top" class="mobile-stack" style="font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:11px;color:#94a3b8;margin:0 0 4px 0;font-weight:bold;">${t.shipping.toUpperCase()}</p>
<p style="font-size:13px;color:#0088CE;margin:0;font-weight:bold;">[metoda_zásilky]</p>
</td>
</tr>
</table>
</td>
</tr>
<!-- DIVIDER -->
<tr>
<td style="padding:0 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:1px solid #e2e8f0;"></td></tr></table>
</td>
</tr>
<!-- CONTACT SECTION -->
<tr>
<td style="padding:25px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f9ff;border-radius:8px;border-left:4px solid #0088CE;">
<tr>
<td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;">
<p style="font-size:14px;font-weight:bold;color:#334155;margin:0 0 6px 0;">${t.needHelp}</p>
<p style="font-size:13px;color:#64748b;margin:0;line-height:20px;">${t.needHelpText.replace('{{phone}}', `<a href="tel:${marketData.phone.replace(/\s/g, '')}" style="color:#0088CE;text-decoration:none;font-weight:bold;">${phoneNbsp}</a>`).replace('{{email}}', `<a href="mailto:${marketData.email}" style="color:#0088CE;text-decoration:none;font-weight:bold;">${marketData.email}</a>`)}</p>
</td>
</tr>
</table>
</td>
</tr>
<!-- DIVIDER -->
<tr>
<td style="padding:0 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:1px solid #e2e8f0;"></td></tr></table>
</td>
</tr>
<!-- UPSELL SECTION -->
<tr>
<td style="padding:25px 40px 16px 40px;" class="mobile-padding">
<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#0088CE;letter-spacing:1px;margin:0 0 6px 0;">${t.upsellTitle.toUpperCase()}</p>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#64748b;margin:0;line-height:20px;">${t.upsellSubtitle}</p>
</td>
</tr>
<!-- UPSELL PRODUCTS ROW 1 -->
<tr>
<td style="padding:0 40px 12px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="48%" valign="top" class="mobile-stack">
${products[0] ? generateUpsellCard(products[0]) : ''}
</td>
<td width="4%" class="mobile-hide"></td>
<td width="48%" valign="top" class="mobile-stack">
${products[1] ? generateUpsellCard(products[1]) : ''}
</td>
</tr>
</table>
</td>
</tr>
<!-- UPSELL PRODUCTS ROW 2 -->
<tr>
<td style="padding:0 40px 20px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td width="48%" valign="top" class="mobile-stack">
${products[2] ? generateUpsellCard(products[2]) : ''}
</td>
<td width="4%" class="mobile-hide"></td>
<td width="48%" valign="top" class="mobile-stack">
${products[3] ? generateUpsellCard(products[3]) : ''}
</td>
</tr>
</table>
</td>
</tr>
<!-- MORE PRODUCTS -->
<tr>
<td align="center" style="padding:0 40px 35px 40px;" class="mobile-padding">
<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#64748b;margin:0;">
<a href="${marketData.accessoriesUrl}" target="_blank" style="color:#0088CE;text-decoration:none;font-weight:bold;">${t.moreAccessories}</a>
</p>
</td>
</tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
<!-- FOOTER -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;" class="mobile-wrapper">
<tr>
<td align="center" style="padding:25px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td align="center" style="padding-bottom:14px;">
<img src="https://jumpsafe.eu/mail-images/springfree-logo-blue.png" alt="${t.brandName}" width="80" height="80" style="display:block;opacity:0.5;">
</td>
</tr>
<tr>
<td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#94a3b8;padding-bottom:6px;">${t.brandName}&nbsp;|&nbsp;${marketData.email}&nbsp;|&nbsp;${phoneNbspClean}</td>
</tr>
<tr>
<td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#94a3b8;">${t.copyright}</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}
```

**Step 2: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/lib/templatePaymentConfirmed.ts
git commit -m "feat: add payment confirmed email template

Email 2b - sent after card payment or bank transfer received.
Timeline shows: Potvrzeno ✓ → Zaplaceno ✓ → Odesláno (gray)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Update API route and frontend

**Files:**
- Modify: `src/app/api/generate/route.ts`
- Modify: `src/app/page.tsx`

**Step 1: Update API route**

In `src/app/api/generate/route.ts`:

1. Add imports at top:
```typescript
import { generateOrderConfirmationEmailTemplate } from '@/lib/templateOrderConfirmation';
import { generatePaymentConfirmedEmailTemplate } from '@/lib/templatePaymentConfirmed';
```

2. Update TemplateType:
```typescript
export type TemplateType = 'order-confirmation' | 'order-bank-transfer' | 'payment-confirmed';
```

3. Update switch statement (around line 65):
```typescript
let html: string;
switch (templateType) {
  case 'order-confirmation':
    html = generateOrderConfirmationEmailTemplate(templateData);
    break;
  case 'order-bank-transfer':
    html = generateBankTransferEmailTemplate(templateData);
    break;
  case 'payment-confirmed':
    html = generatePaymentConfirmedEmailTemplate(templateData);
    break;
  default:
    html = generateOrderConfirmationEmailTemplate(templateData);
    break;
}
```

**Step 2: Update frontend**

In `src/app/page.tsx`:

1. Update TemplateType:
```typescript
type TemplateType = 'order-confirmation' | 'order-bank-transfer' | 'payment-confirmed';
```

2. Update TEMPLATE_OPTIONS:
```typescript
const TEMPLATE_OPTIONS: { value: TemplateType; label: string; description: string }[] = [
  { value: 'order-confirmation', label: 'Potvrzení objednávky', description: 'Email 1 - ihned po objednávce (všem)' },
  { value: 'order-bank-transfer', label: 'Čeká se na platbu', description: 'Email 2a - bankovní převod' },
  { value: 'payment-confirmed', label: 'Platba potvrzena', description: 'Email 2b - karta nebo převod přijat' },
];
```

3. Update default selected template:
```typescript
const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('order-confirmation');
```

4. Update emoji icons in the template list (around line 142):
```typescript
<span className="flag" style={{ fontSize: '16px' }}>
  {template.value === 'order-confirmation' ? '📦' : template.value === 'order-bank-transfer' ? '🏦' : '✅'}
</span>
```

**Step 3: Run dev server and test**

Run: `npm run dev`
Expected: All 3 templates render correctly in the UI

**Step 4: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/app/api/generate/route.ts src/app/page.tsx
git commit -m "feat: wire up new email templates to API and frontend

- Add order-confirmation, order-bank-transfer, payment-confirmed options
- Update UI with descriptive labels and icons
- Default to order-confirmation template

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Remove old template.ts (cleanup)

**Files:**
- Delete: `src/lib/template.ts`
- Modify: `src/app/api/generate/route.ts` (remove old import)

**Step 1: Remove import from API route**

In `src/app/api/generate/route.ts`, remove:
```typescript
import { generateEmailTemplate } from '@/lib/template';
```

**Step 2: Delete old template file**

```bash
rm src/lib/template.ts
```

**Step 3: Run build to verify**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old template.ts in favor of new email templates

Replaced by:
- templateOrderConfirmation.ts
- templateBankTransfer.ts
- templatePaymentConfirmed.ts

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary

After completing all tasks:

- **3 email templates** implemented:
  1. Order Confirmation (status box, no timeline)
  2. Awaiting Payment (orange timeline state)
  3. Payment Confirmed (blue timeline states)

- **Translations** added for all 7 markets

- **UI** updated with template selector

- **Old code** cleaned up
