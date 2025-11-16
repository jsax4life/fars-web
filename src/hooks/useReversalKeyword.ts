import Endpoints from "@/lib/endpoints";
import { useApi } from "./useApi";
import { toast } from 'sonner';

interface ReversalKeywordData {
    keyword: string;
    isGlobal: boolean;
    bankId: string | null;
}

interface UpdateReversalKeywordData {
    keyword?: string;
    isGlobal?: boolean;
    bankId?: string | null;
}

export const useReversalKeywords = () => {
    const api = useApi();

    /**
     * Get all reversal keywords
     * @param filters - Optional filters: bankId, isGlobal
     * @returns Promise<any> - The list of reversal keywords or undefined on error
     */
    const getReversalKeywords = async (filters?: {
        bankId?: string;
        isGlobal?: boolean;
    }) => {
        try {
            let url = Endpoints.getAllReversalKeywords;
            const queryParams: string[] = [];
            
            if (filters) {
                if (filters.bankId) {
                    queryParams.push(`bankId=${encodeURIComponent(filters.bankId)}`);
                }
                if (filters.isGlobal !== undefined && filters.isGlobal !== null) {
                    queryParams.push(`isGlobal=${filters.isGlobal}`);
                }
            }
            
            if (queryParams.length > 0) {
                url += '?' + queryParams.join('&');
            }
            
            const request = await api.get(url);
            if (request) {
                return request;
            }
        } catch (error: any) {
            toast.error('Failed to get reversal keywords: ' + (error?.message || 'Unknown error'));
        }
    };

    /**
     * Get a reversal keyword by ID
     * @param id - The ID of the reversal keyword
     * @returns Promise<any> - The reversal keyword data or undefined on error
     */
    const getReversalKeywordById = async (id: string) => {
        try {
            const request = await api.get(Endpoints.getReversalKeywordById + id);
            if (request) {
                return request;
            }
        } catch (error: any) {
            toast.error('Failed to get reversal keyword: ' + (error?.message || 'Unknown error'));
        }
    };

    /**
     * Create a new reversal keyword
     * @param data - The data for the new reversal keyword
     * @returns Promise<any | boolean> - The created reversal keyword data or false on failure
     */
    const createReversalKeyword = async (data: ReversalKeywordData) => {
        try {
            const request = await api.post(Endpoints.createReversalKeyword, data);
            if (request) {
                toast.success('Reversal keyword created successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            // Handle 409 Conflict error specifically
            if (error?.status === 409 || error?.message?.includes('409') || error?.message?.includes('Conflict') || error?.message?.includes('already exists')) {
                toast.error('Reversal keyword already exists');
            } else {
                toast.error('Failed to create reversal keyword: ' + (error?.message || 'Unknown error'));
            }
            return false;
        }
    };

    /**
     * Update an existing reversal keyword
     * @param id - The ID of the reversal keyword to update
     * @param data - The data to update the reversal keyword with
     * @returns Promise<any | boolean> - The updated reversal keyword data or false on failure
     */
    const updateReversalKeyword = async (id: string, data: UpdateReversalKeywordData) => {
        try {
            const request = await api.patch(Endpoints.updateReversalKeywordById + id, data);
            if (request) {
                toast.success('Reversal keyword updated successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to update reversal keyword: ' + (error?.message || 'Unknown error'));
            return false;
        }
    };

    /**
     * Delete a reversal keyword
     * @param id - The ID of the reversal keyword to delete
     * @returns Promise<boolean> - True if deletion was successful, false otherwise
     */
    const deleteReversalKeyword = async (id: string) => {
        try {
            const request = await api.delete(Endpoints.deleteReversalKeywordById + id);
            if (request) {
                toast.success('Reversal keyword deleted successfully!');
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to delete reversal keyword: ' + (error?.message || 'Unknown error'));
            return false;
        }
    };

    return {
        getReversalKeywords,
        getReversalKeywordById,
        createReversalKeyword,
        updateReversalKeyword,
        deleteReversalKeyword
    };
};

