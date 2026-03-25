import React from "react";
import { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { useAuth } from "react-oidc-context";

import { create } from "../services/reservations";
import type { Reservation } from "../types";
import ReservationData from "./ReservationData";


interface ReservationDayTableProps {
  date: string;
  reservations: Reservation[];
  saunaNumber: string;
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
}

const FIRST_HOUR = 17;
const LAST_HOUR = 22;

const btn = {
    backgroundColor: 'transparent',
	color: 'white',
    border: 'none',
}

const makeReservation = async (rawReservationData: string, saunaNumber: string, setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>, token: string) => {
    const reservationData = {
        "sauna": saunaNumber,
        "date": rawReservationData
    }

    await create(reservationData, token)
    setReservations((current: Reservation[]) => {
        return current.concat({ 
        "Id": saunaNumber,
        "Date": rawReservationData,
        "isOwnReservation": true
        })
    })    
}

const checkAvailability = (
    hour: string, 
    dateFormatted: string, 
    saunaNumber: string, 
    reservations: Array<Reservation>, 
    setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>, 
    token: string,
    setShowReservation: React.Dispatch<React.SetStateAction<boolean>>, 
    setReservedHour: React.Dispatch<React.SetStateAction<string>>
) => {
    const newReservationData = `${dateFormatted}-${hour}`
    const reservedHours = reservations.map(r => {
        const dateParts = r.Date.split('-')
        const hours = dateParts[3]
        return ({...r, Date: hours })
    })
    
    const handleShowReservation = (setReservedHour: React.Dispatch<React.SetStateAction<string>>, hour: string, setShowReservation: React.Dispatch<React.SetStateAction<boolean>>) => {
        setReservedHour(hour)
        setShowReservation(true)
        return
    }

    if (reservedHours.find(h => h.Date === hour && h.isOwnReservation === true)) {
        return (
             <div style={{ display: 'flex', alignItems: 'center'}}>
                <Button style={btn} disabled>oma varaus</Button>
                <Button style={{ ...btn, padding: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleShowReservation(setReservedHour, hour, setShowReservation)}>×</Button>
            </div>
        )
    } else if (reservedHours.find(h => h.Date === hour)) {
        return <Button style={btn} disabled>varattu</Button>
    }
    else {
        return <Button style={btn} onClick={() => makeReservation(newReservationData, saunaNumber, setReservations, token)}>vapaa</Button>
    }
}

const ReservationDayTable = (props: ReservationDayTableProps) => {
    const [showReservation, setShowReservation] = useState(false)
    const [reservedHour, setReservedHour] = useState('')
    const date = props.date
    const dateParts = props.date.split(' ')
    const dateFormatted = dateParts[1].split('.').join('-')
    const reservationsOfTheDay = props.reservations
    const saunaNumber = props.saunaNumber
    

    const auth = useAuth();
    const token = auth.user?.access_token || ''
    
    return (
        <Container fluid>
             {showReservation ? <ReservationData 
                setShowReservation={setShowReservation} 
                saunaNumber={saunaNumber}
                date={date}
                reservedHour={reservedHour}
                token={token}
                setReservations={props.setReservations}
            /> : null}
            <Row className="p-2 border border-secondary" style={{ color: 'white', fontWeight: 'bold', backgroundColor: "#212529" }}>{props.date}</Row>
            {Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, index) => {
                const hour = FIRST_HOUR + index;
                return (
                    <Row className="p-2 border border-secondary" style={{ color: 'white', backgroundColor: hour % 2 === 0 ? "#212529" : "#2c3034" }} key={hour}>
                        <div style={{ display: "flex", flexFlow: "row"}}>
                            <div>{hour}:00</div>
                            <div>{checkAvailability(hour.toString(), dateFormatted, props.saunaNumber, reservationsOfTheDay, props.setReservations, token, setShowReservation, setReservedHour)}</div>
                        </div>
                    </Row>
                );
            })}
        </Container>

    )
}

export default ReservationDayTable;
