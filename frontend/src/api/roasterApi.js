// src/api/roasterApi.js
import axiosInstance from './axiosInstance'

export async function defaultRoastersTableList(page = 0, pageSize = 10){
    try{
        const { data } = await axiosInstance.get(`roasters/?page=${page + 1}&page_size=${pageSize}`)
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

export async function roastersCountries(pageSize = 500){
    try{
        const { data } = await axiosInstance.get(`countries/?page_size=${pageSize}`)
        return data.results.map(r => ({ label: r.name, value: r.id }))
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}

export async function roastersRoasterCafe(pageSize = 500){
    try{
        const { data } = await axiosInstance.get(`roasters/?page_size=${pageSize}`)
        return data.results.map(r => ({ label: r.name, value: r.id }))
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

export async function getRoasterCountryRegionCount(countryId){
    try {
        return await axiosInstance.get(`roasters/region_counts/?country=${countryId}`)
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}

export async function getRegionsForCountry(countryId){
    try {
        return await axiosInstance.get(`regions/?country=${countryId}`)
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}