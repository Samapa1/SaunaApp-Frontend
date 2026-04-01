import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'react-bootstrap'
import { DateTime } from "luxon";

import ReservationDayTable from './ReservationDayTable';
import { getAll } from '../services/reservations';
import type { Reservation } from '../types';
import { useAuth } from 'react-oidc-context';

interface Props {
  sauna: string,
  reservations: Reservation[],
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  showDeleteReservation: boolean,
  setShowDeleteReservation: React.Dispatch<React.SetStateAction<boolean>>
}

const DAYS_IN_WEEK = 7

const Calendar = ({sauna, reservations, setReservations, showDeleteReservation, setShowDeleteReservation }: Props) => {
    const [currentDate, setCurrentDate ] = useState<DateTime<true>>(DateTime.now().startOf('week'))
    const [reservedHour, setReservedHour] = useState('')
    const [reservedDate, setReservedDate] = useState('')
    const weekdays = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su']
    const saunaNumber = sauna.split(' ')[1]

    const auth = useAuth();
    const token = auth.user?.access_token || ''
    
    useEffect(() => {
        const getReservations = async () => {
                const dateData = `${currentDate.weekYear}-${String(currentDate.month).padStart(2, '0')}-${currentDate.weekNumber}`
                const allReservations = await getAll(saunaNumber, dateData, token)
                setReservations(allReservations)
            }
        getReservations()
    }, [currentDate]);

    const dateFormatter = (count: number) => {
        const dateNow = currentDate.plus({days: count}).toString()
        const date = DateTime.fromISO(dateNow)
        const isoDate = date.toISODate() ?? ''
        const parts = isoDate.split('-')
        const month = parts[1].padStart(2, '0')
        const day = parts[2].padStart(2, '0')
        return `${date.year}-${month}-${day}`
    }   

    const getReservationsOfTheDay = (formattedDate: string) => {
        const date = formattedDate.split(' ')[1]
        const date2 = date.split('-').reverse().join('-')
        const reservationsOfTheDay = reservations.filter(r => r.Date.includes(date2))
        return reservationsOfTheDay
    }

    const handleClickNext = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (currentDate) {
            setCurrentDate(currentDate.plus({days: 7}))
        }
    }

    const handleClickPrevious = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (currentDate) {
            setCurrentDate(currentDate.minus({days: 7}))
        }
    }

    return (
        <>
        <h2>{sauna} varaukset</h2>
        <div className="d-flex flex-column flex-md-row">
            {Array.from({ length: DAYS_IN_WEEK }).map((_, index) => {
                const rawFormattedDate = `${weekdays[index]} ${dateFormatter(index) ?? "?"}`
                const reservationsOfTheDay = getReservationsOfTheDay(rawFormattedDate)
                const dayParts = rawFormattedDate.split(' ')
                const formattedDate = `${dayParts[0]} ${dayParts[1].split('-').reverse().join('.')}`
       
                return <ReservationDayTable key={index} setReservations={setReservations} date={formattedDate} reservations={reservationsOfTheDay} saunaNumber={saunaNumber} showDeleteReservation={showDeleteReservation} setShowDeleteReservation={setShowDeleteReservation} reservedHour={reservedHour} setReservedHour={setReservedHour} reservedDate={reservedDate} setReservedDate={setReservedDate}/>
            })}
        </div>

        <Button className="m-1" variant="dark" onClick={handleClickPrevious}>Edellinen viikko</Button>
        <Button className="m-1" variant="dark" onClick={handleClickNext}>Seuraava viikko</Button>

        </>
    )
}

export default Calendar




