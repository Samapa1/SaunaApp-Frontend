import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'react-bootstrap'
import { DateTime } from "luxon";

import ReservationDayTable from './ReservationDayTable';
import { getAll } from '../services/reservations';
import type { Reservation } from '../types';

interface Props {
  sauna: string
}

const DAYS_IN_WEEK = 7

const Calendar = ({sauna}: Props) => {
    const [currentDate, setCurrentDate ] = useState<DateTime<true>>(DateTime.now().startOf('week'))
    const weekdays = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su']
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const saunaNumber = sauna.split(' ')[1]

    useEffect(() => {
        const getReservations = async () => {
            const allReservations = await getAll(saunaNumber)
            setReservations(allReservations)
        }
        getReservations()
    }, []);

    const dateFormatter = (count: number) => {
        const dateNow = currentDate.plus({days: count}).toString()
        const date = DateTime.fromISO(dateNow)
        return date.toISODate()
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
       
                return <ReservationDayTable key={index} setReservations={setReservations} date={formattedDate} reservations={reservationsOfTheDay} saunaNumber={saunaNumber}/>
            })}
        </div>

        <Button className="m-1" variant="dark" onClick={handleClickPrevious}>Edellinen viikko</Button>
        <Button className="m-1" variant="dark" onClick={handleClickNext}>Seuraava viikko</Button>

        </>
    )
}

export default Calendar




