export interface RateFeeEntry {
  name: string;
  rate: string;
  amount: string;
  effectiveFrom: string;
  effectiveTo: string;
  /** rate = percentage/fee rate; amount = flat amount */
  chargeType: 'rate' | 'amount';
}

export function emptyRateFee(): RateFeeEntry {
  return {
    name: '',
    rate: '',
    amount: '',
    effectiveFrom: '',
    effectiveTo: '',
    chargeType: 'rate',
  };
}

export function buildFeesPayload(fees: RateFeeEntry[]) {
  return fees
    .filter((f) => f.name.trim())
    .map((f) => {
      if (f.chargeType === 'amount') {
        const amount = Number(f.amount);
        return {
          name: f.name.trim(),
          ...(Number.isFinite(amount) ? { amount } : {}),
        };
      }
      const rate = Number(f.rate);
      return {
        name: f.name.trim(),
        ...(Number.isFinite(rate) ? { rate } : {}),
        ...(f.effectiveFrom ? { effectiveFrom: f.effectiveFrom } : {}),
        ...(f.effectiveTo ? { effectiveTo: f.effectiveTo } : {}),
      };
    });
}
