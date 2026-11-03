// src/api/lotActionsApi.js
import axiosInstance from "./axiosInstance";

async function post(path, body) {
    try {
        const { data } = await axiosInstance.post(path, body);
        return { ok: true, data };
    } catch (error) {
        return { ok: false, errors: error.response?.data?.errors ?? ["Request failed."] };
    }
}

export async function fetchCloseReasons() {
    try {
        const { data } = await axiosInstance.get("coffee/lots/close-reasons/");
        return { ok: true, data };
    } catch (error) {
        return { ok: false, errors: error.response?.data?.errors ?? ["Request failed."] };
    }
}

export const thawLot = (id, date) => post(`coffee/lots/${id}/thaw/`, { date });
export const freezeLot = (id, date) => post(`coffee/lots/${id}/freeze/`, { date });
export const openLot = (id, date) => post(`coffee/lots/${id}/open/`, { date });
export const closeLot = (id, date, reason) => post(`coffee/lots/${id}/close/`, { date, reason });
