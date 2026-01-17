const mongoose = require('mongoose');

const learningActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    activityType: {
      type: String,
      enum: ['Course', 'Tutorial', 'Workshop', 'Conference', 'Reading', 'Practice', 'Project', 'Certification', 'Webinar', 'Other'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Source/platform
    source: {
      type: String,
      trim: true, // e.g., "Coursera", "edX", "YouTube", "Self-study"
    },
    // Time tracking
    dateStarted: {
      type: Date,
      default: Date.now,
    },
    dateCompleted: {
      type: Date,
    },
    timeSpent: {
      hours: {
        type: Number,
        default: 0,
      },
      minutes: {
        type: Number,
        default: 0,
      },
    },
    // Progress
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Paused', 'Dropped'],
      default: 'Not Started',
    },
    // Skills learned
    skillsLearned: [
      {
        skillId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill',
        },
        proficiencyGained: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        },
      },
    ],
    // Healthcare relevance
    healthcareRelevance: {
      type: String,
      enum: ['High', 'Medium', 'Low', 'None'],
      default: 'Medium',
    },
    // Resources
    resources: [
      {
        type: {
          type: String,
          enum: ['Video', 'Article', 'Documentation', 'Code', 'Certificate', 'Other'],
        },
        url: String,
        title: String,
      },
    ],
    // Notes and reflection
    notes: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    // Link to related entities
    relatedCourseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    relatedProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    // Healthcare-specific learning context
    healthcareDomain: {
      type: String,
      enum: ['Health Informatics', 'Medical Devices', 'Telemedicine', 'Clinical Data', 'Healthcare Cybersecurity', 'EHR Systems', 'Regulatory Compliance', 'Other'],
    },
    complianceRelated: {
      isComplianceTraining: {
        type: Boolean,
        default: false,
      },
      relatedStandards: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'HealthcareStandard',
        },
      ],
      certificateEarned: {
        type: Boolean,
        default: false,
      },
      certificateUrl: String,
    },
    clinicalContext: {
      involvesPatientData: {
        type: Boolean,
        default: false,
      },
      clinicalApplication: String,
      medicalSpecialty: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
learningActivitySchema.index({ userId: 1 });
learningActivitySchema.index({ activityType: 1 });
learningActivitySchema.index({ status: 1 });
learningActivitySchema.index({ dateStarted: -1 });
learningActivitySchema.index({ healthcareDomain: 1 });
learningActivitySchema.index({ healthcareRelevance: 1 });

// Method to calculate total learning time
learningActivitySchema.methods.getTotalTime = function () {
  return (this.timeSpent?.hours || 0) + ((this.timeSpent?.minutes || 0) / 60);
};

const LearningActivity = mongoose.model('LearningActivity', learningActivitySchema);

module.exports = LearningActivity;
