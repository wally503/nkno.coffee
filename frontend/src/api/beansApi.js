import axiosInstance from './axiosInstance'

export async function defaultBeansTableList(){
    try{
        const { data } = await axiosInstance.get('beans/')
        return data
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function beansRoasters(){
    try{
        const { data } = await axiosInstance.get('roasters/')
        return data.map(r => ({ label: r.name, value: r.id }))
    } catch (error) {
        console.error(error.response.status)
        console.error(error.response.data)
    }
}

export async function beansCountries(){
    try{
        const { data } = await axiosInstance.get('countries/')
        return data.map(r => ({ label: r.name, value: r.id }))
    } catch (error) {
        console.error(error.response.status);
        console.error(error.response.data);
    }
}

export async function fetchBeansOptions() {
    // mock “API” — could be a real fetch later
    return Promise.resolve(MOCK_BEANS_OPTIONS);
}

export async function submitBeans(formData) {
    try {
        console.log('form data from api module: ' + formData);
        return axiosInstance.post('beans/', formData);
    } catch (e){
        console.log(e);
    }
    console.log('finished axios call, outside try/catch');
}