import { API_ENDPOINTS } from "../../constants"
import { IApiResponse } from "../../interfaces"
import { encodeBase64 } from "../utils";
import ApiClient from "../utils/api-client"

// Fetch by product ID
export const getProductById = async (id: string): Promise<IApiResponse<any>> => {
    return await ApiClient.request(`${API_ENDPOINTS.CONNECTED_PRODUCTS}?id=${id}`, 'GET', {}, true, {});
};

// Fetch multiple using a base64-encoded query object
export const getAllProducts = async (filter: object = {}): Promise<IApiResponse<any>> => {
    const encoded = encodeBase64(JSON.stringify(filter));
    return await ApiClient.request(`${API_ENDPOINTS.CONNECTED_PRODUCTS}?query=${encoded}`, 'GET', {}, true, {});
};

export const patchProduct = async (body: any): Promise<IApiResponse<any>> => {
    return await ApiClient.request(API_ENDPOINTS.CONNECTED_PRODUCTS, 'PATCH', body, true, {})
}

export const getReviewsOfTheProduct = async (instanceId: string, productId: string): Promise<IApiResponse<any>> => {
    return await ApiClient.request(`${API_ENDPOINTS.GET_REVIEWS}?instanceId=${instanceId}&productId=${productId}`, 'GET', {}, true, {});
}