import Endpoints from "@/lib/endpoints";
import { useApi } from "./useApi";
import { toast } from 'sonner';

interface ClassificationPatternData {
    keyword: string;
    isRegex: boolean;
    bankId: string | null;
    classificationId: string;
}

interface UpdateClassificationPatternData {
    keyword?: string;
    isRegex?: boolean;
    bankId?: string | null;
    classificationId?: string;
}

export const useClassificationPatterns = () => {
    const api = useApi();

    /**
     * Get all classification patterns
     * @param filters - Optional filters: bankId, classificationId, isGlobal
     * @returns Promise<any> - The list of classification patterns or undefined on error
     */
    const getClassificationPatterns = async (filters?: {
        bankId?: string;
        classificationId?: string;
        isGlobal?: boolean;
    }) => {
        try {
            let url = Endpoints.getAllClassificationPatterns;
            const queryParams: string[] = [];
            
            if (filters) {
                if (filters.bankId) {
                    queryParams.push(`bankId=${encodeURIComponent(filters.bankId)}`);
                }
                if (filters.classificationId) {
                    queryParams.push(`classificationId=${encodeURIComponent(filters.classificationId)}`);
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
                // Handle new response structure with data and meta keys
                if (request.data && Array.isArray(request.data)) {
                    return request.data;
                }
                // Fallback for old structure (direct array)
                if (Array.isArray(request)) {
                    return request;
                }
                return request;
            }
        } catch (error: any) {
            toast.error('Failed to get classification patterns: ' + (error?.message || 'Unknown error'));
        }
    };

    /**
     * Get a classification pattern by ID
     * @param id - The ID of the classification pattern
     * @returns Promise<any> - The classification pattern data or undefined on error
     */
    const getClassificationPatternById = async (id: string) => {
        try {
            const request = await api.get(Endpoints.getClassificationPatternById + id);
            if (request) {
                return request;
            }
        } catch (error: any) {
            toast.error('Failed to get classification pattern: ' + (error?.message || 'Unknown error'));
        }
    };

    /**
     * Create a new classification pattern
     * @param data - The data for the new classification pattern
     * @returns Promise<any | boolean> - The created classification pattern data or false on failure
     */
    const createClassificationPattern = async (data: ClassificationPatternData) => {
        try {
            const request = await api.post(Endpoints.createClassificationPattern, data);
            if (request) {
                toast.success('Classification pattern created successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            // Handle 409 Conflict error specifically
            if (error?.status === 409 || error?.message?.includes('409') || error?.message?.includes('Conflict') || error?.message?.includes('already exists')) {
                toast.error('Classification pattern already exists');
            } else {
                toast.error('Failed to create classification pattern: ' + (error?.message || 'Unknown error'));
            }
            return false;
        }
    };

    /**
     * Update an existing classification pattern
     * @param id - The ID of the classification pattern to update
     * @param data - The data to update the classification pattern with
     * @returns Promise<any | boolean> - The updated classification pattern data or false on failure
     */
    const updateClassificationPattern = async (id: string, data: UpdateClassificationPatternData) => {
        try {
            const request = await api.patch(Endpoints.updateClassificationPatternById + id, data);
            if (request) {
                toast.success('Classification pattern updated successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to update classification pattern: ' + (error?.message || 'Unknown error'));
            return false;
        }
    };

    /**
     * Delete a classification pattern
     * @param id - The ID of the classification pattern to delete
     * @returns Promise<boolean> - True if deletion was successful, false otherwise
     */
    const deleteClassificationPattern = async (id: string) => {
        try {
            const request = await api.delete(Endpoints.deleteClassificationPatternById + id);
            if (request) {
                toast.success('Classification pattern deleted successfully!');
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to delete classification pattern: ' + (error?.message || 'Unknown error'));
            return false;
        }
    };

    return {
        getClassificationPatterns,
        getClassificationPatternById,
        createClassificationPattern,
        updateClassificationPattern,
        deleteClassificationPattern
    };
};

