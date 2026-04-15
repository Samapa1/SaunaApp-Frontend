import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { deleteReservation } from '../services/reservations';
import type { Reservation } from '../types';

const ReservationData = (props?: {
  setShowDeleteReservation?: React.Dispatch<React.SetStateAction<boolean>>,
  saunaNumber?: string,
  date?: string,
  rawDate?: string,
  reservedHour?: string,
  setReservations?: React.Dispatch<React.SetStateAction<Reservation[]>>,
  token?: string
}) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    if (props?.setShowDeleteReservation) {
      props.setShowDeleteReservation(false);
    }
  };

  const handleDeleteReservation = async () => {
    if (props?.rawDate && props?.saunaNumber && props?.token && props?.setReservations) {
        // rawDate format from backend: "day-month-year-hours" e.g. "5-4-2026-14"
        const parts = props.rawDate.split('-');
        const dateFormatted = `${parts[2]}-${parts[1]}-${parts[0]}-${parts[3]}`;
        const result = await deleteReservation(props.saunaNumber, dateFormatted, props.token)
        props.setReservations((current: Reservation[]) => {
            return current.filter(r => r.Date !== props.rawDate)
        })
        console.log(result)
        handleClose()
    }
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Varauksesi {props?.date} klo {props?.reservedHour}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Haluatko varmasti poistaa varauksen?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Sulje
          </Button>
          <Button variant="primary" onClick={handleDeleteReservation}>
            Poista varaus
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReservationData;