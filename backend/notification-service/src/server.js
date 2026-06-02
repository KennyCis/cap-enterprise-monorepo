const express = require('express');
require('dotenv').config();
const { connectConsumer } = require('./kafkaConsumer');

const app = express();

// Initialize Kafka Listener
connectConsumer();

// Simple health check route
app.get('/api/notifications/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'Notification Service' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Notification Service running on http://localhost:${PORT}`);
});