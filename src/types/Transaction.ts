// types/transaction.ts
export interface Transaction {
    sNo?: string;
    no?: string;
    entryDate?: string;
    transactionDate?: string;
    valueDate?: string;
    tellerNumber?: string;
    transactionDescription?: string;
    transactionType?: string;
    chequeNo?: string;
    originalValue?: string;
    class?: string;
    debit?: string;
    credit?: string;
    balance?: string;
    remarks?: string;
    currency?: string;
    confirmation?: string;
    cleared?: string;
    exchangeRate?: string;
    clearance?: string;
    src?: string;
    date?: string; // Generic date field
    [key: string]: any; // To allow dynamic properties
}