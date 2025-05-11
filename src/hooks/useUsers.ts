import Endpoints from "@/lib/endpoints"
import { useApi } from "./useApi"
import { toast } from 'sonner';

export const useUsers = () => {
    const api = useApi()

    const getUsers = async (role: string) => {
        try {
            // call api
            const request = await api.get(Endpoints.users + `?role=${role}`)
            if (request) {
                return request
            }
        } catch (error) {
            // toast.error('Failed to get orders');
        }
    }

    const updateUser = async (id: string, data: {
        firstName?: string,
        lastName?: string,
        username?: string,
        email?: string,
        avatarUrl?: string,
        role?: string,
        permissions?: string[],
        isActive?: true
    }) => {

        try {
            // call update account api
            const request = await api.patch(Endpoints.updateAccount + id, data)

            if (request) {
                toast.success('Account updated successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to update account: ' + error?.message);
            return false;
        }
    }


    return {
        getUsers,
        updateUser
    }

}