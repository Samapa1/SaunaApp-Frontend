import React from "react";
import { Container, Row, Button } from "react-bootstrap";

import { create } from "../services/reservations";

const FIRST_HOUR = 17;
const LAST_HOUR = 22;

interface Reservation {
    Id: string,
    Date: string
}

const makeReservation = async (rawReservationData: string, setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>) => {
    console.log("making reservation")
    const reservationData = {
        "sauna": "3",
        "date": rawReservationData
    }

    const myReservation = await create(reservationData)
    console.log(myReservation)
    setReservations((current: Reservation[]) => {
        return current.concat({ 
        "Id": "3",
        "Date": rawReservationData
    ,})
    })    
}

const btn = {
    // backgroundColor: '#2C3034',
    backgroundColor: 'transparent',
	color: 'white',
    border: 'none',
    width: '5%',
}

const checkAvailability = (hour: string, dateFormatted: string, reservations: Array<Reservation>, setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>) => {
    const modified = reservations.map(r => r.Date)
    const reservationRawData = `${dateFormatted}-${hour}`

    const reservedHours = modified.map(r => {
        const dateParts = r.split('-')
        const hours = dateParts[3]
        return hours
    })
    if (reservedHours.find(h => h === hour)) {
        return "varattu"
    }
    else {
        return <Button style={btn} onClick={() => makeReservation(reservationRawData, setReservations)}>vapaa</Button>
    }
}

const ReservationDayTable = (props: { date: string, reservations: Array<Reservation>, setReservations: React.Dispatch<React.SetStateAction<Reservation[]>> }) => {
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
                        {hour}:00 {checkAvailability(hour.toString(), dateFormatted, reservationsOfTheDay, props.setReservations)}
                    </Row>
                );
            })}
        </Container>
    )
}

export default ReservationDayTable;
