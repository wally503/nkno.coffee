// src/api/lotActionsApi.js
import axiosInstance from "./axiosInstance";

async function post(path) {
    try {
        const { data } = await axiosInstance.post(path);
        return { ok: true, data };
    } catch (error) {
        return { ok: false, errors: error.response?.data?.errors ?? ["Request failed."] };
    }
}

export const thawLot = (id) => post(`lots/${id}/thaw/`);
export const freezeLot = (id) => post(`lots/${id}/freeze/`);
export const openLot = (id) => post(`lots/${id}/open/`);