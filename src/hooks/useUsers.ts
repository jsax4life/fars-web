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

    const deleteUser = async (id: string) => {
        try {
            // call delete account api
            const request = await api.delete(Endpoints.updateAccount + id)

            if (request?.message) {
                toast.success(request?.message);
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to delete account: ' + error?.message);
            return false;
        }
    }

    const createUser = async (data: {
        firstName: string,
        lastName: string,
        email: string,
        role: string,
    }) => {
        try {
            // call create account api
            const request = await api.post(Endpoints.createuser, {
                ...data,
                username: generateUsername(data.firstName, data.lastName),
                password: 'P@55w0rd',
                isActive: true,
                permissions: [
                    "VIEW_CLIENTS",
                    "EDIT_TRANSACTIONS"
                ],
                avatarUrl: 'https://gravatar.com/avatar/48c3863a0f03a81d67916d28fdaa0ea6?s=400&d=mp&r=pg',
            })
            if (request) {
                toast.success('Account created successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to create account: ' + error?.message);
            return false;
        }
    }

    const deactivateUser = async (id: string, reason: string) => {
        try {
            // call deactivate account api
            const request = await api.patch(Endpoints.deactivateUser + id, {
                reason: reason,
            })

            if (request) {
                toast.success('Account deactivated successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to deactivate account: ' + error?.message);
            return false;
        }
    }



    return {
        getUsers,
        updateUser,
        deleteUser,
        createUser,
        deactivateUser,
    }

}


//generate username from first and last name
export const generateUsername = (firstName: string, lastName: string) => {
    const firstInitial = firstName.charAt(0).toLowerCase();
    const lastNameLower = lastName.toLowerCase();
    return `${firstInitial}${lastNameLower}`;
}