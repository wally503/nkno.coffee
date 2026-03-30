// src/api/beansApi.js
import axiosInstance from './axiosInstance'

export async function defaultBeansTableList(){
    try{
        const { data } = await axiosInstance.get('beans/')
        return data
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function beansRoasters(){
    try{
        const { data } = await axiosInstance.get('roasters/')
        return data.map(r => ({ label: r.name, value: r.id }))
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function beansCountries(){
    try{
        const { data } = await axiosInstance.get('countries/')
        return data.map(r => ({ label: r.name, value: r.id }))
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}

export async function beansNotes(){
    try{
        const { data } = await axiosInstance.get('notes/')
        return data.map(r => ({ label: r.name, value: r.id }))
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}

export async function submitBeans(formData) {
    try {
        return await axiosInstance.post('beans/', formData);
    } catch (error){
        if (error.response?.status === 400){
            throw error.response.data;
        }
        throw error;
    }
}

export async function getBeanById(id){
    try {
        return await axiosInstance.get('beans/' + id)
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}

export async function updateBean(id, formData) {
    try {
        return await axiosInstance.put('beans/' + id + '/', formData);
    } catch (error){
        if (error.response?.status === 400){
            throw error.response.data;
        }
        throw error;
    }
}