import { generateEmailTemplate } from '../src/lib/template';
import { MARKETS, TRANSLATIONS, UPSELL_SKUS } from '../src/lib/markets';
import { PRODUCT_SKUS } from '../src/lib/product_dictionary';
import { validateHtmlTemplate } from '../src/lib/validators/html';

const market = 'cs' as const;
const marketData = MARKETS.find(m => m.code === market)!;
const t = TRANSLATIONS[market];

const products = UPSELL_SKUS.map(sku => ({
  sku,
  name: t.products[sku],
  price: '1999 ' + marketData.currencySymbol,
  pricePrefix: (sku === PRODUCT_SKUS.SUNSHADE || sku === PRODUCT_SKUS.COVER) ? 'od ' : '',
  link: marketData.websiteUrl + '/produkt/' + sku + '/',
}));

const html = generateEmailTemplate({ market, products, showPrices: true });
const result = validateHtmlTemplate(html);

console.log('=== HTML VALIDACE PRO EMAIL KLIENTY ===');
console.log('');
console.log('Velikost:', result.size.toLocaleString(), '/', '25,000 znaků');
console.log('Validní:', result.valid ? 'ANO ✓' : 'NE ✗');
console.log('');
console.log('Chyby:', result.errors.length === 0 ? 'Žádné ✓' : result.errors.join(', '));
console.log('');
console.log('Varování:');
result.warnings.forEach(w => console.log('  -', w));

console.log('');
console.log('=== KONTROLA PRO OUTLOOK ===');
console.log('MSO podmínky:', html.includes('<!--[if mso]>') ? '✓' : '✗');
console.log('VML namespace:', html.includes('xmlns:v=') ? '✓' : '✗');
console.log('Office namespace:', html.includes('xmlns:o=') ? '✓' : '✗');
console.log('OfficeDocumentSettings:', html.includes('o:OfficeDocumentSettings') ? '✓' : '✗');

console.log('');
console.log('=== KONTROLA PRO MOBILNÍ KLIENTY ===');
console.log('Viewport meta:', html.includes('viewport') ? '✓' : '✗');
console.log('Media queries:', html.includes('@media') ? '✓' : '✗');
console.log('Max-width 600px:', html.includes('max-width:600px') ? '✓' : '✗');

console.log('');
console.log('=== OBECNÉ BEST PRACTICES ===');
console.log('DOCTYPE:', html.includes('<!DOCTYPE html>') ? '✓' : '✗');
console.log('Charset UTF-8:', html.includes('charset') ? '✓' : '✗');
console.log('Table layout:', html.includes('cellpadding') ? '✓' : '✗');
console.log('Inline styly:', html.includes('style=') ? '✓' : '✗');
const hasHttpImages = html.includes('http://jumpsafe');
console.log('HTTPS obrázky:', hasHttpImages ? '✗ (používá HTTP)' : '✓');
