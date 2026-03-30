import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACKEND_URL

interface Reservation {
    "sauna": string,
    "date": string
}


export const getAll = async (sauna: string, dateData: string, token: string) => {
  const response = await axios.get(baseUrl + `/reservations?sauna=${sauna}&date=${dateData}`, {
    // headers: { "x-authorization": token },
    headers: { Authorization: token },
  });
  return response.data;
};

export const getOwnReservations = async (token: string, dateData: string) => {
  const response = await axios.get(baseUrl + `/userreservations?date=${dateData}`, {
    // headers: { "x-authorization": token },
    headers: { Authorization: token },
  });
  return response.data;
}

export const create = async (reservation: Reservation, token: string) => {
  const response = await axios.post(baseUrl + `/reservation`, reservation, {
    // headers: { "x-authorization": token },
    headers: { Authorization: token },
  });
  return response.data;
};

export const deleteReservation = async (sauna: string, dateData: string, token: string) => {
  console.log('deleting reservation', sauna, dateData)
  const response = await axios.delete(baseUrl + `/reservation?sauna=${sauna}&date=${dateData}   `, {
    // headers: { "x-authorization": token },
    headers: { Authorization: token },
  });
  return response.data;
};