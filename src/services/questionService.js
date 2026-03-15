import axios from "axios";

const API_URL = "http://localhost:3000/api/questions";


//Obtener el vehiculo del cual se esta preguntando 
export const getVehicleConversation = async (vehicleId) => {
  const token = sessionStorage.getItem("token");

  const response = await axios.get(`${API_URL}/vehicle/${vehicleId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createQuestion = async (vehicleId, question) => {
  const token = sessionStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    {
      vehicleId,
      question,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const answerQuestion = async (questionId, answer) => {
  const token = sessionStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${questionId}/answer`,
    { answer },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

