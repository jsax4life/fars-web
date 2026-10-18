export const RATE_CURRENCIES = ['NGN', 'USD', 'EUR', 'GBP'] as const;

/** API loan interest classification (Swagger) */
export const LOAN_INTEREST_TYPE_OPTIONS = [
  { value: 'SHORT_TERM', label: 'Short-term loan' },
  { value: 'TERM', label: 'Term loan' },
] as const;

export type LoanInterestType = (typeof LOAN_INTEREST_TYPE_OPTIONS)[number]['value'];

export function formatLoanInterestTypeLabel(loanType?: string | null): string {
  if (!loanType) return '-';
  const upper = loanType.toUpperCase().replace(/-/g, '_');
  if (upper === 'SHORT_TERM' || upper === 'SHORTTERM') return 'Short-term loan';
  if (upper === 'TERM' || upper === 'TERM_LOAN' || upper === 'TERMLOAN') return 'Term loan';
  if (loanType === 'shortTerm') return 'Short-term loan';
  if (loanType === 'termLoan') return 'Term loan';
  return loanType;
}

export function mergedLoanInterestRates(rate: {
  loanInterestRates?: Array<{
    rate: number;
    effectiveFrom: string;
    effectiveTo: string;
    loanType?: string;
  }>;
  shortTermLoanInterestRates?: Array<{
    rate: number;
    effectiveFrom: string;
    effectiveTo: string;
  }>;
  termLoanInterestRates?: Array<{
    rate: number;
    effectiveFrom: string;
    effectiveTo: string;
  }>;
}) {
  if (rate.loanInterestRates?.length) return rate.loanInterestRates;
  const short = (rate.shortTermLoanInterestRates || []).map((r) => ({
    ...r,
    loanType: 'SHORT_TERM',
  }));
  const term = (rate.termLoanInterestRates || []).map((r) => ({
    ...r,
    loanType: 'TERM',
  }));
  return [...short, ...term];
}

export function normalizeLoanInterestTypeForApi(loanType: string): LoanInterestType {
  const upper = loanType.toUpperCase().replace(/-/g, '_');
  if (upper === 'SHORT_TERM' || upper === 'SHORTTERM' || loanType === 'shortTerm') {
    return 'SHORT_TERM';
  }
  if (
    upper === 'TERM' ||
    upper === 'TERM_LOAN' ||
    upper === 'TERMLOAN' ||
    loanType === 'termLoan'
  ) {
    return 'TERM';
  }
  return loanType as LoanInterestType;
}

export type RateCurrency = (typeof RATE_CURRENCIES)[number];

/** Parse user-typed decimal; empty string → undefined */
export function parseDecimalInput(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

export function formatDecimalField(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function resolveBankName(
  bankId: string | undefined,
  banks: { id: string; name: string; code?: string }[],
  fallback?: string,
): string {
  if (!bankId) return fallback || '-';
  const byId = banks.find((b) => b.id === bankId);
  if (byId?.name) return byId.name;
  const byCode = banks.find((b) => b.code === bankId);
  if (byCode?.name) return byCode.name;
  return fallback || '-';
}

export function resolveDocumentBankName(
  doc: {
    bank?: { name?: string };
    bankName?: string;
    bankId?: string;
    bankCode?: string;
    rates?: Array<{ id?: string } | string>;
  },
  banks: { id: string; name: string; code?: string }[],
  ratesById: Map<string, { bank?: { name?: string }; bankId?: string }>,
): string {
  if (doc.bank?.name) return doc.bank.name;
  if (doc.bankName) return doc.bankName;
  if (doc.bankId) {
    const name = resolveBankName(doc.bankId, banks);
    if (name !== '-') return name;
  }
  if (doc.bankCode) {
    const name = resolveBankName(doc.bankCode, banks, doc.bankCode);
    if (name !== doc.bankCode) return name;
    const byCode = banks.find((b) => b.code === doc.bankCode);
    if (byCode?.name) return byCode.name;
  }
  if (doc.rates?.length) {
    for (const r of doc.rates) {
      const rateId = typeof r === 'object' && r?.id ? r.id : typeof r === 'string' ? r : undefined;
      if (!rateId) continue;
      const rate = ratesById.get(rateId);
      if (rate?.bank?.name) return rate.bank.name;
      if (rate?.bankId) {
        const name = resolveBankName(rate.bankId, banks);
        if (name !== '-') return name;
      }
    }
  }
  return '-';
}

export function optionalDecimalPayload(value: string): number | undefined {
  const n = parseDecimalInput(value);
  return n === undefined ? undefined : n;
}
