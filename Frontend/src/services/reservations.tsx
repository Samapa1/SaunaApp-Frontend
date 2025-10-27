import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACKEND_URL

export const getAll = async (sauna: string) => {
  const response = await axios.get(baseUrl + `/reservations?sauna=${sauna}`);
  return response.data;
};