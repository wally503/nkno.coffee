// src/api/brewApi.js
import axiosInstance from './axiosInstance'

// --- option sources for dropdowns -------------------------------------------

export async function brewBeans(pageSize = 500) {
    try {
        // finished=false assumes BeanViewSet supports filtering on that field —
        // confirm the result set actually shrinks when this param is passed;
        // if not, this needs a filterset_fields fix on BeanViewSet, not here.
        const { data } = await axiosInstance.get(`coffee/beans/?finished=false&page_size=${pageSize}`)
        return data.results.map(b => ({ label: b.name, value: b.id }))
    } catch (error) {
        console.error(error.response?.status)
        console.error(error.response?.data)
    }
}

export async function brewGrinders(pageSize = 500) {
    try {
        const { data } = await axiosInstance.get(`brew/grinders/?page_size=${pageSize}`)
        return data.results.map(g => ({ label: `${g.name} – ${g.brand}`, value: g.short_id }))
    } catch (error) {
        console.error(error.response?.status)
        console.error(error.response?.data)
    }
}

export async function brewScales(pageSize = 500) {
    try {
        const { data } = await axiosInstance.get(`brew/scales/?page_size=${pageSize}`)
        return data.results.map(s => ({ label: s.name, value: s.short_id }))
    } catch (error) {
        console.error(error.response?.status)
        console.error(error.response?.data)
    }
}

export async function brewKettles(pageSize = 500) {
    try {
        const { data } = await axiosInstance.get(`brew/kettles/?page_size=${pageSize}`)
        return data.results.map(k => ({ label: `${k.name} – ${k.brand}`, value: k.short_id }))
    } catch (error) {
        console.error(error.response?.status)
        console.error(error.response?.data)
    }
}

// --- BrewLog (parent record — created first, then the style Detail row points at it) ---

export async function defaultBrewLogsTableList(page = 0, pageSize = 10, search = null, order = null) {
    try {
        const { data } = await axiosInstance.get(`brew/brewlogs/?page=${page + 1}&page_size=${pageSize}&search=${search ?? ''}&ordering=${order ?? ''}`)
        return data
    } catch (error) {
        console.error(error.response?.status)
        console.error(error.response?.data)
    }
}

export async function submitBrewLog(formData) {
    try {
        const { data } = await axiosInstance.post('brew/brewlogs/', formData);
        return data;
    } catch (error) {
        if (error.response?.status === 400) {
            throw error.response.data;
        }
        throw error;
    }
}

// --- Aeropress CRUD ------------------------------------------------------------

export async function submitAeropress(formData) {
    try {
        const { data } = await axiosInstance.post('brew/aeropress/', formData);
        return data;
    } catch (error) {
        if (error.response?.status === 400) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function getAeropressById(id) {
    try {
        return await axiosInstance.get('brew/aeropress/' + id)
    } catch (error) {
        console.error(error.response?.status);
        console.error(error.response?.data);
    }
}

export async function updateAeropress(id, formData) {
    try {
        const { data } = await axiosInstance.put('brew/aeropress/' + id + '/', formData);
        return data;
    } catch (error) {
        if (error.response?.status === 400) {
            throw error.response.data;
        }
        throw error;
    }
}

// --- Pourover CRUD ---------------------------------------------------------

export async function submitPourover(formData) {
    try {
        const { data } = await axiosInstance.post('brew/pourover/', formData);
        return data;
    } catch (error) {
        if (error.response?.status === 400) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function getPouroverById(id) {
    try {
        return await axiosInstance.get('brew/pourover/' + id)
    } catch (error) {
        console.error(error.response?.status);
        console.error(error.response?.data);
    }
}

export async function updatePourover(id, formData) {
    try {
        const { data } = await axiosInstance.put('brew/pourover/' + id + '/', formData);
        return data;
    } catch (error) {
        if (error.response?.status === 400) {
            throw error.response.data;
        }
        throw error;
    }
}


// --- Espresso CRUD ------------------------------------------------------------

export async function submitEspresso(formData) {
    try {
        const { data } = await axiosInstance.post('brew/espresso/', formData);
        return data;
    } catch (error) {
        if (error.response?.status === 400) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function getEspressoById(id) {
    try {
        return await axiosInstance.get('brew/espresso/' + id)
    } catch (error) {
        console.error(error.response?.status);
        console.error(error.response?.data);
    }
}

export async function updateEspresso(id, formData) {
    try {
        const { data } = await axiosInstance.put('brew/espresso/' + id + '/', formData);
        return data;
    } catch (error) {
        if (error.response?.status === 400) {
            throw error.response.data;
        }
        throw error;
    }
}