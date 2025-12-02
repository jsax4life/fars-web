import Endpoints from "@/lib/endpoints"
import { useApi } from "./useApi"
import { toast } from 'sonner';

export const useUsers = () => {
    const api = useApi()

    const getUsers = async (role?: string) => {
        try {
            // call api
            const request = role && role !== 'ALL'
                ? await api.get(Endpoints.users + `?role=${role}`)
                : await api.get(Endpoints.users)
            if (request) {
                return request
            }
        } catch (error) {
            // toast.error('Failed to get orders');
        }
    }

    const getStaff = async () => {
        try {
            const endpoint = Endpoints.getStaff;
            console.log('getStaff: Calling endpoint:', endpoint);
            console.log('getStaff: Full URL will be:', typeof window !== 'undefined' ? window.location.origin + endpoint : endpoint);
            const request = await api.get(endpoint)
            console.log('getStaff: Response received:', request ? `Success (${Array.isArray(request) ? request.length + ' items' : 'object'})` : 'null/undefined');
            if (request) {
                return request
            }
            return undefined;
        } catch (error: any) {
            console.error('getStaff: Error occurred:', error);
            toast.error('Failed to get staff: ' + (error?.message || 'Unknown error'));
            return undefined;
        }
    }

    const getUserById = async (id: string) => {
        try {
            const request = await api.get(Endpoints.updateAccount + id)
            if (request) return request
        } catch (error: any) {
            toast.error('Failed to load user: ' + error?.message)
        }
    }

    const checkEmailAvailability = async (email: string) => {
        if (!email) return false;
        try {
            const request = await api.get(`${Endpoints.checkEmail}?email=${encodeURIComponent(email)}`)
            return !!(request?.available ?? request?.isAvailable ?? request?.data?.available);
        } catch (error) {
            return false;
        }
    }

    const checkUsernameAvailability = async (username: string) => {
        if (!username) return false;
        try {
            const request = await api.get(`${Endpoints.checkUsername}?username=${encodeURIComponent(username)}`)
            return !!(request?.available ?? request?.isAvailable ?? request?.data?.available);
        } catch (error) {
            return false;
        }
    }

    const changePassword = async (oldPassword: string, newPassword: string) => {
        try {
            const request = await api.patch(Endpoints.changePassword, {
                oldPassword,
                newPassword
            });
            if (request) {
                toast.success(request?.message || 'Password changed successfully!');
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to change password: ' + (error?.message || 'Unknown error'));
            return false;
        }
    }

    const updateUser = async (id: string, data: {
        firstName?: string,
        lastName?: string,
        username?: string,
        email?: string,
        phone?: string,
        avatarUrl?: string,
        role?: string,
        permissions?: string[],
        isActive?: true
    }) => {

        try {
            // call update account api
            const request = await api.patch(Endpoints.updateAccount + id, data)

            if (request) {
                toast.success(request?.message || 'Account updated successfully!');
                return request;
            }
            return false;
        } catch (error: any) {
            toast.error('Failed to update account: ' + error?.message);
            throw error;
        }
    }

    const deleteUser = async (id: string) => {
        try {
            // call delete account api
            const request = await api.delete(Endpoints.updateAccount + id)

            if (request?.message) {
                toast.success(request?.message);
                return request;
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
        username?: string,
        phone?: string,
        avatarUrl?: string,
        password?: string,
        permissions?: string[],
        isActive?: boolean,
    }) => {
        try {
            // call create account api
            const request = await api.post(Endpoints.createuser, {
                ...data,
                username: data.username || generateUsername(data.firstName, data.lastName),
                password: data.password || 'P@55w0rd',
                isActive: data.isActive ?? true,
                permissions: data.permissions && data.permissions.length > 0 ? data.permissions : [
                    "VIEW_CLIENTS",
                    "EDIT_TRANSACTIONS"
                ],
                avatarUrl: data.avatarUrl || 'https://gravatar.com/avatar/48c3863a0f03a81d67916d28fdaa0ea6?s=400&d=mp&r=pg',
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

    const activateUser = async (id: string) => {
        try {
            // call activate account api
            const request = await api.patch(Endpoints.activateUser + id, {})

            if (request) {
                toast.success('Account activated successfully!');
                return request;
            }
            return false;
        }
        catch (error: any) {
            toast.error('Failed to activate account: ' + error?.message);
            return false;
        }
    }


    return {
        getUsers,
        getStaff,
        getUserById,
        updateUser,
        deleteUser,
        createUser,
        deactivateUser,
        activateUser,
        checkEmailAvailability,
        checkUsernameAvailability,
        changePassword
    }

}


//generate username from first and last name
export const generateUsername = (firstName: string, lastName: string) => {
    const firstInitial = firstName.charAt(0).toLowerCase();
    const lastNameLower = lastName.toLowerCase();
    return `${firstInitial}${lastNameLower}`;
}