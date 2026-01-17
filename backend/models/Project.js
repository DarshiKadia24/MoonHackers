const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    projectType: {
      type: String,
      enum: ['Academic', 'Personal', 'Professional', 'Open Source', 'Research', 'Hackathon', 'Other'],
      default: 'Personal',
    },
    // Healthcare relevance
    healthcareDomain: {
      type: String,
      enum: ['Health Informatics', 'Medical Devices', 'Telemedicine', 'Clinical Data', 'Healthcare Cybersecurity', 'EHR Systems', 'Other'],
    },
    // Project timeline
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
      default: 'In Progress',
    },
    // Skills demonstrated
    skillsUsed: [
      {
        skillId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill',
        },
        proficiencyDemonstrated: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        },
      },
    ],
    // Project details
    technologies: [String],
    repositoryUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    // Outcomes and impact
    outcomes: [
      {
        description: String,
        metric: String, // e.g., "Reduced processing time by 30%"
        date: Date,
      },
    ],
    // Evidence
    evidence: [
      {
        type: {
          type: String,
          enum: ['Screenshot', 'Video', 'Documentation', 'Certificate', 'Code Repository', 'Demo Link', 'Other'],
        },
        url: String,
        description: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Collaboration
    teamMembers: [
      {
        name: String,
        role: String,
        contribution: String,
      },
    ],
    // Learning outcomes
    learningOutcomes: [String],
    // Healthcare-specific compliance and impact tracking
    healthcareCompliance: {
      hipaaCompliant: {
        type: Boolean,
        default: false,
      },
      fdaRegulated: {
        type: Boolean,
        default: false,
      },
      clinicalTrialCompliant: {
        type: Boolean,
        default: false,
      },
      complianceNotes: {
        type: String,
        trim: true,
      },
    },
    patientImpact: {
      impactLevel: {
        type: String,
        enum: ['None', 'Indirect', 'Moderate', 'Direct', 'Life-Critical'],
        default: 'None',
      },
      impactDescription: {
        type: String,
        trim: true,
      },
      estimatedPatientsAffected: {
        type: Number,
        min: 0,
      },
    },
    regulatoryCompliance: {
      standardsFollowed: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'HealthcareStandard',
        },
      ],
      complianceLevel: {
        type: String,
        enum: ['Not Applicable', 'Basic', 'Intermediate', 'Advanced', 'Full Compliance'],
        default: 'Not Applicable',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
projectSchema.index({ userId: 1 });
projectSchema.index({ healthcareDomain: 1 });
projectSchema.index({ status: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
