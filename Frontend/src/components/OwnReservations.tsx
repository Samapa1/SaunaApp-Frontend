import { useState, useEffect } from 'react';
import { DateTime } from "luxon";
import { Spinner } from 'react-bootstrap';
import { getOwnReservations } from "../services/reservations";
import { useAuth } from 'react-oidc-context';
import type { Reservation } from '../types';

const OwnReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();
  const token = auth.user?.access_token || '';

  useEffect(() => {
    const fetchReservations = async () => {
      const currentDate = DateTime.now();
      const dateData = `${currentDate.weekYear}-${String(currentDate.month).padStart(2, '0')}`;
      const data = await getOwnReservations(token, dateData);
      setReservations(data);
      setIsLoading(false);
    };
    
    if (token) {
      fetchReservations();
    }
  }, [token]);

  return (
    <>
      <h1>Omat varaukset</h1>
      <div>
        {isLoading ? (
          <Spinner animation='border' size='sm' variant='primary'/>
        ) : reservations.length > 0 ? (
          <ul>
            {reservations.map((reservation, index) => {
              const dateParts = reservation.Date.split('-');
              const hours = dateParts[dateParts.length - 1];
              const dateWithoutHours = dateParts.slice(0, -1).join('.');
              return (
                <li key={index}>
                  Sauna {reservation.Id} {dateWithoutHours} klo {hours}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Ei varauksia</p>
        )}
      </div>
    </>
  );
}

export default OwnReservations
