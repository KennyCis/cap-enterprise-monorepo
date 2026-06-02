const jwt = require('jsonwebtoken');
const pool = require('../infrastructure/database');

class AuthUseCase {
    async login(email, password) {
        // 1. Find user in the database
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        // 2. Validate user existence and password match
        if (!user || user.password !== password) {
            throw new Error('Invalid credentials');
        }

        // 3. Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return {
            message: 'Login successful',
            token: token,
            role: user.role
        };
    }
}

module.exports = new AuthUseCase();