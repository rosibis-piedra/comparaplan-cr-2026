// backend/src/routes/api.js
const express = require('express');
const router = express.Router();
const checkRateLimit = require('../middleware/rateLimiter');
const { compare } = require('../controllers/compareController');

// POST /api/compare - Comparar planes
router.post('/compare', checkRateLimit, compare);

module.exports = router;