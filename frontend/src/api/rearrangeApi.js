import axiosInstance from "./axiosInstance";

export async function getBeanStock(shortId) {
    try {
        const { data } = await axiosInstance.get(`coffee/bean-stock/${shortId}/`);
        return data;
    } catch (error) {
        console.error(error.response?.status);
        console.error(error.response?.data);
        return null;
    }
}

export async function getFreeVessels() {
    try {
        const { data } = await axiosInstance.get("coffee/vessels/?free=1");
        return data;
    } catch (error) {
        console.error(error.response?.status);
        console.error(error.response?.data);
        return [];
    }
}

export async function rearrangeLots(payload) {
    try {
        const { data } = await axiosInstance.post("coffee/lots/rearrange/", payload);
        return { ok: true, data };
    } catch (error) {
        return { ok: false, errors: error.response?.data?.errors ?? ["Request failed."] };
    }
}