const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Auto-create reservations table if it does not exist
const initDB = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS reservations (
            id SERIAL PRIMARY KEY,
            teacher_email VARCHAR(100) NOT NULL,
            room_id VARCHAR(50) NOT NULL,
            reservation_date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            status VARCHAR(20) DEFAULT 'CONFIRMED',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(createTableQuery);
        console.log('✅ Table "reservations" verified/created successfully.');
    } catch (err) {
        console.error('❌ Error creating reservations table:', err);
    }
};

initDB();

module.exports = {
    query: (text, params) => pool.query(text, params),
};