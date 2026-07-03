// src/api/drinkApi.js
import axiosInstance from './axiosInstance'
import { beansByRoaster } from "../api/beansApi";

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
        const { data } = await axiosInstance.get('coffee/roasters/?page_size=500')
        return data.results.map(r => ({ label: r.name, value: r.id, short_id: r.short_id }))
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function drinksBeansForRoaster(id, page, size){
    try{
        const { data } = beansByRoaster(id,page,size);
        return data.results.map(r => ({ label: r.name, value: r.id, short_id: r.short_id }))
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