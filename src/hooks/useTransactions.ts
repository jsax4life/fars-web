import Endpoints from "@/lib/endpoints";
import { useApi } from "./useApi";
import { toast } from 'sonner';

export interface TransactionPreview {
  transactionDate: string;
  valueDate: string;
  description: string;
  debit: number;
  credit: number;
  amount: number;
  type: "CREDIT" | "DEBIT";
  balance: number;
  rowIndex: string | number;
  tellerNo?: number | null;
  chequeNo?: number | null;
  extractedReference?: string | null;
  isReversal?: boolean;
  reversalPairIndex?: number;
  classificationId?: string;
}

export interface TransactionCreatePayload extends TransactionPreview {
  // Same structure as preview, but will be sent to create endpoint
}

export interface AccountTransaction {
  id: string;
  bankAccountId: string;
  uploadedById: string;
  transactionDate: string;
  valueDate: string;
  amount: number;
  balance: number;
  type: "CREDIT" | "DEBIT";
  description: string;
  reference: string | null;
  chequeNo: number | null;
  tellerNo: number | null;
  classificationId: string;
  user: any | null;
  createdAt: string;
  updatedAt: string;
  isReversal: boolean;
}

export interface TransactionsResponse {
  data: AccountTransaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const useTransactions = () => {
  const api = useApi();

  /**
   * Upload and process transaction file
   * @param accountId - The ID of the account
   * @param file - The file to upload (FormData)
   * @returns Promise<TransactionPreview[]> - Array of preview transactions
   */
  const uploadTransaction = async (
    accountId: string,
    file: File
  ): Promise<TransactionPreview[] | undefined> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = Endpoints.uploadTransaction + accountId + '/upload';
      const response = await api.post(endpoint, formData);
      
      // Handle new response format: { message: string, data: TransactionPreview[] }
      if (response && typeof response === 'object') {
        if (response.data && Array.isArray(response.data)) {
          return response.data as TransactionPreview[];
        }
        // Fallback: if response is directly an array (backward compatibility)
        if (Array.isArray(response)) {
          return response as TransactionPreview[];
        }
      }
      
      toast.error('Unexpected response format from upload');
      return undefined;
    } catch (error: any) {
      toast.error('Failed to upload transaction: ' + (error?.message || 'Unknown error'));
      return undefined;
    }
  };

  /**
   * Create transactions from preview data
   * @param accountId - The ID of the account
   * @param transactions - Array of transaction data to create
   * @returns Promise<any> - The created transactions or undefined on error
   */
  const createTransactions = async (
    accountId: string,
    transactions: TransactionCreatePayload[]
  ): Promise<any | undefined> => {
    try {
      const endpoint = Endpoints.createTransactions + accountId + '/create';
      // Backend expects transactions wrapped in an object with 'items' property
      const payload = {
        items: transactions
      };
      const response = await api.post(endpoint, payload);
      
      if (response) {
        toast.success('Transactions created successfully!');
        return response;
      }
      
      return undefined;
    } catch (error: any) {
      toast.error('Failed to create transactions: ' + (error?.message || 'Unknown error'));
      return undefined;
    }
  };

  /**
   * Get all transactions for an account with pagination and optional filters
   * @param accountId - The ID of the account
   * @param options - Query parameters for filtering and pagination
   * @returns Promise<TransactionsResponse | undefined> - Transactions with pagination metadata
   */
  const getAccountTransactions = async (
    accountId: string,
    options?: {
      from?: string;
      to?: string;
      classificationId?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<TransactionsResponse | undefined> => {
    try {
      const { from, to, classificationId, page = 1, limit = 50 } = options || {};
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (from) queryParams.append('from', from);
      if (to) queryParams.append('to', to);
      if (classificationId) queryParams.append('classificationId', classificationId);
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      const endpoint = `${Endpoints.getAccountTransactions}${accountId}/all?${queryParams.toString()}`;
      const response = await api.get(endpoint);
      
      if (response && response.data && Array.isArray(response.data)) {
        return response as TransactionsResponse;
      }
      
      toast.error('Unexpected response format from get transactions');
      return undefined;
    } catch (error: any) {
      toast.error('Failed to get transactions: ' + (error?.message || 'Unknown error'));
      return undefined;
    }
  };

  /**
   * Get a single transaction by ID
   * @param transactionId - The ID of the transaction
   * @returns Promise<AccountTransaction | undefined> - The transaction data
   */
  const getTransactionById = async (
    transactionId: string
  ): Promise<AccountTransaction | undefined> => {
    try {
      const endpoint = Endpoints.getTransactionById + transactionId;
      const response = await api.get(endpoint);
      
      if (response) {
        return response as AccountTransaction;
      }
      
      return undefined;
    } catch (error: any) {
      toast.error('Failed to get transaction: ' + (error?.message || 'Unknown error'));
      return undefined;
    }
  };

  /**
   * Update a transaction
   * @param transactionId - The ID of the transaction
   * @param data - The transaction data to update
   * @returns Promise<AccountTransaction | undefined> - The updated transaction
   */
  const updateTransaction = async (
    transactionId: string,
    data: Partial<AccountTransaction>
  ): Promise<AccountTransaction | undefined> => {
    try {
      const endpoint = Endpoints.updateTransaction + transactionId;
      const response = await api.patch(endpoint, data);
      
      if (response) {
        toast.success('Transaction updated successfully!');
        return response as AccountTransaction;
      }
      
      return undefined;
    } catch (error: any) {
      toast.error('Failed to update transaction: ' + (error?.message || 'Unknown error'));
      return undefined;
    }
  };

  /**
   * Delete a transaction
   * @param transactionId - The ID of the transaction to delete
   * @returns Promise<boolean> - True if deletion was successful
   */
  const deleteTransaction = async (
    transactionId: string
  ): Promise<boolean> => {
    try {
      const endpoint = Endpoints.deleteTransaction + transactionId;
      const response = await api.delete(endpoint);
      
      if (response) {
        toast.success('Transaction deleted successfully!');
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast.error('Failed to delete transaction: ' + (error?.message || 'Unknown error'));
      return false;
    }
  };

  /**
   * Delete multiple transactions by their IDs
   * @param transactionIds - Array of transaction IDs to delete
   * @returns Promise<boolean> - True if deletion was successful
   */
  const deleteMultipleTransactions = async (
    transactionIds: string[]
  ): Promise<boolean> => {
    try {
      const endpoint = Endpoints.deleteMultipleTransactions;
      const payload = {
        ids: transactionIds
      };
      const response = await api.delete(endpoint, payload);
      
      if (response) {
        toast.success(`${transactionIds.length} transaction(s) deleted successfully!`);
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast.error('Failed to delete transactions: ' + (error?.message || 'Unknown error'));
      return false;
    }
  };

  return {
    uploadTransaction,
    createTransactions,
    getAccountTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    deleteMultipleTransactions,
  };
};

