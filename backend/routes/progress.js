const express = require('express');
const router = express.Router();
const {
  getUserProgress,
  updateProgress,
  getProgressTimeline,
  getProgressByCategory,
} = require('../controllers/progressController');

// POST /api/progress/update - Update user progress (must come before /:userId routes)
router.post('/update', updateProgress);

// GET /api/progress/:userId/timeline - Get progress timeline
router.get('/:userId/timeline', getProgressTimeline);

// GET /api/progress/:userId/by-category - Get progress by category
router.get('/:userId/by-category', getProgressByCategory);

// GET /api/progress/:userId - Get user progress overview
router.get('/:userId', getUserProgress);

module.exports = router;
