import Endpoints from "@/lib/endpoints"
import { useApi } from "./useApi"

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


    return {
        getUsers,
    }

}