import type { AccountTransaction } from "@/hooks/useTransactions";
import type { Transaction } from "@/types/Transaction";

export function formatTxnDate(dateString: string): string {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
}

export function formatTxnMoney(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

function debitCreditAmount(t: AccountTransaction): { debit: string; credit: string } {
  if (t.type === "CREDIT") {
    return { debit: "0.00", credit: formatTxnMoney(t.amount) };
  }
  return { debit: formatTxnMoney(t.amount), credit: "0.00" };
}

export function mapToBankStatementRow(
  t: AccountTransaction,
  index: number,
): Transaction {
  const { debit, credit } = debitCreditAmount(t);
  return {
    no: String(index + 1),
    class: t.type === "CREDIT" ? "Credit" : "Debit",
    transDate: formatTxnDate(t.transactionDate),
    valueDate: formatTxnDate(t.valueDate),
    transactionDescription: t.description || "-",
    tellerNo: t.tellerNo != null ? String(t.tellerNo) : "-",
    chequeNo: t.chequeNo != null ? String(t.chequeNo) : "-",
    debit,
    credit,
    balance: formatTxnMoney(t.balance),
    remarks: t.reference || (t.isReversal ? "Reversal" : "") || "-",
  };
}

export function mapToClassifiedStatementRow(
  t: AccountTransaction,
  index: number,
  classificationLabel?: string,
): Transaction {
  const { debit, credit } = debitCreditAmount(t);
  return {
    no: String(index + 1),
    entryDate: formatTxnDate(t.createdAt),
    transDate: formatTxnDate(t.transactionDate),
    valueDate: formatTxnDate(t.valueDate),
    tellerNo: t.tellerNo != null ? String(t.tellerNo) : "-",
    transactionDescription: t.description || "-",
    transType: classificationLabel || t.type,
    chequeNo: t.chequeNo != null ? String(t.chequeNo) : "-",
    originalValue: formatTxnMoney(t.amount),
    debit,
    credit,
    balance: formatTxnMoney(t.balance),
    currency: "-",
    confirmation: "-",
    cleared: "-",
    exchangeRate: "-",
    clearance: "-",
  };
}

export function mapToCashBookRow(t: AccountTransaction, index: number): Transaction {
  const { debit, credit } = debitCreditAmount(t);
  return {
    no: String(index + 1),
    class: t.type === "CREDIT" ? "Receipt" : "Payment",
    transDate: formatTxnDate(t.transactionDate),
    transactionDescription: t.description || "-",
    tellerNo: t.tellerNo != null ? String(t.tellerNo) : "-",
    chequeNo: t.chequeNo != null ? String(t.chequeNo) : "-",
    debit,
    credit,
    balance: formatTxnMoney(t.balance),
    remarks: t.reference || "-",
  };
}

export function mapToTransMatchedRow(t: AccountTransaction, index: number): Transaction {
  const { debit, credit } = debitCreditAmount(t);
  return {
    no: String(index + 1),
    src: t.reference || "Ledger",
    class: t.isReversal ? "Reversal" : "Posted",
    transDate: formatTxnDate(t.transactionDate),
    transactionDescription: t.description || "-",
    tellerNo: t.tellerNo != null ? String(t.tellerNo) : "-",
    cheque: t.chequeNo != null ? String(t.chequeNo) : "-",
    debit,
    credit,
    balance: formatTxnMoney(t.balance),
  };
}

export function mapToQueryRow(t: AccountTransaction, index: number): Transaction {
  return mapToBankStatementRow(t, index);
}
