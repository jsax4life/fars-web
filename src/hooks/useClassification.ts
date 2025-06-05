import Endpoints from "@/lib/endpoints";
import { useApi } from "./useApi"; // Assuming useApi is in the same directory or adjust path
import { toast } from 'sonner';

// Define the structure for Classification data
interface ClassificationData {
    code: string;
    category: string; // e.g., "DEPOSIT", "WITHDRAWAL", etc.
    label: string;
    description?: string; // Description can be optional
}

// Define the structure for updating Classification data (all fields optional)
interface UpdateClassificationData {
    code?: string;
    category?: string;
    label?: string;
    description?: string;
}

export const useClassifications = () => {
    const api = useApi();

    /**
     * Get all classifications
     * @returns Promise<any> - The list of classifications or undefined on error
     */
    const getClassifications = async () => {
        try {
            const request = await api.get(Endpoints.getAllClassifications);
            if (request) {
                return request;
            }
        } catch (error: any) {
            toast.error('Failed to get classifications: ' + (error?.message || 'Unknown error'));
            // console.error("Error in getClassifications:", error); // Optional: for more detailed logging
        }
    };

    /**
     * Update an existing classification
     * @param id - The ID of the classification to update
     * @param data - The data to update the classification with
     * @returns Promise<any | boolean> - The updated classification data or false on failure
     */
    const updateClassification = async (id: string, data: UpdateClassificationData) => {
        try {
            const request = await api.patch(Endpoints.updateClassificationById + id, data);
            if (request) {
                toast.success('Classification updated successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to update classification: ' + (error?.message || 'Unknown error'));
            return false;
        }
    };

    /**
     * Delete a classification
     * @param id - The ID of the classification to delete
     * @returns Promise<boolean> - True if deletion was successful, false otherwise
     */
    const deleteClassification = async (id: string) => {
        try {
            const request = await api.delete(Endpoints.deleteClassificationById + id);
            // Assuming a successful delete might return a 200/204 status with no significant body,
            // or your api.delete might process this to return a truthy value.
            // Adjust if your API returns a specific structure.
            if (request) { // Or check for a specific success status from 'request' if available
                toast.success('Classification deleted successfully!');
                return true;
            }
            // If request is undefined or indicates failure (e.g. specific status code handled in useApi)
            // we might reach here or the catch block directly.
            // If api.delete doesn't throw for non-2xx but returns a falsy value:
            // toast.error('Failed to delete classification: Unexpected response');
            return false;
        } catch (error: any) {
            toast.error('Failed to delete classification: ' + (error?.message || 'Unknown error'));
            return false;
        }
    };

    /**
     * Create a new classification
     * @param data - The data for the new classification
     * @returns Promise<any | boolean> - The created classification data or false on failure
     */
    const createClassification = async (data: ClassificationData) => {
        try {
            // The example body shows "description" as part of the creation.
            // If description is truly optional on creation and not sent if undefined,
            // you might not need to do anything special. If it must be omitted if not provided,
            // ensure your 'data' object reflects that.
            const request = await api.post(Endpoints.createClassification, data);
            if (request) {
                toast.success('Classification created successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to create classification: ' + (error?.message || 'Unknown error'));
            return false;
        }
    };

    return {
        getClassifications,
        updateClassification,
        deleteClassification,
        createClassification
    };
};