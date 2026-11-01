// src/api/beanStockApi.js
import axiosInstance from "./axiosInstance";

export async function defaultBeanStockTableList(page = 0, pageSize = 10, search = "", orderingParam = "") {
    try {
        const params = new URLSearchParams({ page: page + 1, page_size: pageSize });
        if (search) params.set("search", search);
        if (orderingParam) params.set("ordering", orderingParam);
        const { data } = await axiosInstance.get(`coffee/bean-stock/?${params.toString()}`);
        return data;
    } catch (error) {
        console.error(error.response?.status);
        console.error(error.response?.data);    
        return { results: [], count: 0 };
    }
}