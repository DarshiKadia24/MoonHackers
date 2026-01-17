const express = require('express');
const router = express.Router();
const {
  getUserRecommendations,
  getSpecialtyRecommendations,
  filterRecommendations,
} = require('../controllers/recommendationController');

// POST /api/recommendations/filter - Filter recommendations by criteria (must come before /:userId)
router.post('/filter', filterRecommendations);

// GET /api/recommendations/specialty/:specialty - Get recommendations by healthcare specialty (must come before /:userId)
router.get('/specialty/:specialty', getSpecialtyRecommendations);

// GET /api/recommendations/:userId - Get personalized recommendations for a user
router.get('/:userId', getUserRecommendations);

module.exports = router;
