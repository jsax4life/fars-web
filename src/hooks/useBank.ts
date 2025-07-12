import Endpoints from "@/lib/endpoints"
import { useApi } from "./useApi"
import { toast } from 'sonner';

export const useBanks = () => {
    const api = useApi()

    const getBanks = async () => {
        try {
            const response = await api.get(Endpoints.getAllBanks)
            return response
        } catch (error: any) {
            toast.error('Failed to fetch banks: ' + (error?.response?.data?.message || error?.message));
            return []
        }
    }

    const getBankById = async (id: string) => {
        try {
            const response = await api.get(Endpoints.getBankById + id)
            return response
        } catch (error: any) {
            toast.error('Failed to fetch bank: ' + (error?.response?.data?.message || error?.message));
            return null
        }
    }

    const createBank = async (data: any) => {
        try {
            const response = await api.post(Endpoints.createBank, data)
            toast.success('Bank created successfully!');
            return response
        } catch (error: any) {
            toast.error('Failed to create bank: ' + (error?.response?.data?.message || error?.message));
            return false
        }
    }

    const updateBank = async (id: string, data: {
        name?: string,
        accountNumber?: string,
        branch?: string,
        swiftCode?: string
    }) => {
        try {
            const response = await api.patch(Endpoints.updateBankById + id, data)
            toast.success('Bank updated successfully!');
            return response
        } catch (error: any) {
            toast.error('Failed to update bank: ' + (error?.response?.data?.message || error?.message));
            return false
        }
    }

    const deleteBank = async (id: string) => {
        try {
            await api.delete(Endpoints.deleteBankById + id)
            toast.success('Bank deleted successfully!');
            return true
        } catch (error: any) {
            toast.error('Failed to delete bank: ' + (error?.response?.data?.message || error?.message));
            return false
        }
    }

    return {
        getBanks,
        getBankById,
        createBank,
        updateBank,
        deleteBank
    }
}
