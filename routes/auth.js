const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// API endpoints
router.post('/api/register', AuthController.register);
router.post('/api/login', AuthController.login);

// View routes
router.get('/login', (req, res) => res.render('auth/login'));
router.get('/register', (req, res) => res.render('auth/register'));

module.exports = router;
