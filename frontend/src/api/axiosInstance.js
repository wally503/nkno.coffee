import axios from 'axios'
import { href } from 'react-router-dom';

const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS === 'true'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

let refreshPromise = null

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const isRefreshCall = error.config?.url === 'auth/refresh/'
        if (error.response?.status === 401 && !isRefreshCall && !error.config._retry) {
            error.config._retry = true
            try {
                if (!refreshPromise) {
                    refreshPromise = axiosInstance.post('auth/refresh/').finally(() => {
                        refreshPromise = null
                    })
                }
                await refreshPromise
                return axiosInstance(error.config)
            } catch (refreshError) {
                if (!DEV_BYPASS) {
                    window.location.href = '/login'
                }
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
);

export default axiosInstance