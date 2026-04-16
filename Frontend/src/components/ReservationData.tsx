import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { deleteReservation } from '../services/reservations';
import type { Reservation } from '../types';

const ReservationData = (props?: { setShowReservation?: React.Dispatch<React.SetStateAction<boolean>>, saunaNumber?: string, date: string, reservedHour?: string, setReservations?: React.Dispatch<React.SetStateAction<Reservation[]>>, token?: string  }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    if (props?.setShowReservation) {
      props.setShowReservation(false);
    }
  };

  const handleDeleteReservation = async () => {
   if (props?.date && props?.saunaNumber && props?.token && props?.setReservations) {
        const dateParts = props.date.split(' ')
        const datePartsModified = dateParts[1].split('.')
        const dateFormatted = `${datePartsModified[2]}-${datePartsModified[1].padStart(2, '0')}-${datePartsModified[0].padStart(2, '0')}-${props.reservedHour}`
        const result = await deleteReservation(props.saunaNumber, dateFormatted, props.token)
        props.setReservations((current: Reservation[]) => {
            return current.filter(r =>  {   
              const datemodified = dateFormatted.split('-')        
              return r.Date !== `${datemodified[2]}-${datemodified[1]}-${datemodified[0]}-${props.reservedHour}`
            })
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