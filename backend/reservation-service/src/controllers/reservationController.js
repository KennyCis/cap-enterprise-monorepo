const db = require('../config/database');
const { sendReservationEvent } = require('../config/kafka');

// Create a new reservation and emit event to Kafka
const createReservation = async (req, res) => {
    const { teacher_email, room_id, reservation_date, start_time, end_time } = req.body;

    try {
        // 1. Save to PostgreSQL
        const insertQuery = `
            INSERT INTO reservations (teacher_email, room_id, reservation_date, start_time, end_time)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const values = [teacher_email, room_id, reservation_date, start_time, end_time];
        const result = await db.query(insertQuery, values);
        const newReservation = result.rows[0];

        // 2. Emit event to Kafka
        await sendReservationEvent(newReservation);

        // 3. Respond to client
        res.status(201).json({
            message: 'Reservation created successfully',
            reservation: newReservation
        });

    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ error: 'Internal server error while creating reservation' });
    }
};

// Fetch all reservations for the frontend table
const getAllReservations = async (req, res) => {
    try {
        // Retrieve all reservations ordered by newest first
        const result = await db.query('SELECT * FROM reservations ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Internal server error while fetching reservations' });
    }
};

module.exports = { createReservation, getAllReservations };