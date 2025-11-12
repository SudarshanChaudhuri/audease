const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getSuggestions,
  findOptimalTime
} = require('../controllers/assistantController');

// All routes require authentication
router.use(authMiddleware);

// Get smart booking suggestions
router.get('/suggestions', getSuggestions);

// Find optimal booking time
router.post('/optimal-time', findOptimalTime);

module.exports = router;
