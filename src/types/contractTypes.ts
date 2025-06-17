// src/types/contractTypes.ts
export interface Fee {
  product?: string;
  type?: string;
  rate?: string;
  vat?: string;
}

export interface ContractData {
  id?: string;
  loanId: string;
  agreementDate?: string;
  borrower?: string;
  agreementType?: string;
  signedDate?: string;
  clearingDays?: string;
  locStateCountry?: string;
  returnChargeRate?: string;
  returnChargeLimit?: string;
  camf?: string;
  camfCovenantRate?: string;
  camfOffCovenantRate?: string;
  turnOverLimit?: string;
  camfCovenantFrequency?: string;
  chargeCAMFOnTurnoverShortfall?: string;
  creditInterestRate?: string;
  whtRate?: string;
  overdraftLimit?: string;
  drRate?: string;
  exRate?: string;
  exChangeType?: string;
  loanType?: string;
  loanInterestRate?: string;
  loanPenalRate?: string;
  loanContribution?: string;
  fees?: Fee[];
  loanIds?: string[];
  amounts?: string[];
  lcCommission?: string;
  preNegotiationRate?: string;
  postNegotiationRate?: string;
  note?: string;
  rateAdjustments?: any;
  documents?: any;
}