// src/api/drinkApi.js
import axiosInstance from './axiosInstance'

export async function defaultDrinksTableList(){
    try{
        const { data } = await axiosInstance.get('drinks/')
        return data
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function drinksByRoaster(shortid){
    try{
        const { data } = await axiosInstance.get(`drinks/?roaster=${shortid}`);
        return data
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function submitDrink(formData) {
    try {
        return await axiosInstance.post('drinks/', formData);
    } catch (error){
        if (error.response?.status === 400){
            throw error.response.data;
        }
        throw error;
    }
}

export async function drinksRoasters(){
    try{
        const { data } = await axiosInstance.get('roasters/')
        return data.map(r => ({ label: r.name, value: r.id }))
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function getDrinkById(id){
    try {
        return await axiosInstance.get('drinks/' + id)
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}