const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize database connection
require('./infrastructure/database'); 

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./infrastructure/AuthRoutes');

// Mount routes
app.use('/api/auth', authRoutes);

// Health Check Endpoint
app.get('/api/auth/health', (req, res) => {
    res.status(200).json({ 
        status: 'UP', 
        service: 'Auth Service', 
        architecture: 'Hexagonal' 
    });
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Reservation Service running on ${PORT}`);
    });
}

module.exports = app;