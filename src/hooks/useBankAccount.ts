import Endpoints from "@/lib/endpoints";
import { useApi } from "./useApi"; // Assuming useApi is in the same directory or adjust path
import { toast } from 'sonner';

// Interface for creating a bank account (based on your POST request body)
interface CreateBankAccountData {
  bankId: string;
  accountNumber: string;
  accountName: string;
  accountType: string; // e.g., "SAVINGS"
  currency: string;    // e.g., "NGN"
  clientId: string;
  rateId?: string;
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

// Client-specific bank accounts response structure (as provided)
export interface ClientBankAccountResponse {
  id: string;
  code: string;
  bankId: string;
  accountNumber: string;
  accountName: string;
  accountType: string; // e.g., "SAVINGS"
  currency: string;    // e.g., "NGN"
  openingBalance: number;
  clientId: string;
  rateId: string | null;
  createdAt: string;
  updatedAt: string;
  bank?: {
    id: string;
    name: string;
    code: string;
  };
}

export const useBankAccounts = () => {
    const api = useApi();
    // Prevent duplicate concurrent requests per clientId
    const inFlightClientRequests = new Map<string, Promise<ClientBankAccountResponse[] | undefined>>();

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
     * Get bank accounts for a specific client
     * @param clientId - The client ID
     * @returns Promise<ClientBankAccountResponse[] | undefined>
     */
    const getBankAccountsByClient = async (clientId: string): Promise<ClientBankAccountResponse[] | undefined> => {
        const endpoint = (Endpoints.getClientBankAccounts.endsWith('/') ? Endpoints.getClientBankAccounts : Endpoints.getClientBankAccounts + '/') + clientId;

        // If a request for this clientId is already in flight, return the same promise
        if (inFlightClientRequests.has(clientId)) {
            return inFlightClientRequests.get(clientId)!;
        }

        const exec = (async (): Promise<ClientBankAccountResponse[] | undefined> => {
            const maxAttempts = 3;
            let attempt = 0;
            while (attempt < maxAttempts) {
                try {
                    const request = await api.get(endpoint);
                    if (request) {
                        return request as ClientBankAccountResponse[];
                    }
                    // Fallback: no data but also no thrown error
                    return undefined;
                } catch (error: any) {
                    const status = error?.status;
                    // Handle rate limiting with exponential backoff
                    if (status === 429) {
                        attempt += 1;
                        if (attempt >= maxAttempts) {
                            toast.error('Rate limit exceeded. Please try again in a moment.');
                            return undefined;
                        }
                        // Backoff: 500ms, 1000ms
                        const delay = 500 * Math.pow(2, attempt - 1);
                        await sleep(delay);
                        continue;
                    }
                    // Non-rate-limit error: show friendly error once
                    toast.error('Failed to get client bank accounts: ' + (error?.message || 'Unknown error'));
                    return undefined;
                }
            }
            return undefined;
        })();

        inFlightClientRequests.set(clientId, exec);
        try {
            return await exec;
        } finally {
            inFlightClientRequests.delete(clientId);
        }
    };

    const getBankAccountById = async (id: string) => {
        try {
            const request = await api.get(Endpoints.getBankAccountById.replace(/\/$/, '') + '/' + id);
            if (request) return request;
        } catch (error: any) {
            toast.error('Failed to get bank account: ' + (error?.message || 'Unknown error'));
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

    /**
     * Get staff assignments for a bank account
     * @param accountId - The bank account ID
     * @returns Promise with assigned staff members
     */
    const getStaffAssignmentsByAccount = async (accountId: string): Promise<any[] | undefined> => {
        try {
            const request = await api.get(Endpoints.getStaffAssignmentsByAccount + accountId);
            if (request) {
                return Array.isArray(request) ? request : (request?.data || []);
            }
        } catch (error: any) {
            toast.error('Failed to get staff assignments: ' + (error?.message || 'Unknown error'));
        }
    };

    /**
     * Get account assignments for a staff member
     * @param staffId - The staff/user ID
     * @returns Promise with assigned accounts
     */
    const getStaffAssignmentsByStaff = async (staffId: string): Promise<any[] | undefined> => {
        try {
            const request = await api.get(Endpoints.getStaffAssignmentsByStaff + staffId);
            if (request) {
                return Array.isArray(request) ? request : (request?.data || []);
            }
        } catch (error: any) {
            toast.error('Failed to get staff account assignments: ' + (error?.message || 'Unknown error'));
        }
    };

    /**
     * Assign a staff member to a bank account
     * @param userId - The user/staff ID
     * @param accountId - The bank account ID
     * @returns Promise with assignment result
     */
    const assignStaffToAccount = async (userId: string, accountId: string): Promise<any | undefined> => {
        try {
            const request = await api.post(Endpoints.createStaffAssignment, {
                userId,
                accountId
            });
            if (request) {
                toast.success(request?.message || 'Staff assigned successfully');
                return request;
            }
        } catch (error: any) {
            toast.error('Failed to assign staff: ' + (error?.message || 'Unknown error'));
        }
    };

    /**
     * Unassign a staff member from a bank account
     * @param assignmentId - The staff assignment ID
     * @param accountId - The bank account ID
     * @returns Promise with unassignment result
     */
    const unassignStaffFromAccount = async (assignmentId: string, accountId: string): Promise<any | undefined> => {
        try {
            const request = await api.delete(Endpoints.deleteStaffAssignment.replace(/\/$/, '') + '/' + assignmentId, {
                accountId
            });
            if (request) {
                toast.success(request?.message || 'Staff unassigned successfully');
                return request;
            }
        } catch (error: any) {
            toast.error('Failed to unassign staff: ' + (error?.message || 'Unknown error'));
        }
    };

    /**
     * Assign a rate to a bank account
     * @param accountId - The bank account ID
     * @param rateId - The rate ID to assign
     * @returns Promise with assignment result
     */
    const assignRateToAccount = async (accountId: string, rateId: string): Promise<any | undefined> => {
        try {
            const endpoint = Endpoints.assignRateToAccount.replace(/\/$/, '') + '/' + accountId;
            const request = await api.patch(endpoint, { rateId });
            if (request) {
                toast.success(request?.message || 'Rate assigned successfully');
                return request;
            }
        } catch (error: any) {
            toast.error('Failed to assign rate: ' + (error?.message || 'Unknown error'));
            throw error;
        }
    };

    return {
        getBankAccounts,
        getBankAccountsByClient,
        getBankAccountById,
        createBankAccount,
        updateBankAccount,
        deleteBankAccount,
        getStaffAssignmentsByAccount,
        getStaffAssignmentsByStaff,
        assignStaffToAccount,
        unassignStaffFromAccount,
        assignRateToAccount
    };
};