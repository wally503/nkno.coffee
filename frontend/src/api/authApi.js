// src/api/authApi.js

import axiosInstance from './axiosInstance'

export async function login(username, password){
    try{
        console.log('logging in: ', username, ' ', password);
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
        console.log('attempting logout from authapi!');
        const response = await axiosInstance.post('auth/logout/');
        console.log('logout response: ', response);
        return response
    } catch (error) {
        if (error.response?.status === 401){
            throw error.response.data;
        }
        throw error;
    }
}

export async function valid() {
    try{
        const response = await axiosInstance.get('auth/valid/');
        return response
    } catch (error) {
        if (error.response?.status === 401){
            throw error.response.data;
        }
        throw error;
    }
}