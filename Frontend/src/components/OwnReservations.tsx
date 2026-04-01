import { useState, useEffect } from 'react';
import { DateTime } from "luxon";
import { Spinner, Button } from 'react-bootstrap';
import { getOwnReservations } from "../services/reservations";
import { useAuth } from 'react-oidc-context';
import type { Reservation } from '../types';
import ReservationData from './ReservationData';

const weekdays = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

const OwnReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteReservation, setShowDeleteReservation] = useState(false);
  const [reservedHour, setReservedHour] = useState('');
  const [reservedDate, setReservedDate] = useState('');
  const [selectedSaunaId, setSelectedSaunaId] = useState('');
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

   const handleDeleteClick = (date: string, hours: string, saunaId: string) => {
      setReservedHour(hours);
      setReservedDate(date);
      setSelectedSaunaId(saunaId);
      setShowDeleteReservation(true);
    };


  return (
    <>
      <h1>Omat varaukset</h1>
       {showDeleteReservation ? <ReservationData 
        setShowDeleteReservation={setShowDeleteReservation} 
        saunaNumber={selectedSaunaId}
        date={reservedDate}
        reservedHour={reservedHour}
        token={token}
        setReservations={setReservations}
      /> : null}
      <div>
        {isLoading ? (
          <Spinner animation='border' size='sm' variant='primary'/>
        ) : reservations.length > 0 ? (
          <ul>
            {reservations.map((reservation, index) => {
              const dateParts = reservation.Date.split('-');
              const hours = dateParts[dateParts.length - 1];
              const year = dateParts[2];
              const month = dateParts[1];
              const day = dateParts[0];
              const dateWithoutHours = dateParts.slice(0, -1).join('.');
              const isoDate = DateTime.fromObject({ year: Number(year), month: Number(month), day: Number(day) }).toISODate() ?? ' '
              const dateObj = DateTime.fromISO(isoDate)
              const dayName = weekdays[dateObj.weekday - 1];
              const dateWithWeekday = `${dayName} ${dateWithoutHours}`;
              
              return (
                <li key={index}>
                  <div style={{ marginTop: '20px' }}>
                  {`Sauna ${reservation.Id} ${dateWithWeekday} klo ${hours} `}
                  <Button 
                    variant="primary"  
                    size="sm"
                    onClick={() => handleDeleteClick(dateWithWeekday, hours, reservation.Id)}
                    style={{ padding: '2px 8px', fontSize: '14px' }}
                  >
                    ×
                  </Button>
                  </div>
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

