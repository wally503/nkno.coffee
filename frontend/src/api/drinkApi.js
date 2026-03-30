// src/api/drinkApi.js
import axiosInstance from './axiosInstance'

// export async function defaultRoastersTableList(){
//     try{
//         const { data } = await axiosInstance.get('roasters/')
//         return data
//     } catch (error) {
//         console.error(error.response.status)
//         console.error(error.response.data)
//     }
// }

export async function submitDrink(formData) {
    try {
        return await axiosInstance.post('cafelog/', formData);
    } catch (error){
        if (error.response?.status === 400){
            throw error.response.data;
        }
        throw error;
    }
}

export async function drinksRoasters(){
    try{
        const { data } = await axiosInstance.get('roasters/')
        return data.map(r => ({ label: r.name, value: r.id }))
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}