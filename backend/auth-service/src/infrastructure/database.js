const { Pool } = require('pg');

// Database pool configuration using environment variables
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Initialize database with a default admin user
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                role VARCHAR(50) NOT NULL
            );
        `);
        
        // Insert default admin user (Note: passwords should be hashed in a real scenario)
        await pool.query(`
            INSERT INTO users (email, password, role) 
            VALUES ('admin@uce.edu.ec', '1234', 'ADMIN') 
            ON CONFLICT (email) DO NOTHING;
        `);
        console.log('PostgreSQL database connected and synchronized successfully.');
    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error.message);
    }
};

initDB();

module.exports = pool;