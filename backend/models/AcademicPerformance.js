const mongoose = require('mongoose');

const academicPerformanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    // Overall academic metrics
    cumulativeGPA: {
      type: Number,
      min: 0,
      max: 4.0,
    },
    currentGPA: {
      type: Number,
      min: 0,
      max: 4.0,
    },
    totalCredits: {
      type: Number,
      default: 0,
    },
    completedCredits: {
      type: Number,
      default: 0,
    },
    // Course records
    courses: [
      {
        courseCode: {
          type: String,
          required: true,
          trim: true,
        },
        courseName: {
          type: String,
          required: true,
          trim: true,
        },
        institution: {
          type: String,
          required: true,
          trim: true,
        },
        semester: {
          type: String,
          trim: true, // e.g., "Fall 2023", "Spring 2024"
        },
        year: {
          type: Number,
        },
        credits: {
          type: Number,
          default: 3,
        },
        grade: {
          type: String,
          enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'P', 'NP', 'I', 'W'],
        },
        gradePoints: {
          type: Number,
          min: 0,
          max: 4.0,
        },
        healthcareRelevance: {
          type: String,
          enum: ['High', 'Medium', 'Low', 'None'],
          default: 'Medium',
        },
        skillsGained: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
          },
        ],
      },
    ],
    // Academic achievements
    achievements: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        type: {
          type: String,
          enum: ['Honor Roll', 'Dean\'s List', 'Scholarship', 'Award', 'Recognition', 'Other'],
        },
        institution: {
          type: String,
          trim: true,
        },
      },
    ],
    // Healthcare-focused academic tracking
    healthcareCoursework: {
      totalHealthcareCredits: {
        type: Number,
        default: 0,
      },
      healthcareGPA: {
        type: Number,
        min: 0,
        max: 4.0,
      },
      clinicalHours: {
        type: Number,
        default: 0,
      },
      researchProjects: [
        {
          title: String,
          description: String,
          healthcareRelevance: String,
          startDate: Date,
          endDate: Date,
        },
      ],
    },
    // Healthcare certifications earned through coursework
    academicCertifications: [
      {
        name: String,
        issuer: String,
        courseCode: String,
        dateEarned: Date,
        expiryDate: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
academicPerformanceSchema.index({ userId: 1 });
academicPerformanceSchema.index({ 'courses.healthcareRelevance': 1 });

// Method to calculate GPA
academicPerformanceSchema.methods.calculateGPA = function () {
  if (!this.courses || this.courses.length === 0) {
    return { cumulativeGPA: 0, currentGPA: 0 };
  }

  const gradePointMap = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0,
  };

  let totalPoints = 0;
  let totalCredits = 0;

  this.courses.forEach(course => {
    if (course.grade && gradePointMap[course.grade] !== undefined && course.credits) {
      totalPoints += gradePointMap[course.grade] * course.credits;
      totalCredits += course.credits;
    }
  });

  const cumulativeGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

  // Calculate current GPA (last 2 semesters or last year)
  const currentYear = new Date().getFullYear();
  const recentCourses = this.courses.filter(course => {
    return course.year && course.year >= currentYear - 1;
  });

  let currentPoints = 0;
  let currentCredits = 0;
  recentCourses.forEach(course => {
    if (course.grade && gradePointMap[course.grade] !== undefined && course.credits) {
      currentPoints += gradePointMap[course.grade] * course.credits;
      currentCredits += course.credits;
    }
  });

  const currentGPA = currentCredits > 0 ? currentPoints / currentCredits : cumulativeGPA;

  return { cumulativeGPA: parseFloat(cumulativeGPA.toFixed(2)), currentGPA: parseFloat(currentGPA.toFixed(2)) };
};

const AcademicPerformance = mongoose.model('AcademicPerformance', academicPerformanceSchema);

module.exports = AcademicPerformance;
