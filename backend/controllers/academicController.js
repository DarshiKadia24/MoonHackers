const AcademicPerformance = require('../models/AcademicPerformance');
const User = require('../models/User');

// @route   GET /api/academic/:userId
// @desc    Get user's academic performance
// @access  Private
const getAcademicPerformance = async (req, res) => {
  try {
    const { userId } = req.params;

    let academic = await AcademicPerformance.findOne({ userId }).populate('courses.skillsGained', 'name category');

    if (!academic) {
      // Create empty academic record
      academic = new AcademicPerformance({ userId });
      await academic.save();
    }

    // Calculate GPA if courses exist
    if (academic.courses && academic.courses.length > 0) {
      const gpaData = academic.calculateGPA();
      academic.cumulativeGPA = gpaData.cumulativeGPA;
      academic.currentGPA = gpaData.currentGPA;
      await academic.save();
    }

    res.json(academic);
  } catch (error) {
    console.error('Error fetching academic performance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/academic/:userId
// @desc    Create or update academic performance
// @access  Private
const updateAcademicPerformance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courses, achievements, cumulativeGPA, currentGPA } = req.body;

    let academic = await AcademicPerformance.findOne({ userId });

    if (!academic) {
      academic = new AcademicPerformance({ userId });
    }

    if (courses) {
      academic.courses = courses;
    }

    if (achievements) {
      academic.achievements = achievements;
    }

    if (cumulativeGPA !== undefined) {
      academic.cumulativeGPA = cumulativeGPA;
    }

    if (currentGPA !== undefined) {
      academic.currentGPA = currentGPA;
    }

    // Recalculate GPA if courses are provided
    if (courses && courses.length > 0) {
      const gpaData = academic.calculateGPA();
      academic.cumulativeGPA = gpaData.cumulativeGPA;
      academic.currentGPA = gpaData.currentGPA;
    }

    await academic.save();

    res.json(academic);
  } catch (error) {
    console.error('Error updating academic performance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/academic/:userId/courses
// @desc    Add a course to academic performance
// @access  Private
const addCourse = async (req, res) => {
  try {
    const { userId } = req.params;
    const courseData = req.body;

    let academic = await AcademicPerformance.findOne({ userId });

    if (!academic) {
      academic = new AcademicPerformance({ userId });
    }

    academic.courses.push(courseData);

    // Recalculate GPA
    const gpaData = academic.calculateGPA();
    academic.cumulativeGPA = gpaData.cumulativeGPA;
    academic.currentGPA = gpaData.currentGPA;

    await academic.save();

    res.json(academic);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   DELETE /api/academic/:userId/courses/:courseId
// @desc    Remove a course from academic performance
// @access  Private
const removeCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    let academic = await AcademicPerformance.findOne({ userId });

    if (!academic) {
      return res.status(404).json({ message: 'Academic performance record not found' });
    }

    // Find and remove the course
    const courseIndex = academic.courses.findIndex(
      course => course._id.toString() === courseId
    );

    if (courseIndex === -1) {
      return res.status(404).json({ message: 'Course not found' });
    }

    academic.courses.splice(courseIndex, 1);

    // Recalculate GPA after removal
    if (academic.courses.length > 0) {
      const gpaData = academic.calculateGPA();
      academic.cumulativeGPA = gpaData.cumulativeGPA;
      academic.currentGPA = gpaData.currentGPA;
    } else {
      academic.cumulativeGPA = 0;
      academic.currentGPA = 0;
    }

    await academic.save();

    res.json({
      message: 'Course removed successfully',
      academic,
    });
  } catch (error) {
    console.error('Error removing course:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/academic/:userId/gpa
// @desc    Get GPA calculation for a user
// @access  Private
const getGPA = async (req, res) => {
  try {
    const { userId } = req.params;

    let academic = await AcademicPerformance.findOne({ userId });

    if (!academic) {
      return res.status(404).json({
        message: 'Academic performance record not found',
        gpa: {
          cumulativeGPA: 0,
          currentGPA: 0,
          totalCredits: 0,
          completedCredits: 0,
          coursesCount: 0,
        },
      });
    }

    // Calculate GPA
    const gpaData = academic.calculateGPA();

    // Calculate total and completed credits
    let totalCredits = 0;
    let completedCredits = 0;

    academic.courses.forEach(course => {
      if (course.credits) {
        totalCredits += course.credits;
        if (course.grade && course.grade !== 'I' && course.grade !== 'W') {
          completedCredits += course.credits;
        }
      }
    });

    // GPA by category
    const gradeDistribution = {
      'A': 0,
      'B': 0,
      'C': 0,
      'D': 0,
      'F': 0,
    };

    academic.courses.forEach(course => {
      if (course.grade) {
        const gradeCategory = course.grade.charAt(0);
        if (gradeDistribution[gradeCategory] !== undefined) {
          gradeDistribution[gradeCategory]++;
        }
      }
    });

    res.json({
      userId,
      gpa: {
        cumulativeGPA: gpaData.cumulativeGPA,
        currentGPA: gpaData.currentGPA,
        totalCredits,
        completedCredits,
        coursesCount: academic.courses.length,
      },
      gradeDistribution,
      recentCourses: academic.courses
        .sort((a, b) => (b.year || 0) - (a.year || 0))
        .slice(0, 5)
        .map(course => ({
          courseCode: course.courseCode,
          courseName: course.courseName,
          grade: course.grade,
          credits: course.credits,
          semester: course.semester,
          year: course.year,
        })),
    });
  } catch (error) {
    console.error('Error getting GPA:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAcademicPerformance,
  updateAcademicPerformance,
  addCourse,
  removeCourse,
  getGPA,
};
