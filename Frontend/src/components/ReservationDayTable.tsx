import React from "react";
import { Container, Row } from "react-bootstrap";

const FIRST_HOUR = 17;
const LAST_HOUR = 22;

interface Reservation {
    Id: string,
    Date: string
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
        return "vapaa"
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
