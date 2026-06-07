// src/api/drinkApi.js
import axiosInstance from './axiosInstance'

export async function defaultDrinksTableList(page = 0, pageSize = 10){
    try{
        const { data } = await axiosInstance.get(`coffee/drinks/?page=${page + 1}&page_size=${pageSize}`)
        return data
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function drinksByRoaster(shortid, page = 0, pageSize = 10){
    try{
        const { data } = await axiosInstance.get(`coffee/drinks/?roaster=${shortid}&page=${page + 1}&page_size=${pageSize}`);
        return data
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function submitDrink(formData) {
    try {
        return await axiosInstance.post('coffee/drinks/', formData);
    } catch (error){
        if (error.response?.status === 400){
            throw error.response.data;
        }
        throw error;
    }
}

export async function drinksRoasters(){
    try{
        const { data } = await axiosInstance.get('coffee/roasters/')
        return data.results.map(r => ({ label: r.name, value: r.id }))
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function getDrinkById(id){
    try {
        return await axiosInstance.get('coffee/drinks/' + id)
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}