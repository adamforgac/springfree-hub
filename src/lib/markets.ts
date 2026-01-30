// Market configuration and translations for all 7 markets
import { PRODUCT_NAMES, PRODUCT_SKUS } from './product_dictionary';

import { MarketCode } from './types';

export type { MarketCode };

export interface Market {
  code: MarketCode;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  language: string;
  websiteUrl: string;
  accessoriesUrl: string;
  email: string;
  phone: string;
  phoneHint?: string;
}

export const MARKETS: Market[] = [
  { code: 'cs', name: 'Česko', flag: '🇨🇿', currency: 'CZK', currencySymbol: 'Kč', language: 'Čeština', websiteUrl: 'https://www.trampoliny-springfree.cz', accessoriesUrl: 'https://www.trampoliny-springfree.cz/doplnky/', email: 'springfree@jumpsafe.eu', phone: '+420 777 559 607' },
  { code: 'sk', name: 'Slovensko', flag: '🇸🇰', currency: 'EUR', currencySymbol: '€', language: 'Slovenčina', websiteUrl: 'https://www.springfree.sk', accessoriesUrl: 'https://www.springfree.sk/prislusenstvo/', email: 'springfree@jumpsafe.eu', phone: '+420 777 559 607' },
  { code: 'de', name: 'Rakousko', flag: '🇦🇹', currency: 'EUR', currencySymbol: '€', language: 'Deutsch', websiteUrl: 'https://www.springfreetrampoline.at', accessoriesUrl: 'https://www.springfreetrampoline.at/zubehor/', email: 'springfree@jumpsafe.eu', phone: '+43 676 6411442' },
  { code: 'pl', name: 'Polsko', flag: '🇵🇱', currency: 'PLN', currencySymbol: 'zł', language: 'Polski', websiteUrl: 'https://www.springfree.pl', accessoriesUrl: 'https://www.springfree.pl/akcesoria/', email: 'springfree@jumpsafe.eu', phone: '+420 777 559 607', phoneHint: ' (English support)' },
  { code: 'hu', name: 'Maďarsko', flag: '🇭🇺', currency: 'EUR', currencySymbol: '€', language: 'Magyar', websiteUrl: 'https://www.springfree.hu', accessoriesUrl: 'https://www.springfree.hu/tartozekok/', email: 'springfree@jumpsafe.eu', phone: '+420 777 559 607', phoneHint: ' (English support)' },
  { code: 'sl', name: 'Slovinsko', flag: '🇸🇮', currency: 'EUR', currencySymbol: '€', language: 'Slovenščina', websiteUrl: 'https://www.springfree.si', accessoriesUrl: 'https://www.springfree.si/dodatki/', email: 'springfree@jumpsafe.eu', phone: '+420 777 559 607', phoneHint: ' (English support)' },
  { code: 'hr', name: 'Chorvatsko', flag: '🇭🇷', currency: 'EUR', currencySymbol: '€', language: 'Hrvatski', websiteUrl: 'https://www.springfree.com.hr', accessoriesUrl: 'https://www.springfree.com.hr/dodaci/', email: 'springfree@jumpsafe.eu', phone: '+420 777 559 607', phoneHint: ' (English support)' },
];

// Upsell product SKUs (fixed list)
export const UPSELL_SKUS = [
  PRODUCT_SKUS.FLEXRHOOP,
  PRODUCT_SKUS.SUNSHADE,
  PRODUCT_SKUS.COVER,
  PRODUCT_SKUS.WHEELS,
];

// All UI and email translations
export const TRANSLATIONS: Record<MarketCode, {
  // Email content
  emailTitle: string;
  brandName: string;
  greeting: string;
  orderConfirmed: string;
  trackOrder: string;
  timelineConfirmed: string;
  timelineSent: string;
  timelineDelivered: string;
  yourOrder: string;
  quantity: string;
  totalToPay: string;
  deliveryDetails: string;
  billingAddress: string;
  shippingAddress: string;
  payment: string;
  shipping: string;
  needHelp: string;
  needHelpText: string;
  upsellTitle: string;
  upsellSubtitle: string;
  addButton: string;
  moreAccessories: string;
  copyright: string;
  // Product names (for upsell)
  products: Record<string, string>;
}> = {
  cs: {
    emailTitle: 'Potvrzení objednávky',
    brandName: 'Springfree trampolíny',
    greeting: 'Děkujeme za Vaši objednávku!',
    orderConfirmed: 'Vážený/á {{name}}, Vaše objednávka č. {{order_number}} byla úspěšně přijata.',
    trackOrder: 'Sledovat stav',
    timelineConfirmed: 'Potvrzeno',
    timelineSent: 'Odesláno',
    timelineDelivered: 'Doručeno',
    yourOrder: 'Vaše objednávka',
    quantity: 'Množství',
    totalToPay: 'Celkem k úhradě',
    deliveryDetails: 'Dodací údaje',
    billingAddress: 'Fakturační adresa',
    shippingAddress: 'Doručovací adresa',
    payment: 'Platba',
    shipping: 'Doprava',
    needHelp: 'Potřebujete poradit?',
    needHelpText: 'Jsme tu pro Vás. Zavolejte nám na {{phone}} nebo napište na {{email}}',
    upsellTitle: 'Nezapomněli jste na něco?',
    upsellSubtitle: 'Pokud je ještě nemáte, stále je můžete přidat. Objednejte teď a pošleme vše společně.',
    addButton: 'Přidat',
    moreAccessories: '...a mnoho dalšího příslušenství',
    copyright: '© 2026 Springfree Trampoline. Všechna práva vyhrazena.',
    products: {
      [PRODUCT_SKUS.FLEXRHOOP]: PRODUCT_NAMES[PRODUCT_SKUS.FLEXRHOOP].cs,
      [PRODUCT_SKUS.SUNSHADE]: PRODUCT_NAMES[PRODUCT_SKUS.SUNSHADE].cs,
      [PRODUCT_SKUS.COVER]: PRODUCT_NAMES[PRODUCT_SKUS.COVER].cs,
      [PRODUCT_SKUS.WHEELS]: PRODUCT_NAMES[PRODUCT_SKUS.WHEELS].cs,
    },
  },
  sk: {
    emailTitle: 'Potvrdenie objednávky',
    brandName: 'Springfree trampolíny',
    greeting: 'Ďakujeme za Vašu objednávku!',
    orderConfirmed: 'Vážený/á {{name}}, Vaša objednávka č. {{order_number}} bola úspešne prijatá.',
    trackOrder: 'Sledovať stav',
    timelineConfirmed: 'Potvrdené',
    timelineSent: 'Odoslané',
    timelineDelivered: 'Doručené',
    yourOrder: 'Vaša objednávka',
    quantity: 'Množstvo',
    totalToPay: 'Celkom k úhrade',
    deliveryDetails: 'Dodacie údaje',
    billingAddress: 'Fakturačná adresa',
    shippingAddress: 'Doručovacia adresa',
    payment: 'Platba',
    shipping: 'Doprava',
    needHelp: 'Potrebujete poradiť?',
    needHelpText: 'Sme tu pre Vás. Zavolajte nám na {{phone}} alebo napíšte na {{email}}',
    upsellTitle: 'Nezabudli ste na niečo?',
    upsellSubtitle: 'Ak ich ešte nemáte, stále ich môžete pridať. Objednajte teraz a pošleme všetko spolu.',
    addButton: 'Pridať',
    moreAccessories: '...a mnoho ďalšieho príslušenstva',
    copyright: '© 2026 Springfree Trampoline. Všetky práva vyhradené.',
    products: {
      [PRODUCT_SKUS.FLEXRHOOP]: PRODUCT_NAMES[PRODUCT_SKUS.FLEXRHOOP].sk,
      [PRODUCT_SKUS.SUNSHADE]: PRODUCT_NAMES[PRODUCT_SKUS.SUNSHADE].sk,
      [PRODUCT_SKUS.COVER]: PRODUCT_NAMES[PRODUCT_SKUS.COVER].sk,
      [PRODUCT_SKUS.WHEELS]: PRODUCT_NAMES[PRODUCT_SKUS.WHEELS].sk,
    },
  },
  de: {
    emailTitle: 'Bestellbestätigung',
    brandName: 'Springfree Trampoline',
    greeting: 'Vielen Dank für Ihre Bestellung!',
    orderConfirmed: 'Sehr geehrte/r {{name}}, Ihre Bestellung Nr. {{order_number}} wurde erfolgreich angenommen.',
    trackOrder: 'Status verfolgen',
    timelineConfirmed: 'Bestätigt',
    timelineSent: 'Versandt',
    timelineDelivered: 'Geliefert',
    yourOrder: 'Ihre Bestellung',
    quantity: 'Menge',
    totalToPay: 'Gesamtbetrag',
    deliveryDetails: 'Lieferdetails',
    billingAddress: 'Rechnungsadresse',
    shippingAddress: 'Lieferadresse',
    payment: 'Zahlung',
    shipping: 'Versand',
    needHelp: 'Brauchen Sie Hilfe?',
    needHelpText: 'Wir sind für Sie da. Rufen Sie uns an unter {{phone}} oder schreiben Sie an {{email}}',
    upsellTitle: 'Haben Sie etwas vergessen?',
    upsellSubtitle: 'Falls Sie diese noch nicht haben, können Sie sie jetzt hinzufügen. Bestellen Sie jetzt und wir senden alles zusammen.',
    addButton: 'Hinzufügen',
    moreAccessories: '...und viele weitere Zubehörteile',
    copyright: '© 2026 Springfree Trampoline. Alle Rechte vorbehalten.',
    products: {
      [PRODUCT_SKUS.FLEXRHOOP]: PRODUCT_NAMES[PRODUCT_SKUS.FLEXRHOOP].de,
      [PRODUCT_SKUS.SUNSHADE]: PRODUCT_NAMES[PRODUCT_SKUS.SUNSHADE].de,
      [PRODUCT_SKUS.COVER]: PRODUCT_NAMES[PRODUCT_SKUS.COVER].de,
      [PRODUCT_SKUS.WHEELS]: PRODUCT_NAMES[PRODUCT_SKUS.WHEELS].de,
    },
  },
  pl: {
    emailTitle: 'Potwierdzenie zamówienia',
    brandName: 'Springfree trampoliny',
    greeting: 'Dziękujemy za zamówienie!',
    orderConfirmed: 'Szanowny/a {{name}}, Twoje zamówienie nr {{order_number}} zostało przyjęte.',
    trackOrder: 'Śledź status',
    timelineConfirmed: 'Potwierdzone',
    timelineSent: 'Wysłane',
    timelineDelivered: 'Dostarczone',
    yourOrder: 'Twoje zamówienie',
    quantity: 'Ilość',
    totalToPay: 'Razem do zapłaty',
    deliveryDetails: 'Dane dostawy',
    billingAddress: 'Adres do faktury',
    shippingAddress: 'Adres dostawy',
    payment: 'Płatność',
    shipping: 'Dostawa',
    needHelp: 'Potrzebujesz pomocy?',
    needHelpText: 'Jesteśmy do Twojej dyspozycji. Zadzwoń pod numer {{phone}} lub napisz na {{email}}',
    upsellTitle: 'Czy o czymś zapomniałeś/aś?',
    upsellSubtitle: 'Jeśli jeszcze ich nie masz, możesz je teraz dodać. Zamów teraz, a wyślemy wszystko razem.',
    addButton: 'Dodaj',
    moreAccessories: '...i wiele innych akcesoriów',
    copyright: '© 2026 Springfree Trampoline. Wszelkie prawa zastrzeżone.',
    products: {
      [PRODUCT_SKUS.FLEXRHOOP]: PRODUCT_NAMES[PRODUCT_SKUS.FLEXRHOOP].pl,
      [PRODUCT_SKUS.SUNSHADE]: PRODUCT_NAMES[PRODUCT_SKUS.SUNSHADE].pl,
      [PRODUCT_SKUS.COVER]: PRODUCT_NAMES[PRODUCT_SKUS.COVER].pl,
      [PRODUCT_SKUS.WHEELS]: PRODUCT_NAMES[PRODUCT_SKUS.WHEELS].pl,
    },
  },
  hu: {
    emailTitle: 'Rendelés-visszaigazolás',
    brandName: 'Springfree trambulinok',
    greeting: 'Köszönjük a rendelését!',
    orderConfirmed: 'Tisztelt {{name}}, a(z) {{order_number}} számú rendelése sikeresen rögzítésre került.',
    trackOrder: 'Állapot követése',
    timelineConfirmed: 'Visszaigazolva',
    timelineSent: 'Elküldve',
    timelineDelivered: 'Kézbesítve',
    yourOrder: 'Az Ön rendelése',
    quantity: 'Mennyiség',
    totalToPay: 'Fizetendő összeg',
    deliveryDetails: 'Szállítási adatok',
    billingAddress: 'Számlázási cím',
    shippingAddress: 'Szállítási cím',
    payment: 'Fizetés',
    shipping: 'Szállítás',
    needHelp: 'Segítségre van szüksége?',
    needHelpText: 'Készséggel állunk rendelkezésére. Hívjon minket: {{phone}} vagy írjon: {{email}}',
    upsellTitle: 'Elfelejtett valamit?',
    upsellSubtitle: 'Ha még nincs meg, most hozzáadhatja. Rendeljen most és mindent egyben szállítunk.',
    addButton: 'Hozzáadás',
    moreAccessories: '...és még sok más kiegészítő',
    copyright: '© 2026 Springfree Trampoline. Minden jog fenntartva.',
    products: {
      [PRODUCT_SKUS.FLEXRHOOP]: PRODUCT_NAMES[PRODUCT_SKUS.FLEXRHOOP].hu,
      [PRODUCT_SKUS.SUNSHADE]: PRODUCT_NAMES[PRODUCT_SKUS.SUNSHADE].hu,
      [PRODUCT_SKUS.COVER]: PRODUCT_NAMES[PRODUCT_SKUS.COVER].hu,
      [PRODUCT_SKUS.WHEELS]: PRODUCT_NAMES[PRODUCT_SKUS.WHEELS].hu,
    },
  },
  sl: {
    emailTitle: 'Potrditev naročila',
    brandName: 'Springfree trampolini',
    greeting: 'Hvala za vaše naročilo!',
    orderConfirmed: 'Spoštovani {{name}}, vaše naročilo št. {{order_number}} je bilo uspešno sprejeto.',
    trackOrder: 'Sledite statusu',
    timelineConfirmed: 'Potrjeno',
    timelineSent: 'Poslano',
    timelineDelivered: 'Dostavljeno',
    yourOrder: 'Vaše naročilo',
    quantity: 'Količina',
    totalToPay: 'Skupaj za plačilo',
    deliveryDetails: 'Podatki o dostavi',
    billingAddress: 'Naslov za račun',
    shippingAddress: 'Naslov za dostavo',
    payment: 'Plačilo',
    shipping: 'Dostava',
    needHelp: 'Potrebujete pomoč?',
    needHelpText: 'Smo vam na voljo. Pokličite nas na {{phone}} ali pišite na {{email}}',
    upsellTitle: 'Ste kaj pozabili?',
    upsellSubtitle: 'Če jih še nimate, jih lahko še vedno dodate. Naročite zdaj in vse pošljemo skupaj.',
    addButton: 'Dodajte',
    moreAccessories: '...in še veliko druge opreme',
    copyright: '© 2026 Springfree Trampoline. Vse pravice pridržane.',
    products: {
      [PRODUCT_SKUS.FLEXRHOOP]: PRODUCT_NAMES[PRODUCT_SKUS.FLEXRHOOP].sl,
      [PRODUCT_SKUS.SUNSHADE]: PRODUCT_NAMES[PRODUCT_SKUS.SUNSHADE].sl,
      [PRODUCT_SKUS.COVER]: PRODUCT_NAMES[PRODUCT_SKUS.COVER].sl,
      [PRODUCT_SKUS.WHEELS]: PRODUCT_NAMES[PRODUCT_SKUS.WHEELS].sl,
    },
  },
  hr: {
    emailTitle: 'Potvrda narudžbe',
    brandName: 'Springfree trampolini',
    greeting: 'Hvala na Vašoj narudžbi!',
    orderConfirmed: 'Poštovani {{name}}, Vaša narudžba br. {{order_number}} je uspješno zaprimljena.',
    trackOrder: 'Pratite status',
    timelineConfirmed: 'Potvrđeno',
    timelineSent: 'Poslano',
    timelineDelivered: 'Isporučeno',
    yourOrder: 'Vaša narudžba',
    quantity: 'Količina',
    totalToPay: 'Ukupno za plaćanje',
    deliveryDetails: 'Podaci o isporuci',
    billingAddress: 'Adresa za račun',
    shippingAddress: 'Adresa za isporuku',
    payment: 'Plaćanje',
    shipping: 'Dostava',
    needHelp: 'Trebate pomoć?',
    needHelpText: 'Tu smo za Vas. Nazovite nas na {{phone}} ili pišite na {{email}}',
    upsellTitle: 'Jeste li nešto zaboravili?',
    upsellSubtitle: 'Ako ih još nemate, još uvijek ih možete dodati. Naručite sada i sve šaljemo zajedno.',
    addButton: 'Dodajte',
    moreAccessories: '...i mnogo druge opreme',
    copyright: '© 2026 Springfree Trampoline. Sva prava pridržana.',
    products: {
      [PRODUCT_SKUS.FLEXRHOOP]: PRODUCT_NAMES[PRODUCT_SKUS.FLEXRHOOP].hr,
      [PRODUCT_SKUS.SUNSHADE]: PRODUCT_NAMES[PRODUCT_SKUS.SUNSHADE].hr,
      [PRODUCT_SKUS.COVER]: PRODUCT_NAMES[PRODUCT_SKUS.COVER].hr,
      [PRODUCT_SKUS.WHEELS]: PRODUCT_NAMES[PRODUCT_SKUS.WHEELS].hr,
    },
  },
};
