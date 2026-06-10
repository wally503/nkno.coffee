// src/api/mapZoneApi.js
import axiosInstance from './axiosInstance'

export async function getZoneData(){
    try{
        const { data } = await axiosInstance.get(`coffee/mapzone/`)
        return data.results
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}