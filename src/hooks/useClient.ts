import Endpoints from "@/lib/endpoints"
import { useApi } from "./useApi"
import { toast } from 'sonner';

export const useClients = () => {
    const api = useApi()

    const getClients = async () => {
        try {
            // call api
            const request = await api.get(Endpoints.getAllClients)
            if (request) {
                return request
            }
        } catch (error) {
            // toast.error('Failed to get orders');
        }
    }

    const updateClient = async (id: string, data: {
        firstName?: string,
        lastName?: string,
        companyName?: string,
        email?: string,
        address?: string,
        phone?: string,
        country?: string,
        state?: string,
        city?: string,
        avatarUrl?: string
    }) => {

        try {
            // call update account api
            const request = await api.patch(Endpoints.updateClientById + id, data)

            if (request) {
                toast.success('Client updated successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to update client: ' + error?.message);
            return false;
        }
    }

    const deleteClient = async (id: string) => {
        try {
            // call delete account api
            const request = await api.delete(Endpoints.deleteClientById + id)

            if (request?.message) {
                toast.success(request?.message);
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to delete client: ' + error?.message);
            return false;
        }
    }

    const createClient = async (data: {
        firstName: string,
        lastName: string,
        companyName: string,
        email: string,
        address: string,
        phone: string,
        country: string,
        state: string,
        city: string
    }) => {
        try {
            // call create account api
            const request = await api.post(Endpoints.createuser, {
                ...data,
                avatarUrl: 'https://gravatar.com/avatar/48c3863a0f03a81d67916d28fdaa0ea6?s=400&d=mp&r=pg',
            })
            if (request) {
                toast.success('Client created successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to create client: ' + error?.message);
            return false;
        }
    }


    return {
        getClients,
        updateClient,
        deleteClient,
        createClient
    }

}