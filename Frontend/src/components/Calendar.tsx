import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table, Button  } from 'react-bootstrap'
import { DateTime } from "luxon";

interface Props {
  sauna: string
}

const Calendar = ({sauna}: Props) => {
    const [currentDate, setCurrentDate ] = useState<DateTime<true> | null>(DateTime.now().startOf('week'))
    const weekdays = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su']
    const timeslots = ['17', '18', '19', '20', '21', '22']
    let count = -1
    console.log(currentDate)

    const dateFormatter = (count: number) => {
        if (currentDate) {
            const dateNow = currentDate.plus({days: count}).toString()
            const date = DateTime.fromISO(dateNow)
            const shortForm = date.toISODate()
            const datepParts = shortForm?.split('-')
            const formattedDate = datepParts?.reverse().join('.')
            return formattedDate
        }
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
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    {weekdays.map(d => {
                            count += 1
                            return (<th key={d} scope="col">{`${d} ${dateFormatter(count)}`}</th>)
                        },
                    )}
                </tr>
            </thead>
            <tbody>
            {
                timeslots.map(t => {
                     return (
                        <tr key= {t}>
                            <td>{t}</td>
                            <td>{t}</td>
                            <td>{t}</td>
                            <td>{t}</td>
                            <td>{t}</td>
                            <td>{t}</td>
                            <td>{t}</td>
                        </tr>
                    )
                })
            }
            </tbody>
        </Table>
        <Button className="m-1" variant="dark" onClick={handleClickPrevious}>Edellinen viikko</Button>
        <Button className="m-1" variant="dark" onClick={handleClickNext}>Seuraava viikko</Button>
        </>
    )
}

export default Calendar




