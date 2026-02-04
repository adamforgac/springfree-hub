# Bankovní účty - Přehled použití podle trhů

Tento dokument popisuje, který bankovní účet se používá pro který trh (zemi) v email šablonách.

## Přehled účtů

| Účet | Měna | Banka | IBAN | BIC |
|------|------|-------|------|-----|
| **CZK** | CZK | ČSOB | CZ80 0300 0000 0002 9066 7005 | CEKOCZPP |
| **EUR** | EUR | ČSOB | CZ36 0300 0000 0002 9066 7021 | CEKOCZPP |
| **EUR_AT** | EUR | Erste Bank | AT89 2011 1841 9544 1200 | GIBAATWWXXX |
| **PLN** | PLN | ČSOB | CZ98 0300 0000 0003 5443 1086 | CEKOCZPP |

Majitel všech účtů: **MarketLink Int. s.r.o.**

---

## Přiřazení účtů k trhům

### 🇨🇿 Česko (cs)
- **Měna:** CZK
- **Účet:** CZK (ČSOB)
- **IBAN:** CZ80 0300 0000 0002 9066 7005

### 🇸🇰 Slovensko (sk)
- **Měna:** EUR
- **Účet:** EUR (ČSOB)
- **IBAN:** CZ36 0300 0000 0002 9066 7021

### 🇦🇹 Rakousko (de)
- **Měna:** EUR
- **Účet:** EUR_AT (Erste Bank) ⚠️ *Jiný účet než ostatní EUR země!*
- **IBAN:** AT89 2011 1841 9544 1200

### 🇵🇱 Polsko (pl)
- **Měna:** PLN
- **Účet:** PLN (ČSOB)
- **IBAN:** CZ98 0300 0000 0003 5443 1086

### 🇭🇺 Maďarsko (hu)
- **Měna:** EUR
- **Účet:** EUR (ČSOB)
- **IBAN:** CZ36 0300 0000 0002 9066 7021

### 🇸🇮 Slovinsko (sl)
- **Měna:** EUR
- **Účet:** EUR (ČSOB)
- **IBAN:** CZ36 0300 0000 0002 9066 7021

### 🇭🇷 Chorvatsko (hr)
- **Měna:** EUR
- **Účet:** EUR (ČSOB)
- **IBAN:** CZ36 0300 0000 0002 9066 7021

---

## Důležité poznámky

1. **Rakousko má speciální účet** - používá Erste Bank (AT89...) místo ČSOB, protože rakouští zákazníci preferují lokální banku.

2. **Slovensko, Maďarsko, Slovinsko a Chorvatsko** sdílejí stejný EUR účet u ČSOB (CZ36...).

3. **Variabilní symbol** v emailech = číslo objednávky z Baselinkeru.

4. **Footer emailů** obsahuje zkrácenou verzi bankovních údajů (IBAN | BIC | Banka).

---

## Kde se účty používají v kódu

- **`src/lib/bankAccounts.ts`** - definice všech účtů podle market kódu
- **`src/lib/markets.ts`** → `FOOTER_BANK_INFO` - zkrácené info pro patičku emailů
- **`src/lib/templateBankTransfer.ts`** - plné údaje v sekci "Platební údaje"

---

## Shrnutí tabulkou

| Trh | Kód | Měna | Soubor účtu |
|-----|-----|------|-------------|
| Česko | cs | CZK | CZK.txt |
| Slovensko | sk | EUR | EUR.txt |
| Rakousko | de | EUR | EUR_AT.txt |
| Polsko | pl | PLN | PLN.txt |
| Maďarsko | hu | EUR | EUR.txt |
| Slovinsko | sl | EUR | EUR.txt |
| Chorvatsko | hr | EUR | EUR.txt |
