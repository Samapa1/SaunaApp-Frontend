import React from "react";
import { Container, Row, Button } from "react-bootstrap";

import { create } from "../services/reservations";

const FIRST_HOUR = 17;
const LAST_HOUR = 22;

interface Reservation {
    Id: string,
    Date: string
}

const makeReservation = async () => {
    console.log("making reservation")
    const reservationData = {
        "sauna": "3",
        "date": "07-11-2025-20"
    }

    const myReservation = await create(reservationData)
    console.log(myReservation)
}

const btn = {
    // backgroundColor: '#2C3034',
    backgroundColor: 'transparent',
	color: 'white',
    border: 'none',
    width: '5%',
}

const checkAvailability = (hour: string, reservations: Array<Reservation>) => {
    const modified = reservations.map(r => r.Date)
    const reservedHours = modified.map(r => {
        const dateParts = r.split('-')
        const hours = dateParts[3]
        return hours
    })
    if (reservedHours.find(h => h === hour)) {
        return "varattu"
    }
    else {
        return <Button style={btn} onClick={() => makeReservation()}>vapaa</Button>
    }
}

function ReservationDayTable(props: { date: string, reservations: Array<Reservation> }) {
    // console.log(props.reservations)
    // console.log(props.date)
    const dateFormatted = props.date.split(' ')
    const dateFormatted2 = dateFormatted[1].split('.').join('-')
    const reservations = props.reservations
    const reservationsOfTheDay = reservations.filter(r => r.Date.includes(dateFormatted2))
    
    return (
        <Container fluid>
            <Row className="p-2 border border-secondary" style={{ color: 'white', fontWeight: 'bold', backgroundColor: "#212529" }}>{props.date}</Row>
            {Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, index) => {
                const hour = FIRST_HOUR + index;
                return (
                    <Row className="p-2 border border-secondary" style={{ color: 'white', backgroundColor: hour % 2 === 0 ? "#212529" : "#2c3034" }} key={hour}>
                        {hour}:00 {checkAvailability(hour.toString(), reservationsOfTheDay)}
                    </Row>
                );
            })}
        </Container>
    )
}

export default ReservationDayTable;
