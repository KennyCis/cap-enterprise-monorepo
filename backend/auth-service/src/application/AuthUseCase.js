const pool = require('../infrastructure/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthUseCase {
    async login(email, password) {
        // 1. Verificar si el usuario existe en la base de datos
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            throw new Error('Invalid email or password'); // Mensaje genérico por seguridad
        }

        // 2. Comparar la contraseña ingresada con el hash de la BD
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        // 3. Generar el JSON Web Token (JWT)
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Retornar datos (excluyendo la contraseña por seguridad)
        return {
            user: payload,
            token
        };
    }
}

module.exports = new AuthUseCase();