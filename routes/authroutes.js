const express = require('express');
const router = express.Router();

// Import file authController dengan path dan nama variabel yang benar
const authController = require('../controllers/authcontroller'); 

// Gunakan variabel authController
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;