// src/api/lotsApi.js
import axiosInstance from './axiosInstance'

export async function getLots() {
    try {
        const { data } = await axiosInstance.get("coffee/lots/");
        return data;
    } catch (error) {
        console.error(error.response?.status);
        console.error(error.response?.data);
        return [];
    }
}

export async function getLifecycleEvents() {
    try {
        const { data } = await axiosInstance.get("coffee/lifecycle-events/");
        return data;
    } catch (error) {
        console.error(error.response?.status);
        console.error(error.response?.data);
        return [];
    }
}