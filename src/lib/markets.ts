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
  timelinePaid: string;
  timelineShipped: string;
  orderReceivedTitle: string;
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
    timelinePaid: 'Zaplaceno',
    timelineShipped: 'Odesláno',
    orderReceivedTitle: 'Objednávka přijata',
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
    upsellSubtitle: 'Podívejte se na doplňky, se kterými bude skákání ještě větší zážitek a péče o trampolínu naprostá hračka v každém ročním období.',
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
    timelinePaid: 'Zaplatené',
    timelineShipped: 'Odoslané',
    orderReceivedTitle: 'Objednávka prijatá',
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
    upsellSubtitle: 'Pozrite sa na doplnky, s ktorými bude skákanie ešte väčší zážitok a starostlivosť o trampolínu hračka v každom ročnom období.',
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
    timelinePaid: 'Bezahlt',
    timelineShipped: 'Versandt',
    orderReceivedTitle: 'Bestellung eingegangen',
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
    upsellSubtitle: 'Entdecken Sie Zubehör, mit dem das Springen zum noch größeren Erlebnis wird und die Trampolinpflege das ganze Jahr über zum Kinderspiel.',
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
    timelinePaid: 'Opłacone',
    timelineShipped: 'Wysłane',
    orderReceivedTitle: 'Zamówienie przyjęte',
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
    upsellSubtitle: 'Zobacz akcesoria, dzięki którym skakanie stanie się jeszcze większą przygodą, a dbanie o trampolinę będzie dziecinnie proste przez cały rok.',
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
    timelinePaid: 'Kifizetve',
    timelineShipped: 'Elküldve',
    orderReceivedTitle: 'Rendelés beérkezett',
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
    upsellSubtitle: 'Fedezze fel a kiegészítőket, amelyekkel az ugrálás még nagyobb élménnyé válik, a trambulin gondozása pedig gyerekjáték lesz minden évszakban.',
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
    timelinePaid: 'Plačano',
    timelineShipped: 'Poslano',
    orderReceivedTitle: 'Naročilo sprejeto',
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
    upsellSubtitle: 'Oglejte si dodatke, s katerimi bo skakanje še večje doživetje, skrb za trampolin pa otročje lahka v vsakem letnem času.',
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
    timelinePaid: 'Plaćeno',
    timelineShipped: 'Poslano',
    orderReceivedTitle: 'Narudžba zaprimljena',
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
    upsellSubtitle: 'Pogledajte dodatke uz koje će skakanje biti još veći doživljaj, a briga o trampolinu dječja igra u svakom godišnjem dobu.',
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

// Bank transfer email specific translations
export const BANK_TRANSFER_TRANSLATIONS: Record<MarketCode, {
  emailTitle: string;
  greeting: string;
  orderReceived: string;
  bankTransferChosen: string;
  willShipAfterPayment: string;
  timelineWaitingPayment: string;
  bankDetailsTitle: string;
  bankName: string;
  iban: string;
  bic: string;
  variableSymbol: string;
  amount: string;
  speedUpTitle: string;
  speedUpText: string;
}> = {
  cs: {
    emailTitle: 'Platební údaje k objednávce',
    greeting: 'Děkujeme za Vaši objednávku!',
    orderReceived: 'Vážený/á {{name}}, Vaše objednávka č. {{order_number}} byla úspěšně přijata.',
    bankTransferChosen: 'Zvolili jste platbu bankovním převodem.',
    willShipAfterPayment: 'Vaši objednávku odešleme, jakmile obdržíme platbu na náš účet.',
    timelineWaitingPayment: 'Čeká na platbu',
    bankDetailsTitle: 'Platební údaje',
    bankName: 'Banka',
    iban: 'IBAN',
    bic: 'BIC/SWIFT',
    variableSymbol: 'Variabilní symbol',
    amount: 'Částka k úhradě',
    speedUpTitle: 'Chcete urychlit odeslání?',
    speedUpText: 'Odpovězte na tento email a přiložte potvrzení o odeslání platby z Vaší banky. Objednávku pak zpracujeme přednostně.',
  },
  sk: {
    emailTitle: 'Platobné údaje k objednávke',
    greeting: 'Ďakujeme za Vašu objednávku!',
    orderReceived: 'Vážený/á {{name}}, Vaša objednávka č. {{order_number}} bola úspešne prijatá.',
    bankTransferChosen: 'Zvolili ste platbu bankovým prevodom.',
    willShipAfterPayment: 'Vašu objednávku odošleme, akonáhle obdržíme platbu na náš účet.',
    timelineWaitingPayment: 'Čaká na platbu',
    bankDetailsTitle: 'Platobné údaje',
    bankName: 'Banka',
    iban: 'IBAN',
    bic: 'BIC/SWIFT',
    variableSymbol: 'Variabilný symbol',
    amount: 'Suma na úhradu',
    speedUpTitle: 'Chcete urýchliť odoslanie?',
    speedUpText: 'Odpovedzte na tento email a priložte potvrdenie o odoslaní platby z Vašej banky. Objednávku potom spracujeme prednostne.',
  },
  de: {
    emailTitle: 'Zahlungsinformationen zur Bestellung',
    greeting: 'Vielen Dank für Ihre Bestellung!',
    orderReceived: 'Sehr geehrte/r {{name}}, Ihre Bestellung Nr. {{order_number}} wurde erfolgreich angenommen.',
    bankTransferChosen: 'Sie haben Banküberweisung als Zahlungsmethode gewählt.',
    willShipAfterPayment: 'Wir versenden Ihre Bestellung, sobald die Zahlung auf unserem Konto eingegangen ist.',
    timelineWaitingPayment: 'Warten auf Zahlung',
    bankDetailsTitle: 'Zahlungsinformationen',
    bankName: 'Bank',
    iban: 'IBAN',
    bic: 'BIC/SWIFT',
    variableSymbol: 'Verwendungszweck',
    amount: 'Zu zahlender Betrag',
    speedUpTitle: 'Möchten Sie den Versand beschleunigen?',
    speedUpText: 'Antworten Sie auf diese E-Mail und fügen Sie eine Zahlungsbestätigung Ihrer Bank bei. Wir werden Ihre Bestellung dann bevorzugt bearbeiten.',
  },
  pl: {
    emailTitle: 'Dane do przelewu',
    greeting: 'Dziękujemy za zamówienie!',
    orderReceived: 'Szanowny/a {{name}}, Twoje zamówienie nr {{order_number}} zostało przyjęte.',
    bankTransferChosen: 'Wybrałeś/aś płatność przelewem bankowym.',
    willShipAfterPayment: 'Wyślemy Twoje zamówienie, gdy tylko otrzymamy płatność na nasze konto.',
    timelineWaitingPayment: 'Oczekuje na płatność',
    bankDetailsTitle: 'Dane do przelewu',
    bankName: 'Bank',
    iban: 'IBAN',
    bic: 'BIC/SWIFT',
    variableSymbol: 'Tytuł przelewu',
    amount: 'Kwota do zapłaty',
    speedUpTitle: 'Chcesz przyspieszyć wysyłkę?',
    speedUpText: 'Odpowiedz na ten email i dołącz potwierdzenie przelewu z Twojego banku. Wtedy przetworzymy Twoje zamówienie priorytetowo.',
  },
  hu: {
    emailTitle: 'Fizetési adatok a rendeléshez',
    greeting: 'Köszönjük a rendelését!',
    orderReceived: 'Tisztelt {{name}}, a(z) {{order_number}} számú rendelése sikeresen rögzítésre került.',
    bankTransferChosen: 'Ön banki átutalást választott fizetési módként.',
    willShipAfterPayment: 'Rendelését azonnal elküldjük, amint a befizetés megérkezik számlánkra.',
    timelineWaitingPayment: 'Fizetésre vár',
    bankDetailsTitle: 'Fizetési adatok',
    bankName: 'Bank',
    iban: 'IBAN',
    bic: 'BIC/SWIFT',
    variableSymbol: 'Közlemény',
    amount: 'Fizetendő összeg',
    speedUpTitle: 'Szeretné gyorsítani a szállítást?',
    speedUpText: 'Válaszoljon erre az e-mailre, és csatolja a bankjától kapott átutalási igazolást. Így rendelését elsőbbséggel kezeljük.',
  },
  sl: {
    emailTitle: 'Podatki za plačilo naročila',
    greeting: 'Hvala za vaše naročilo!',
    orderReceived: 'Spoštovani {{name}}, vaše naročilo št. {{order_number}} je bilo uspešno sprejeto.',
    bankTransferChosen: 'Izbrali ste plačilo z bančnim nakazilom.',
    willShipAfterPayment: 'Vaše naročilo bomo odposlali takoj, ko prejmemo plačilo na naš račun.',
    timelineWaitingPayment: 'Čaka na plačilo',
    bankDetailsTitle: 'Podatki za plačilo',
    bankName: 'Banka',
    iban: 'IBAN',
    bic: 'BIC/SWIFT',
    variableSymbol: 'Referenca',
    amount: 'Znesek za plačilo',
    speedUpTitle: 'Želite pospešiti pošiljanje?',
    speedUpText: 'Odgovorite na to e-pošto in priložite potrdilo o nakazilu iz vaše banke. Vaše naročilo bomo nato obdelali prednostno.',
  },
  hr: {
    emailTitle: 'Podaci za plaćanje narudžbe',
    greeting: 'Hvala na Vašoj narudžbi!',
    orderReceived: 'Poštovani {{name}}, Vaša narudžba br. {{order_number}} je uspješno zaprimljena.',
    bankTransferChosen: 'Odabrali ste plaćanje bankovnom doznakom.',
    willShipAfterPayment: 'Vašu narudžbu ćemo poslati čim primimo uplatu na naš račun.',
    timelineWaitingPayment: 'Čeka uplatu',
    bankDetailsTitle: 'Podaci za plaćanje',
    bankName: 'Banka',
    iban: 'IBAN',
    bic: 'BIC/SWIFT',
    variableSymbol: 'Poziv na broj',
    amount: 'Iznos za uplatu',
    speedUpTitle: 'Želite ubrzati slanje?',
    speedUpText: 'Odgovorite na ovaj email i priložite potvrdu o uplati iz Vaše banke. Tada ćemo Vašu narudžbu obraditi prioritetno.',
  },
};

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
