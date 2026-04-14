const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Kayıt ve Login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Şifre Sıfırlama (Buradaki authController. eklemelerine dikkat!)
router.post('/forgotpassword', authController.forgotPassword);
router.put('/resetpassword/:resetToken', authController.resetPassword);

module.exports = router;