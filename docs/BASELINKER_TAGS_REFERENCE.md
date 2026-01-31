# Baselinker Template Tags Reference

> **CRITICAL**: These are the ONLY valid tags. Do NOT invent or modify tag names.
> **ENCODING WARNING**: Tag `[seznam_položek(X)]` has encoding issues when copy-pasting from web apps. Always type it manually in Baselinker!

---

## Image Hosting Rules

All images used in email templates must be hosted on `https://jumpsafe.eu/mail-images/`.

### Product Images
Since Baselinker has no dynamic image tag, product images are pre-uploaded with their SKU as filename:

```
https://jumpsafe.eu/mail-images/[i_sku].png
```

**Example**: For product with SKU `182464000946`, the image URL is:
```
https://jumpsafe.eu/mail-images/182464000946.png
```

### Logo Images
| Image | URL |
|-------|-----|
| White logo (for dark backgrounds) | `https://jumpsafe.eu/mail-images/springfree-logo-white.png` |
| Blue logo (for light backgrounds) | `https://jumpsafe.eu/mail-images/springfree-logo-blue.png` |

---

## Order Tags
| Tag | Description |
|-----|-------------|
| `[status]` | Order status code |
| `[status_name_short]` | Short status name |
| `[status_name]` | Full status name |
| `[název_zdroje]` | Source name |
| `[datum objednávky]` | Order date |
| `[status_date]` | Status date |
| `[způsob platby]` | Payment method |
| `[payment_id]` | Payment ID |
| `[status_payment]` | Payment status |
| `[uhrazená suma]` | Paid amount |
| `[nezaplacená částka]` | Unpaid amount |
| `[cena_za objednávku]` | Order total price |
| `[items_price]` | Items price |
| `[měna]` | Currency |
| `[položky_váha]` | Items weight |
| `[další_pole_1]` | Additional field 1 |
| `[další_pole_2]` | Additional field 2 |
| `[i__o_97218]` | Custom field |
| `[client_comments]` | Client comments |
| `[sell_comments]` | Seller comments |
| `[číslo_objednávky]` | Order number |
| `[číslo_objednávky_obchod]` | Shop order number |
| `[číslo_objednávky_zdroj]` | Source order number |
| `[číslo_objednávky_zdroj_2]` | Source order number 2 |
| `[číslo_objednávky_warehouse]` | Warehouse order number |
| `[order_aa_last_error]` | Last automation error |
| `[order_hash]` | Order hash |
| `[odkaz_na_objednávku]` | Order tracking link (default) |
| `[odkaz_na_objednávku_68172]` | **CUSTOM: Order status page link (Springfree)** - USE THIS! |
| `[products_photo_link]` | Products photo link |

## Client Tags
| Tag | Description |
|-----|-------------|
| `[e-mail]` | Email address |
| `[telefon]` | Phone number |
| `[jméno a příjmení]` | Full name |
| `[jméno]` | First name |
| `[příjmení]` | Last name |
| `[společnost]` | Company |
| `[adresa]` | Address |
| `[poštovní směrovací číslo]` | Postal code |
| `[město]` | City |
| `[stát]` | State |
| `[země]` | Country |
| `[country_en]` | Country (English) |
| `[country_de]` | Country (German) |
| `[client_login]` | Client login |

## Product List Tags
| Tag | Description |
|-----|-------------|
| `[items_count]` | Number of items |
| `[items_list]` | Items list (default format) |
| `[items_list2]` | Items list (format 2) |
| `[items_list3]` | Items list (format 3) |
| `[seznam_položek4]` | Items list (format 4) |
| `[items_list_sku]` | Items list with SKU |
| `[items_list_sku2]` | Items list with SKU (format 2) |
| `[items_list_missing]` | Missing items list |
| `[items_list_missing2]` | Missing items list (format 2) |
| `[items_list_picked]` | Picked items list |
| `[items_list_packed]` | Packed items list |
| `[seznam_položek(X)]` | **Custom items list template** - see below! |
| `[products_sku]` | Products SKU |
| `[seznam aukcí]` | Auctions list |

## Invoice Tags
| Tag | Description |
|-----|-------------|
| `[název_faktury_a_příjmení]` | Invoice name and surname |
| `[číslo faktury]` | Invoice number |
| `[fakturační adresa]` | Billing address |
| `[faktura_postal_code]` | Billing postal code |
| `[faktura_city]` | Billing city |
| `[invoice_state]` | Invoice state |
| `[faktura_země]` | Billing country |
| `[faktura_firma]` | Billing company |
| `[faktura_vat_reg_no]` | VAT registration number |
| `[externí_číslo_faktury]` | External invoice number |
| `[invoice_deadline]` | Invoice deadline |
| `[invoice_deadline_days]` | Invoice deadline days |
| `[days_of_deferred_payment]` | Days of deferred payment |
| `[invoice_gov_id]` | Government invoice ID |
| `[invoice_gov_date]` | Government invoice date |
| `[invoice_gov_status]` | Government invoice status |
| `[client_want_invoice]` | Client wants invoice |
| `[proforma_number]` | Proforma number |
| `[opravné_číslo]` | Correction number |
| `[corrections_numbers]` | Corrections numbers |
| `[číslo účtenky]` | Receipt number |
| `[payment_link]` | Payment link |
| `[faktura_odkaz]` | Invoice link |
| `[opravný_odkaz]` | Correction link |
| `[příjem_odkaz]` | Receipt link |

## Delivery Tags
| Tag | Description |
|-----|-------------|
| `[cena_zásilky]` | Shipping price |
| `[metoda_zásilky]` | Shipping method |
| `[číslo zásilky]` | Shipment number |
| `[shipment_number_oldest]` | Oldest shipment number |
| `[číslo_ zásilky]` | All shipment numbers |
| `[shipment_track_link]` | Tracking link |
| `[shipment_track_link_oldest]` | Oldest tracking link |
| `[shipment_track_link_en]` | Tracking link (English) |
| `[shipment_track_link_all]` | All tracking links |
| `[shipment_track_link_all2]` | All tracking links (format 2) |
| `[shipment_track_link_all_en]` | All tracking links (English) |
| `[shipment_track_link_all_en2]` | All tracking links (English, format 2) |
| `[shipment_courier]` | Courier name |
| `[místo vyzvednutí]` | Pickup point |
| `[pickup_point_name]` | Pickup point name |
| `[pickup_point_address]` | Pickup point address |
| `[pickup_point_postal_code]` | Pickup point postal code |
| `[pickup_point_city]` | Pickup point city |
| `[pickup_point_id]` | Pickup point ID |

## Other Tags
| Tag | Description |
|-----|-------------|
| `[jméno_profilu]` | Profile name |
| `[aktuální čas]` | Current time |
| `[dnešní datum]` | Today's date |
| `[vypočítat(X)]` | Calculate expression |

---

## Item-Level Tags (Inside `[seznam_položek(X)]`)

These tags are used ONLY inside the product loop template `[seznam_položek(...)]`:

| Tag | Description |
|-----|-------------|
| `[i_ord]` | Item order/position |
| `[i_id]` | Item ID |
| `[i_variant_id]` | Variant ID |
| `[i_sku]` | Product SKU |
| `[i_ean]` | EAN code |
| `[p_location]` | Product location |
| `[i_name]` | Product name |
| `[i_quantity]` | Quantity |
| `[i_atributy]` | Attributes |
| `[i_price]` | Item price |
| `[i_currency]` | Item currency |
| `[i_auction_nr]` | Auction number |
| `[i_source]` | Item source |
| `[p_stop]` | Stop further items |

---

## Custom Product List - `[seznam_položek(X)]`

### Syntax
```
[seznam_položek(YOUR_HTML_TEMPLATE_HERE)]
```

Everything between `(` and `)]` is repeated for each product in the order.

---

## ⛔ CRITICAL: Correct Structure for `[seznam_položek()]`

> **THIS IS THE #1 CAUSE OF BROKEN TEMPLATES!**
>
> The tag MUST be placed BETWEEN table rows, and its content MUST start with `<tr>` and end with `</tr>`.

### ✅ CORRECT - Tag outputs complete `<tr>` rows:
```html
</tr>
[seznam_položek(<tr><td><table>...product card...</table></td></tr>)]
<tr>
```

### ❌ WRONG - Tag inside a `<td>`:
```html
<tr>
  <td>
    [seznam_položek(<table>...product card...</table>)]
  </td>
</tr>
```

**Why it matters:**
- Baselinker repeats EVERYTHING inside `[seznam_položek()]` for each product
- If the content doesn't start with `<tr>`, the HTML structure breaks
- If the tag is inside `<td>`, the closing `)]` gets duplicated after each product

---

### Working Example with Product Card
```html
[seznam_položek(<tr><td style="padding:0 40px 15px 40px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;"><tr><td width="80" style="padding:15px;vertical-align:middle;"><img src="https://jumpsafe.eu/mail-images/[i_sku].png" alt="[i_name]" width="60" height="60" style="display:block;border-radius:6px;"></td><td style="padding:15px 10px;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;"><p style="font-size:14px;font-weight:bold;color:#334155;margin:0 0 4px 0;">[i_name]</p><p style="font-size:12px;color:#64748b;margin:0;">Množství: [i_quantity]x</p></td><td style="padding:15px;text-align:right;vertical-align:middle;white-space:nowrap;font-family:Arial,Helvetica,sans-serif;"><p style="font-size:15px;font-weight:bold;color:#0088CE;margin:0;">[i_price] [i_currency]</p></td></tr></table></td></tr>)]
```

**Key points:**
- Content starts with `<tr>` and ends with `</tr>`
- Everything is on ONE LINE (no newlines inside the tag)
- The `<table>` for product card is INSIDE `<td>`
- **NO `)]` sequence anywhere else in the template!** Baselinker matches the FIRST `)]` it finds!

### ⚠️ MSO Comments Warning

MSO conditional comments for Outlook MUST NOT contain `)]`:

```html
<!-- ✅ CORRECT -->
<!--[if mso]>...<![endif]-->

<!-- ❌ WRONG - contains )]  which breaks [seznam_položek()] -->
<!--[if (gte mso 9)|(IE)]>...<![endif]-->
```

### Simple Text Example
```html
[seznam_položek(<tr><td>[i_quantity]x [i_name] - [i_price] [i_currency]</td></tr>)]
```

---

### Dynamic Product Images
Since Baselinker doesn't have an image URL tag, use this workaround:
1. Host product images at `https://jumpsafe.eu/mail-images/`
2. Name each image with its SKU (e.g., `182464000946.png`)
3. Use `[i_sku]` in the image URL: `https://jumpsafe.eu/mail-images/[i_sku].png`

---

## ⚠️ Browser Preview vs. Baselinker

**DŮLEŽITÉ:** Preview v prohlížeči bude vypadat DIVNĚ - to je normální!

Prohlížeč interpretuje `<tr>` uvnitř `[seznam_položek()]` jako skutečný HTML element, což způsobí:
- Text `[seznam_položek()` se zobrazí nahoře stránky
- Produktová karta se zobrazí odděleně

**Toto NENÍ chyba!** V Baselinkeru se celý tag nahradí skutečnými produkty a email bude vypadat správně.

**Vždy testovat odesláním skutečného emailu z Baselinkeru, ne v browser preview!**

---

## Template Limits

- **Max size**: 25,000 characters (NOT bytes!)
- **Format**: HTML or plain text
- **Attachments**: Maximum 3 files
- **Images**: Must use HTTPS URLs

---

## Troubleshooting History

### Problem: Email content duplicated for each product (2026-01-27)

**Příznaky:**
- Celý obsah emailu po produktové sekci se opakuje pro každý produkt
- V raw emailu vidíte `)]` následované duplikovaným obsahem

**Příčiny a řešení:**

1. **Tag uvnitř `<td>` místo mezi `<tr>`**
   - ❌ `<tr><td>[seznam_položek(...)]</td></tr>`
   - ✅ `</tr>[seznam_položek(<tr>...</tr>)]<tr>`

2. **Obsah nezačíná `<tr>`**
   - ❌ `[seznam_položek(<table>...</table>)]`
   - ✅ `[seznam_položek(<tr><td><table>...</table></td></tr>)]`

3. **MSO komentář obsahuje `)]`**
   - ❌ `<!--[if (gte mso 9)|(IE)]>` (obsahuje `)]`!)
   - ✅ `<!--[if mso]>`

**Ověřeno funkční: 2026-01-27**

---

*Last updated: 2026-01-27*
