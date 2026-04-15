import { useState, useEffect } from 'react';
import { DateTime } from "luxon";
import { Spinner, Button } from 'react-bootstrap';
import { getOwnReservations } from "../services/reservations";
import { useAuth } from 'react-oidc-context';
import type { Reservation } from '../types';
import ReservationData from './ReservationData';

const weekdays = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];

const parseReservationDateTime = (dateStr: string) => {
  const dateParts = dateStr.split('-');
  const hours = dateParts[dateParts.length - 1];
  const year = Number(dateParts[2]);
  const month = Number(dateParts[1].padStart(2, '0'));
  const day = Number(dateParts[0].padStart(2, '0'));
  return { day, month, year, hours };
};

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

  const now = DateTime.now();

  const upcoming = reservations.filter(r => {
    const { day, month, year, hours } = parseReservationDateTime(r.Date);
    return DateTime.fromObject({ year, month, day, hour: Number(hours) }) >= now;
  });

  const past = reservations.filter(r => {
    const { day, month, year, hours } = parseReservationDateTime(r.Date);
    return DateTime.fromObject({ year, month, day, hour: Number(hours) }) < now;
  });

  const groupBySauna = (list: Reservation[]) => {
    const grouped: Record<string, Reservation[]> = {};
    for (const r of list) {
      if (!grouped[r.Id]) grouped[r.Id] = [];
      grouped[r.Id].push(r);
    }
    return grouped;
  };

  const renderReservation = (reservation: Reservation, index: number, isUpcoming: boolean) => {
    const { day, month, year, hours } = parseReservationDateTime(reservation.Date);
    const dateWithoutHours = `${day}.${month}.${year}`;
    const isoDate = DateTime.fromObject({ year, month, day }).toISODate() ?? ' ';
    const dateObj = DateTime.fromISO(isoDate);
    const dayName = weekdays[dateObj.weekday - 1];
    const dateWithWeekday = `${dayName} ${dateWithoutHours}`;

    return (
      <li key={index} style={{ listStyle: 'none', padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ minWidth: '160px' }}>{`${dateWithWeekday} klo ${hours}`}</span>
          {isUpcoming && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDeleteClick(dateWithWeekday, hours, reservation.Id)}
              style={{ padding: '2px 8px', fontSize: '14px' }}
            >
              ×
            </Button>
          )}
        </div>
      </li>
    );
  };

  const renderSection = (title: string, list: Reservation[], isUpcoming: boolean) => {
    const grouped = groupBySauna(list);
    const saunaIds = Object.keys(grouped).sort();
    if (saunaIds.length === 0) return null;
    return (
      <div style={{ padding: '5px', marginTop: '5px' }}>
        <h3>{title}</h3>
        {saunaIds.map(saunaId => (
          <div key={saunaId} style={{ padding: '5px' }}>
            <h5 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Sauna {saunaId}</h5>
            <ul style={{ paddingLeft: 0 }}>
              {grouped[saunaId].map((r, i) => renderReservation(r, i, isUpcoming))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <h1>Omat varaukset</h1>
      {showDeleteReservation ? <ReservationData 
        setShowReservation={setShowDeleteReservation}
        saunaNumber={selectedSaunaId}
        date={reservedDate}
        reservedHour={reservedHour}
        token={token}
        setReservations={setReservations}
      /> : null}
      <div style= {{ marginTop: '20px' }}>
        {isLoading ? (
          <Spinner animation='border' size='sm' variant='primary' />
        ) : reservations.length > 0 ? (
          <>
            {renderSection('Tulevat', upcoming, true)}
            {renderSection('Menneet', past, false)}
          </>
        ) : (
          <p>Ei varauksia</p>
        )}
      </div>
    </>
  );
}

export default OwnReservations

