const express = require('express');
const router = express.Router();
const AuthController = require('./AuthController');

// POST /api/auth/login
// bind()  'this' 
router.post('/login', AuthController.login.bind(AuthController));

module.exports = router;