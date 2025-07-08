const express = require('express');
const router = express.Router();
const { signup, login, searchUsers } = require('../controllers/UserController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route (add authentication middleware later)
router.get('/search', searchUsers);

module.exports = router;