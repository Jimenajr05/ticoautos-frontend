import axios from 'axios';

const API_URL = 'http://localhost:3000/api/vehicles';

const getAuthConfig = () => {
    const token = sessionStorage.getItem('token');
    return {
        headers: {

            Authorization: `Bearer ${token}`
        }
    };
};

export const getVehicles = async (params = {}) => {
    const response = await axios.get(API_URL,  {params});
    return response.data;
}

export const getVehicleById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}

export const createVehicle = async (vehicleData) => {
    const response = await axios.post(API_URL, vehicleData, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
    return response.data;
}

export const updateVehicle = async (id, vehicleData) => {
    const response = await axios.put(`${API_URL}/${id}`, vehicleData,{
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    });
    return response.data;
}

export const deleteVehicle = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
}

export const markVehicleAsSold = async (id) => {
    const response = await axios.patch(`${API_URL}/${id}/sold`, {}, getAuthConfig());
    return response.data;
}