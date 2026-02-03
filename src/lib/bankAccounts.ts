// Bank account details per market/currency
import { MarketCode } from './types';

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  iban: string;
  bic: string;
  accountHolder: string;
}

// Bank accounts by market code
export const BANK_ACCOUNTS: Record<MarketCode, BankAccount> = {
  // Czech Republic - CZK account
  cs: {
    bankName: 'Československá obchodní banka, a.s.',
    accountNumber: '290667005/0300',
    iban: 'CZ80 0300 0000 0002 9066 7005',
    bic: 'CEKOCZPP',
    accountHolder: 'MarketLink Int. s.r.o.',
  },
  // Slovakia - EUR account (ČSOB)
  sk: {
    bankName: 'Československá obchodní banka, a.s.',
    accountNumber: '290667021/0300',
    iban: 'CZ36 0300 0000 0002 9066 7021',
    bic: 'CEKOCZPP',
    accountHolder: 'MarketLink Int. s.r.o.',
  },
  // Austria - EUR account (Erste Bank)
  de: {
    bankName: 'Erste Bank',
    accountNumber: '841-954-412/00',
    iban: 'AT89 2011 1841 9544 1200',
    bic: 'GIBAATWWXXX',
    accountHolder: 'MarketLink Int. s.r.o.',
  },
  // Poland - PLN account
  pl: {
    bankName: 'Československá obchodní banka, a.s.',
    accountNumber: '354431086/0300',
    iban: 'CZ98 0300 0000 0003 5443 1086',
    bic: 'CEKOCZPP',
    accountHolder: 'MarketLink Int. s.r.o.',
  },
  // Hungary - EUR account (ČSOB)
  hu: {
    bankName: 'Československá obchodní banka, a.s.',
    accountNumber: '290667021/0300',
    iban: 'CZ36 0300 0000 0002 9066 7021',
    bic: 'CEKOCZPP',
    accountHolder: 'MarketLink Int. s.r.o.',
  },
  // Slovenia - EUR account (ČSOB)
  sl: {
    bankName: 'Československá obchodní banka, a.s.',
    accountNumber: '290667021/0300',
    iban: 'CZ36 0300 0000 0002 9066 7021',
    bic: 'CEKOCZPP',
    accountHolder: 'MarketLink Int. s.r.o.',
  },
  // Croatia - EUR account (ČSOB)
  hr: {
    bankName: 'Československá obchodní banka, a.s.',
    accountNumber: '290667021/0300',
    iban: 'CZ36 0300 0000 0002 9066 7021',
    bic: 'CEKOCZPP',
    accountHolder: 'MarketLink Int. s.r.o.',
  },
};
