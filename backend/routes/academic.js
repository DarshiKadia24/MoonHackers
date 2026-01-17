const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAcademicPerformance,
  updateAcademicPerformance,
  addCourse,
  removeCourse,
  getGPA,
} = require('../controllers/academicController');

// @route   GET /api/academic/:userId/gpa
// @desc    Get GPA calculation
// @access  Private
router.get('/:userId/gpa', auth, getGPA);

// @route   DELETE /api/academic/:userId/courses/:courseId
// @desc    Remove a course
// @access  Private
router.delete('/:userId/courses/:courseId', auth, removeCourse);

// @route   POST /api/academic/:userId/courses
// @desc    Add a course
// @access  Private
router.post('/:userId/courses', auth, addCourse);

// @route   GET /api/academic/:userId
// @desc    Get user's academic performance
// @access  Private
router.get('/:userId', auth, getAcademicPerformance);

// @route   POST /api/academic/:userId
// @desc    Update academic performance
// @access  Private
router.post('/:userId', auth, updateAcademicPerformance);

module.exports = router;
