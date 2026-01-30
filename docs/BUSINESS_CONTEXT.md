# Business Context - Springfree Central Europe

> Tento dokument obsahuje klíčový kontext o podnikání. Aktualizovat při změnách.
> Poslední aktualizace: 2026-01-30

## O firmě

**Springfree Central Europe** - Oficiální distributor trampolín Springfree a jejich doplňků pro střední Evropu.

### Trhy (7 zemí)
| Země | Kód | Měna | Web |
|------|-----|------|-----|
| Česko | cs | CZK | jumpsafe.cz |
| Slovensko | sk | EUR | jumpsafe.sk |
| Rakousko | de | EUR | jumpsafe.at |
| Polsko | pl | PLN | jumpsafe.pl |
| Maďarsko | hu | EUR | jumpsafe.hu |
| Slovinsko | sl | EUR | jumpsafe.si |
| Chorvatsko | hr | EUR | jumpsafe.hr |

### Historie
- Firma existovala před COVIDem, vedena zastaralým způsobem
- Nebyl důraz na: weby, databáze, CRM, online komunikaci
- Po COVIDu e-commerce explodoval, firma zaspala
- Nyní vede Adam - řeší vše: komunikace, weby, grafika, marketing
- Marketingová agentura pomáhá s reklamou (Adam dodává grafiku)

---

## Technická infrastruktura

### Aktuální stav
- **7× WooCommerce webů** na Elementoru
- **Baselinker (Base.com)** - centrální správa:
  - Sklady pro všech 7 webů
  - Odesílání emailů (nahrazuje WP pluginy)
  - Automatické akce
- **Tento projekt** - generátor HTML emailů pro Baselinker

### Problémy s weby
- Původně špatně postavené
- Přetrvávající chyby: hosting, domény, Cloudflare
- Každá změna = 7× ruční práce

---

## Pain Points (oblasti k automatizaci)

### 🔴 Kritické (denně/týdně)

#### 1. Sedminásobná práce na webech
- Každá změna layoutu, funkce, obsahu → 7 webů zvlášť
- Ruční překlady, kontrola, nahrávání obrázků
- **Časová náročnost:** Extrémní

#### 2. Zákaznická komunikace
- Odpovídání na emaily a dotazy
- Opakující se otázky
- **Potenciál:** Šablony, AI asistent, chatbot

#### 3. Content & SEO
- Všechny weby mají málo obsahu
- Škodí to SEO i AI viditelnosti
- **Potřeba:**
  - FAQ sekce
  - Kvalitní články s odkazy na expertízy
  - Obrázky
  - Best practices pro AI/SEO
  - Hodnota pro uživatele

### 🟡 Středně kritické (měsíčně)

#### 4. Objednávky kontejnerů (nový sklad)
- Ruční kalkulace skladu
- Kontrola cen od Springfree Kanada
- Aktualizace stavů v Baselinkeru
- Výpočet marží (doprava, clo, doprava ke klientům)
- **Aktuálně:** Vše v Excelu, nepřehledné

#### 5. Komunikace s účetní
- Měsíční ruční posílání faktur
- **Potenciál:** Plná automatizace

#### 6. Ceníky pro partnery
- Dodavatelé, marketplace
- Ruční přepočty, chyby, nepřesnosti
- **Potřeba:** Dashboard s partnery, cenami, maržemi

### 🟢 Dlouhodobé (kvartálně+)

#### 7. Lead generation
- Hledání spolupracovníků: zahradní architekti, designéři, influenceři, velkoobchody
- Automatické oslovování
- Affiliate systémy

---

## Vize projektu

**Tento projekt NENÍ:**
- Nový Baselinker
- E-commerce systém
- Správa skladu

**Tento projekt JE:**
- AI-powered Business Hub
- Centrální místo pro úkoly mimo Baselinker
- Automatizace opakujících se procesů
- Nástroj pro celý tým (ne jen Adama)

### Plánované moduly

| Modul | Popis | Priorita |
|-------|-------|----------|
| Email šablony | Rozšíření současného generátoru | ✅ Existuje |
| Content Studio | Generování článků, FAQ | Vysoká |
| Translation Hub | Centrální překlady pro 7 jazyků | Vysoká |
| Customer AI | Odpovědi na maily, chatbot | Střední |
| Price Calculator | Marže, ceníky, dashboard | Střední |
| Lead Finder | Hledání partnerů, outreach | Nízká |
| Web Sync | Synchronizace změn na 7 webů | Budoucnost |

---

## Tým

- **Adam** - Vlastník, řeší vše
- **Marketingová agentura** - Reklamy (dostávají grafiku od Adama)
- **Další členové** - Budou systém používat

---

## Důležité poznámky

1. **Springfree = Kanadská značka** - Objednávky kontejnerů z Kanady
2. **Baselinker = Centrální systém** - Sklady, objednávky, emaily
3. **7 webů = 7× práce** - Hlavní bolest
4. **Excel = Nepřítel** - Všechny kalkulace jsou v Excelu, nepřehledné
5. **Překlady = Všude** - Každý obsah musí být v 7 jazycích
