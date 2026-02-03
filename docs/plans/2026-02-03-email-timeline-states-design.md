# Email Timeline States Design

**Datum:** 2026-02-03
**Status:** Schváleno

## Kontext

Aktuální timeline v emailech (Potvrzeno → Odesláno → Doručeno) nedává smysl pro různé platební metody. Potřebujeme sjednotit flow tak, aby fungovalo pro platbu kartou i bankovním převodem.

## Nové email flow

### Email 1 - Potvrzení objednávky

**Komu:** všem zákazníkům, ihned po objednávce (nezávisle na platební metodě)

**Obsah:**
- Status box: "✓ Objednávka přijata" (jednoduchý box, ne timeline)
- Žádná zmínka o platbě (aby nebyli zmateni zákazníci, kteří už zaplatili kartou)
- Shrnutí objednávky
- Upsell produkty
- Kontakty

### Email 2a - Čeká se na platbu

**Komu:** zákazníci s bankovním převodem, krátce po Email 1

**Obsah:**
- Timeline: **Potvrzeno ✓** → **Čeká na platbu** (oranžová) → Odesláno (šedé)
- Platební údaje (banka, IBAN, BIC, variabilní symbol, částka)
- Shrnutí objednávky
- Upsell produkty
- Kontakty

### Email 2b - Platba potvrzena

**Komu:**
- Platba kartou: ihned po Email 1
- Bankovní převod: po připsání platby

**Obsah:**
- Timeline: **Potvrzeno ✓** → **Zaplaceno ✓** → Odesláno (šedé)
- Text: "Platba proběhla, připravujeme zásilku"
- Shrnutí objednávky
- Upsell produkty
- Kontakty

## Timeline vizuální stavy

### Aktivní krok (dokončený)
- Plný modrý kroužek (#0088CE)
- Text pod kroužkem v modré barvě

### Čekající krok (oranžový)
- Plný oranžový kroužek (#f59e0b)
- Text pod kroužkem v oranžové barvě
- Použití: "Čeká na platbu" v Email 2a

### Budoucí krok (neaktivní)
- Šedý kroužek (#e2e8f0)
- Text pod kroužkem v šedé barvě (#94a3b8)

## Status box pro Email 1

Jednoduchý box místo timeline:
- Modrý rámeček nebo pozadí
- Ikona checkmark
- Text: "Objednávka přijata"
- Musí fungovat spolehlivě ve všech email klientech

## Technická implementace

### Nové šablony (3 celkem)

```
src/lib/templates/
├── customer/
│   ├── order-confirmation.ts      # Email 1 - Potvrzení objednávky
│   ├── awaiting-payment.ts        # Email 2a - Čeká se na platbu
│   └── payment-confirmed.ts       # Email 2b - Platba potvrzena
```

### Timeline komponenta

Vytvořit reusable timeline komponentu s parametry:
- `steps`: pole kroků s názvy
- `activeStep`: index aktivního kroku
- `waitingStep`: index čekajícího kroku (oranžový) - volitelné

### Překlady

Nové klíče pro všech 7 jazyků:
- `orderReceived`: "Objednávka přijata"
- `confirmed`: "Potvrzeno"
- `awaitingPayment`: "Čeká na platbu"
- `paid`: "Zaplaceno"
- `shipped`: "Odesláno"

## Další kroky

1. Vytvořit Email 1 (potvrzení objednávky) se status boxem
2. Upravit stávající bank transfer šablonu na Email 2a
3. Vytvořit Email 2b (platba potvrzena)
4. Extrahovat timeline do reusable komponenty
5. Přidat překlady pro všech 7 jazyků

## Budoucí rozšíření

Toto je první fáze. Další typy emailů budou přidávány postupně dle potřeby.
