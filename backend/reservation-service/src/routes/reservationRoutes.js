const express = require('express');
const { createReservation, getAllReservations } = require('../controllers/reservationController');

const router = express.Router();

// POST route to create a reservation
router.post('/', createReservation);

// GET route to fetch all reservations
router.get('/', getAllReservations);

module.exports = router;