import React from "react";
import { Container, Row, Button } from "react-bootstrap";

import { create } from "../services/reservations";
import type { Reservation } from "../types";

const FIRST_HOUR = 17;
const LAST_HOUR = 22;

const makeReservation = async (rawReservationData: string, saunaNumber: string, setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>) => {
    const reservationData = {
        "sauna": saunaNumber,
        "date": rawReservationData
    }

    const myReservation = await create(reservationData)
    console.log(myReservation)
    setReservations((current: Reservation[]) => {
        return current.concat({ 
        "Id": saunaNumber,
        "Date": rawReservationData
    ,})
    })    
}

const btn = {
    backgroundColor: 'transparent',
	color: 'white',
    border: 'none',
    // width: '5%',
}

const checkAvailability = (hour: string, dateFormatted: string, saunaNumber: string, reservations: Array<Reservation>, setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>) => {
    const modified = reservations.map(r => r.Date)
    const reservationRawData = `${dateFormatted}-${hour}`

    const reservedHours = modified.map(r => {
        const dateParts = r.split('-')
        const hours = dateParts[3]
        return hours
    })
    if (reservedHours.find(h => h === hour)) {
        return <Button style={btn} disabled>varattu</Button>
    }
    else {
        return <Button style={btn} onClick={() => makeReservation(reservationRawData, saunaNumber, setReservations)}>vapaa</Button>
    }
}

const ReservationDayTable = (props: { date: string, reservations: Array<Reservation>, saunaNumber: string, setReservations: React.Dispatch<React.SetStateAction<Reservation[]>> }) => {
    const dateParts = props.date.split(' ')
    const dateFormatted = dateParts[1].split('.').join('-')
    const reservationsOfTheDay = props.reservations
    
    return (
        <Container fluid>
            <Row className="p-2 border border-secondary" style={{ color: 'white', fontWeight: 'bold', backgroundColor: "#212529" }}>{props.date}</Row>
            {Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, index) => {
                const hour = FIRST_HOUR + index;
                return (
                    <Row className="p-2 border border-secondary" style={{ color: 'white', backgroundColor: hour % 2 === 0 ? "#212529" : "#2c3034" }} key={hour}>
                        <div style={{ display: "flex", flexFlow: "row"}}>
                            <div>{hour}:00</div>
                            <div>{checkAvailability(hour.toString(), dateFormatted, props.saunaNumber, reservationsOfTheDay, props.setReservations)}</div>
                        </div>
                    </Row>
                );
            })}
        </Container>
    )
}

export default ReservationDayTable;
