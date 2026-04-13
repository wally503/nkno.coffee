// src/api/roasterApi.js
import axiosInstance from './axiosInstance'

export async function defaultRoastersTableList(){
    try{
        const { data } = await axiosInstance.get('roasters/')
        return data
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function submitRoaster(formData) {
    try {
        return await axiosInstance.post('roasters/', formData);
    } catch (error){
        if (error.response?.status === 400){
            throw error.response.data;
        }
        throw error;
    }
}

export async function roastersCountries(){
    try{
        const { data } = await axiosInstance.get('countries/')
        return data.map(r => ({ label: r.name, value: r.id }))
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}

export async function roastersRoasterCafe(){
    try{
        const { data } = await axiosInstance.get('roasters/')
        return data.map(r => ({ label: r.name, value: r.id }))
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function getRoasterById(id){
    try {
        return await axiosInstance.get('roasters/' + id)
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}

export async function updateRoaster(id, formData) {
    try {
        return await axiosInstance.put('roasters/' + id + '/', formData);
    } catch (error){
        if (error.response?.status === 400){
            throw error.response.data;
        }
        throw error;
    }
}

export async function getRoasterCountryCount(){
    try {
        return await axiosInstance.get('roasters/country_counts/')
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}

export async function getRegionsForCountry(countryId){
    try {
        return await axiosInstance.get(`regions/?country_id=${countryId}`)
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}