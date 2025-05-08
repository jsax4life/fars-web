import Endpoints from "@/lib/endpoints"
import { useApi } from "./useApi"

export const useOrder = () => {
    const api = useApi()

    const getOrders = async (search: string = '', page: number = 0) => {
        try {
            // call api
            const request = await api.get(Endpoints.order + `?search=${search}&page=${page}`)
            if (request) {
                return request
            }
        } catch (error) {
            // toast.error('Failed to get orders');
        }
    }

    const getOrder = async (orderId: string) => {
        try {
            // call api
            const request = await api.get(Endpoints.order + `/${orderId}`)
            if (request) {
                return request
            }
        } catch (error) {
            // toast.error('Failed to get order');
        }
    }

    const getOrderTracking = async (trackingNumber: string) => {
        try {
            // call api
            const request = await api.get(Endpoints.order + `/tracking/${trackingNumber}`)
            if (request) {
                return request
            }
        } catch (error) {
            // toast.error('Failed to get order');
        }
    }

    return {
        getOrders,
        getOrder,
        getOrderTracking,
    }

}