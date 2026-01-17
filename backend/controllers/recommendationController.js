const User = require('../models/User');
const UserSkill = require('../models/UserSkill');
const Skill = require('../models/Skill');
const Course = require('../models/Course');
const CareerPath = require('../models/CareerPath');

// @route   GET /api/recommendations/:userId
// @desc    Get personalized recommendations for a user
// @access  Public (can be protected later)
const getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's current skills
    const userSkills = await UserSkill.find({ userId }).populate('skillId', 'name category healthcareContext');

    // Get user's healthcare specialization
    const userSpecialty = user.healthcareSpecialization || 'Health Informatics';

    // Get all skills (all healthcare now)
    const availableSkills = await Skill.find({});
    const userSkillIds = userSkills.map(us => us.skillId?._id?.toString() || us.skillId?.toString());

    // Find skills user doesn't have yet, optionally filtered by specialty
    const recommendedSkills = availableSkills.filter(
      skill => !userSkillIds.includes(skill._id.toString())
    );

    // Get courses relevant to user's specialty
    const courseFilter = { healthcareSpecialty: userSpecialty };
    const recommendedCourses = await Course.find(courseFilter).limit(10);

    // Get career paths relevant to user's specialty
    const careerPathFilter = { healthcareSpecialty: userSpecialty };
    const recommendedCareerPaths = await CareerPath.find(careerPathFilter)
      .populate('requiredSkills.skillId', 'name category healthcareContext')
      .limit(10);

    // Skills to improve (user has but low proficiency)
    const skillsToImprove = userSkills
      .filter(us => us.proficiency && (us.proficiency.score < 50 || us.proficiency.level === 'beginner'))
      .map(us => ({
        userSkill: us,
        skill: us.skillId,
        currentLevel: us.proficiency.level,
        currentScore: us.proficiency.score,
      }));

    res.json({
      userId,
      userSpecialty,
      recommendations: {
        newSkills: recommendedSkills.slice(0, 10),
        skillsToImprove: skillsToImprove.slice(0, 10),
        courses: recommendedCourses,
        careerPaths: recommendedCareerPaths,
      },
      stats: {
        totalSkills: userSkills.length,
        newSkillsCount: recommendedSkills.length,
        skillsToImproveCount: skillsToImprove.length,
        coursesCount: recommendedCourses.length,
        careerPathsCount: recommendedCareerPaths.length,
      },
    });
  } catch (error) {
    console.error('Get user recommendations error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/recommendations/specialty/:specialty
// @desc    Get recommendations by healthcare specialty
// @access  Public
const getSpecialtyRecommendations = async (req, res) => {
  try {
    const { specialty } = req.params;

    // Get top skills (all healthcare now, optionally filter by specialty context)
    const topSkills = await Skill.find({}).limit(20);

    // Get courses for this specialty
    const courses = await Course.find({ healthcareSpecialty: specialty }).limit(20);

    // Get career paths for this specialty
    const careerPaths = await CareerPath.find({ healthcareSpecialty: specialty })
      .populate('requiredSkills.skillId', 'name category healthcareContext')
      .limit(20);

    res.json({
      specialty,
      recommendations: {
        skills: topSkills,
        courses,
        careerPaths,
      },
      stats: {
        skillsCount: topSkills.length,
        coursesCount: courses.length,
        careerPathsCount: careerPaths.length,
      },
    });
  } catch (error) {
    console.error('Get specialty recommendations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/recommendations/filter
// @desc    Filter recommendations by criteria
// @access  Public
const filterRecommendations = async (req, res) => {
  try {
    const { userId, categories, specialty, minScore, maxScore, skillLevel } = req.body;

    // Build filter for skills
    const skillFilter = {};
    if (categories && categories.length > 0) {
      skillFilter.category = { $in: categories };
    }

    // Get all skills matching filter
    const skills = await Skill.find(skillFilter);

    // Get courses with filters
    const courseFilter = {};
    if (specialty) {
      courseFilter.healthcareSpecialty = specialty;
    }
    const courses = await Course.find(courseFilter).limit(20);

    // Get career paths with filters
    const careerPathFilter = {};
    if (specialty) {
      careerPathFilter.healthcareSpecialty = specialty;
    }
    const careerPaths = await CareerPath.find(careerPathFilter)
      .populate('requiredSkills.skillId', 'name category healthcareContext')
      .limit(20);

    // If userId provided, apply user-specific filtering
    let filteredSkills = skills;
    if (userId) {
      const userSkills = await UserSkill.find({ userId });
      const userSkillIds = userSkills.map(us => us.skillId?.toString());
      
      // If score/level filters are provided, show user's skills that match those criteria
      // Otherwise, exclude skills user already has (recommend new skills)
      if (minScore !== undefined || maxScore !== undefined || skillLevel) {
        const relevantUserSkills = userSkills.filter(us => {
          let matches = true;
          if (minScore !== undefined && us.proficiency?.score < minScore) matches = false;
          if (maxScore !== undefined && us.proficiency?.score > maxScore) matches = false;
          if (skillLevel && us.proficiency?.level !== skillLevel) matches = false;
          return matches;
        });

        const relevantSkillIds = relevantUserSkills.map(us => us.skillId?.toString());
        filteredSkills = skills.filter(skill => relevantSkillIds.includes(skill._id.toString()));
      } else {
        // No score/level filters: recommend new skills user doesn't have
        filteredSkills = skills.filter(skill => !userSkillIds.includes(skill._id.toString()));
      }
    }

    res.json({
      filters: { categories, specialty, minScore, maxScore, skillLevel },
      recommendations: {
        skills: filteredSkills.slice(0, 20),
        courses,
        careerPaths,
      },
      stats: {
        skillsCount: filteredSkills.length,
        coursesCount: courses.length,
        careerPathsCount: careerPaths.length,
      },
    });
  } catch (error) {
    console.error('Filter recommendations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserRecommendations,
  getSpecialtyRecommendations,
  filterRecommendations,
};
