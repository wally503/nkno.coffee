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

export async function getDynamicById(uriPath, id){
    try {
        return await axiosInstance.get(uriPath + id + '/')
    } catch (error) {
        console.error(error.response?.status)
        console.error(error.response?.data)
    }
}

export async function getDynamicOptions(uriPath, labelField = 'name') {
    try {
        const { data } = await axiosInstance.get(uriPath + '?page_size=500')
        const rows = data.results ?? data
        return rows.map(row => ({ label: row[labelField], value: row.id }))
    } catch (error) {
        console.error(error.response?.status)
        console.error(error.response?.data)
        return []
    }
}