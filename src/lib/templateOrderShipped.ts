import { MarketCode } from './types';
import { MARKETS, TRANSLATIONS, ORDER_SHIPPED_TRANSLATIONS, FOOTER_BANK_INFO } from './markets';
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

export function generateOrderShippedEmailTemplate(data: TemplateData): string {
  const { market, products, showPrices } = data;
  const t = TRANSLATIONS[market];
  const os = ORDER_SHIPPED_TRANSLATIONS[market];
  const marketData = MARKETS.find(m => m.code === market)!;

  // Phone with non-breaking spaces (for contact section with hint)
  const phoneNbsp = marketData.phone.replace(/ /g, '&nbsp;') + (marketData.phoneHint ? '&nbsp;' + marketData.phoneHint.replace(/ /g, '&nbsp;') : '');
  // Phone with non-breaking spaces (clean, for footer)
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
<title>${os.emailTitle}</title>
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
<h1 style="font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:bold;color:#2d3748;margin:0 0 14px 0;line-height:1.2;">${os.greeting}</h1>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#64748b;margin:0 0 12px 0;max-width:480px;">${os.orderShipped.replace('{{name}}', '[jméno]').replace('{{order_number}}', '<strong style="color:#0088CE;">[číslo_objednávky]</strong>')}</p>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#334155;margin:0;max-width:480px;font-weight:500;">${os.onItsWay}</p>
</td>
</tr>
<!-- TIMELINE: Potvrzeno checkmark -> Zaplaceno checkmark -> Odeslano checkmark (all completed) -->
<tr>
<td style="padding:24px 40px 20px 40px;" class="mobile-padding">
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
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="border-top:2px solid #0088CE;"></td></tr></table>
</td>
<td width="80" align="center" valign="top">
<!--[if mso]><table border="0" cellpadding="0" cellspacing="0"><tr><td width="32" height="32" bgcolor="#0088CE" style="border-radius:16px;text-align:center;"><span style="font-family:Arial,sans-serif;font-size:16px;color:#ffffff;line-height:32px;">&#10003;</span></td></tr></table><![endif]-->
<!--[if !mso]><!--><div style="width:32px;height:32px;background-color:#0088CE;border-radius:50%;text-align:center;line-height:32px;margin:0 auto;"><span style="font-family:Arial,sans-serif;font-size:16px;color:#ffffff;">&#10003;</span></div><!--<![endif]-->
<div style="padding-top:8px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:#0088CE;text-align:center;">${t.timelineShipped}</div>
</td>
</tr>
</table>
</td>
</tr>
<!-- TRACK ORDER BUTTON -->
<tr>
<td align="center" valign="top" style="padding:0 40px 30px 40px;" class="mobile-padding">
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="background-color:#0088CE;border-radius:8px;">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="[odkaz_na_objednávku_68172]" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="10%" strokecolor="#0088CE" fillcolor="#0088CE"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${t.trackOrder}</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><a href="[odkaz_na_objednávku_68172]" target="_blank" style="display:inline-block;padding:14px 36px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;background-color:#0088CE;border-radius:8px;">${t.trackOrder}</a><!--<![endif]-->
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
<p style="font-size:12px;color:rgba(255,255,255,0.85);margin:0 0 6px 0;letter-spacing:1px;">${t.totalOrderPrice.toUpperCase()}</p>
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
<td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#94a3b8;padding-bottom:6px;">${FOOTER_BANK_INFO[market]}</td>
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
