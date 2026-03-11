import axios from "axios";

const API_URL = "http://localhost:3000/api/vehicles";

export const getVehicles = async (filters = {}) => {
  const token = sessionStorage.getItem("token");

  const params = {};

  if (filters.brand) params.brand = filters.brand;
  if (filters.model) params.model = filters.model;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.minYear) params.minYear = filters.minYear;
  if (filters.maxYear) params.maxYear = filters.maxYear;
  if (filters.status) params.status = filters.status;

  const response = await axios.get(API_URL, {
    params,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const token = sessionStorage.getItem("token");

  return await axios.post(API_URL, vehicleData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateVehicle = async (id, vehicleData) => {
  const token = sessionStorage.getItem("token");

  return await axios.put(`${API_URL}/${id}`, vehicleData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteVehicle = async (id) => {
  const token = sessionStorage.getItem("token");

  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const markVehicleAsSold = async (id) => {
  const token = sessionStorage.getItem("token");

  return await axios.patch(
    `${API_URL}/${id}/sold`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};