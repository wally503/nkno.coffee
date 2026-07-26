// src/api/dynamicApi.js
import axiosInstance from './axiosInstance'

export async function defaultDynamicList(uriPath, page = 0, pageSize = 10){
    try{
        const { data } = await axiosInstance.get( uriPath + `?page=${page + 1}&page_size=${pageSize}`)
        return data
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function submitDynamicForm(uriPath, formData) {
    try {
        return await axiosInstance.post(uriPath, formData);
    } catch (error){
        if (error.response?.status === 400){
            throw error.response.data;
        }
        throw error;
    }
}

export async function updateDynamicForm(uriPath, id, formData) {
    try {
        return await axiosInstance.put(uriPath + id + '/', formData);
    } catch (error){
        if (error.response?.status === 400){
            throw error.response.data;
        }
        throw error;
    }
}