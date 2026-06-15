const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

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
        
        // Check if admin exists to avoid hashing unnecessarily every time
        const adminExists = await pool.query(`SELECT id FROM users WHERE email = 'admin@uce.edu.ec'`);
        
        if (adminExists.rowCount === 0) {
            // Hash password securely before inserting
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('1234', salt);
            
            await pool.query(`
                INSERT INTO users (email, password, role) 
                VALUES ('admin@uce.edu.ec', $1, 'ADMIN');
            `, [hashedPassword]);
            console.log('Admin user created successfully.');
        }

        console.log('PostgreSQL database connected and synchronized successfully.');
    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error.message);
    }
};

initDB();

module.exports = pool;