const AuthUseCase = require('../application/AuthUseCase');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validación básica de entrada
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Ejecutar caso de uso
            const authData = await AuthUseCase.login(email, password);
            
            // Retornar respuesta exitosa
            return res.status(200).json(authData);
            
        } catch (error) {
            // Atrapa credenciales inválidas o errores de código
            return res.status(401).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();