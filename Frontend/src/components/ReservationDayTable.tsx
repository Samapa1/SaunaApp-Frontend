import React from "react";
import { Container, Row } from "react-bootstrap";

const FIRST_HOUR = 17;
const LAST_HOUR = 22;

function ReservationDayTable(props: { date: string }) {
    return (
        <Container fluid>
            <Row className="p-2 border border-secondary" style={{ color: 'white', fontWeight: 'bold', backgroundColor: "#212529" }}>{props.date}</Row>
            {Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, index) => {
                const hour = FIRST_HOUR + index;
                return (
                    <Row className="p-2 border border-secondary" style={{ color: 'white', backgroundColor: hour % 2 === 0 ? "#212529" : "#2c3034" }} key={hour}>
                        {hour}:00
                    </Row>
                );
            })}
        </Container>
    )
}

export default ReservationDayTable;
