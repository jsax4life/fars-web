import Endpoints from "@/lib/endpoints";
import { useApi } from "./useApi"; // Assuming useApi is in the same directory or adjust path
import { toast } from 'sonner';

// Interface for creating a bank account (based on your POST request body)
interface CreateBankAccountData {
  accountNumber: string;
  accountName: string;
  accountType: string; // e.g., "SAVINGS"
  currency: string;    // e.g., "NGN"
  clientId: string;
  contractId: string;
}

// Interface for updating a bank account (fields are optional)
interface UpdateBankAccountData {
  accountNumber?: string;
  accountName?: string;
  accountType?: string;
  currency?: string;
  // clientId is typically not updatable after creation
  contractId?: string; // As "Update a bank account by ID and account contract"
}

// Interface for the bank account data returned by the API (based on your POST response)
export interface BankAccount {
  accountCode: string; // This seems like the unique ID for the bank account record
  accountNumber: string;
  accountName: string;
  accountType: string;
  currency: string;
  clientId: string;
  contractId: string;
  createdAt: string; // Assuming ISO date string
  updatedAt: string; // Assuming ISO date string
}

export const useBankAccounts = () => {
    const api = useApi();

    /**
     * Get all bank accounts
     * @returns Promise<BankAccount[] | undefined> - The list of bank accounts or undefined on error
     */
    const getBankAccounts = async (): Promise<BankAccount[] | undefined> => {
        try {
            const request = await api.get(Endpoints.getAllBankAccounts);
            if (request) {
                return request as BankAccount[]; // Assuming the API returns an array of BankAccount
            }
        } catch (error: any) {
            toast.error('Failed to get bank accounts: ' + (error?.message || 'Unknown error'));
        }
    };

    /**
     * Create a new bank account
     * @param data - The data for the new bank account
     * @returns Promise<BankAccount | boolean> - The created bank account data or false on failure
     */
    const createBankAccount = async (data: CreateBankAccountData): Promise<BankAccount | false> => {
        try {
            const request = await api.post(Endpoints.createBankAccount, data);
            if (request) {
                toast.success('Bank account created successfully!');
                return request as BankAccount;
            }
            // If request is falsy but no error was thrown by api.post
            toast.error('Failed to create bank account: Invalid response from server.');
            return false;
        } catch (error: any) {
            toast.error('Failed to create bank account: ' + (error?.message || 'Unknown error'));
            return false;
        }
    };

    /**
     * Update an existing bank account
     * @param id - The ID (accountCode) of the bank account to update
     * @param data - The data to update the bank account with
     * @returns Promise<BankAccount | boolean> - The updated bank account data or false on failure
     */
    const updateBankAccount = async (id: string, data: UpdateBankAccountData): Promise<BankAccount | false> => {
        try {
            const request = await api.patch(Endpoints.updateBankAccountById + id, data);
            if (request) {
                toast.success('Bank account updated successfully!');
                return request as BankAccount;
            }
            toast.error('Failed to update bank account: Invalid response from server.');
            return false;
        } catch (error: any) {
            toast.error('Failed to update bank account: ' + (error?.message || 'Unknown error'));
            return false;
        }
    };

    /**
     * Delete a bank account
     * @param id - The ID (accountCode) of the bank account to delete
     * @returns Promise<boolean> - True if deletion was successful, false otherwise
     */
    const deleteBankAccount = async (id: string): Promise<boolean> => {
        try {
            const request = await api.delete(Endpoints.deleteBankAccountById + id);
            // api.delete might return the deleted object, a success message, or just a status.
            // If it throws an error on failure, this check might be for truthiness.
            if (request) {
                toast.success('Bank account deleted successfully!');
                return true;
            }
            // If api.delete returns a falsy value for a successful non-content response (like 204)
            // this logic might need adjustment based on how useApi handles it.
            // For now, assuming a truthy response on success from api.delete itself.
            toast.error('Failed to delete bank account: No confirmation from server.');
            return false;
        } catch (error: any) {
            toast.error('Failed to delete bank account: ' + (error?.message || 'Unknown error'));
            return false;
        }
    };

    return {
        getBankAccounts,
        createBankAccount,
        updateBankAccount,
        deleteBankAccount
    };
};