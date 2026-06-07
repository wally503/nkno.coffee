// src/api/authApi.js

import axiosInstance from './axiosInstance'

export async function login(username, password){
    try{
        const response = await axiosInstance.post('auth/login/', {username, password} );
        return response
        
    } catch (error) {
        if (error.response?.status === 401){
            throw error.response.data;
        }
        throw error;
    }
}

export async function logout(){
    try{
        const response = await axiosInstance.post('auth/logout/');
        return response
        
    } catch (error) {
        if (error.response?.status === 401){
            throw error.response.data;
        }
        throw error;
    }
}

export async function valid() {

}