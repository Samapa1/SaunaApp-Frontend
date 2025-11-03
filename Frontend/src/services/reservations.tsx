import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACKEND_URL

interface Reservation {
    "sauna": string,
    "date": string
}

export const getAll = async (sauna: string) => {
  const response = await axios.get(baseUrl + `/reservations?sauna=${sauna}`);
  return response.data;
};

export const create = async (reservation: Reservation) => {
  console.log(reservation)
  const response = await axios.post(baseUrl + `/reservation`, reservation);
  return response.data;
};