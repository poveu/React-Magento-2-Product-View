import * as api from './api'

export const getProduct = async (sku, errorHandler) => {
    return await api.apiCall('products/' + encodeURI(sku), "GET", errorHandler)
}

export const getAllProducts = async (page = 0, errorHandler) => {
    return await api.apiCall('products/?searchCriteria[pageSize]=10&searchCriteria[currentPage]=' + page, "GET", errorHandler)
}