import { MarketCode } from './types';

export const PRODUCT_SKUS = {
  FLEXRHOOP: '182464000243',
  SUNSHADE: '182464000922',
  COVER: '182464000946',
  WHEELS: '182464000236',
} as const;

export type ProductSku = typeof PRODUCT_SKUS[keyof typeof PRODUCT_SKUS];

export const PRODUCT_NAMES: Record<ProductSku, Record<MarketCode, string>> = {
  [PRODUCT_SKUS.FLEXRHOOP]: {
    cs: 'Basketbalový koš FlexrHoop',
    sk: 'Basketbalový kôš FlexrHoop',
    de: 'Basketball-Korb FlexrHoop',
    pl: 'Kosz do koszykówki FlexrHoop',
    hu: 'Kosárlabda kosár FlexrHoop',
    sl: 'Košarkarski koš FlexrHoop',
    hr: 'FlexrHoop košarkaški obruč',
  },
  [PRODUCT_SKUS.SUNSHADE]: {
    cs: 'Sluneční clona',
    sk: 'Slnečná clona',
    de: 'Sonnendach',
    pl: 'Osłona przeciwsłoneczna',
    hu: 'Napellenző',
    sl: 'Sončna zaslonka',
    hr: 'Štitnik za sunce',
  },
  [PRODUCT_SKUS.COVER]: {
    cs: 'Krycí plachta',
    sk: 'Plachta',
    de: 'Abdeckung',
    pl: 'Pokrowiec',
    hu: 'Trambulin borítás',
    sl: 'Pokrivna ponjava',
    hr: 'Zaštitno pokrivalo',
  },
  [PRODUCT_SKUS.WHEELS]: {
    cs: 'Pojezdová kola',
    sk: 'Pojazdné kolesá',
    de: 'Verschieberäder',
    pl: 'Koła podróżne',
    hu: 'Utazó kerekek',
    sl: 'Tekalna kolesa',
    hr: 'Kotači za premještanje',
  },
};

export const PRODUCT_SLUGS: Record<ProductSku, Record<MarketCode, string>> = {
  [PRODUCT_SKUS.FLEXRHOOP]: {
    cs: 'basketbalovy-kos-flexrhoop',
    sk: 'basketbalovy-kos-flexrhoop',
    de: 'basketball-korb-flexrhoop',
    pl: 'kosz-do-koszykowki-flexrhoop',
    hu: 'kosarlabda-kosar-flexrhoop',
    sl: 'kosarkarski-kos-flexrhoop',
    hr: 'flexrhoop-kosarkaski-obruc',
  },
  [PRODUCT_SKUS.SUNSHADE]: {
    cs: 'slunecni-clona',
    sk: 'slnecna-clona',
    de: 'sonnendach',
    pl: 'oslona-przeciwsloneczna',
    hu: 'napellenzo',
    sl: 'soncna-zaslonka',
    hr: 'stitnik-za-sunce',
  },
  [PRODUCT_SKUS.COVER]: {
    cs: 'kryci-plachta',
    sk: 'plachta',
    de: 'abdeckung',
    pl: 'pokrowiec',
    hu: 'trambulin-boritas',
    sl: 'pokrivni-ponjava',
    hr: 'pokrivanje-ploviti',
  },
  [PRODUCT_SKUS.WHEELS]: {
    cs: 'pojezdova-kola',
    sk: 'pojazdne-kolesa',
    de: 'verrutsch-hilfe',
    pl: 'kola-podrozne',
    hu: 'utazo-kerekek',
    sl: 'tekalna-kolesa',
    hr: 'klizni-kotaci',
  },
};
