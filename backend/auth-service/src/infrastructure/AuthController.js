const authUseCase = require('../application/AuthUseCase');

class AuthController {
    // 1. Controller must receive Express 'req' and 'res' objects
    async login(req, res) {
        try {
            // 2. Extract the actual email and password strings from the JSON body
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // 3. Pass only the strings to the Use Case
            const response = await authUseCase.login(email, password);
            res.status(200).json(response);
            
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();