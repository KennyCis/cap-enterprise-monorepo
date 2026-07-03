const express = require('express');
const cors = require('cors');
require('dotenv').config();

const reservationRoutes = require('./routes/reservationRoutes');
const { connectProducer } = require('./config/kafka');

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Kafka connection
connectProducer();

app.get('/api/reservations/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'Reservation Service' });
});

// Business Routes
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 3002;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Reservation Service running on ${PORT}`);
    });
}

module.exports = app;