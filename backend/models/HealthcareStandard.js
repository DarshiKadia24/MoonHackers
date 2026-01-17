const mongoose = require('mongoose');

const healthcareStandardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Standard name is required'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ['HIPAA Compliance', 'FDA Regulations', 'Clinical Trials', 'Data Standards', 'Quality Assurance'],
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      enum: ['Basic', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Basic',
    },
    requirements: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
      },
    ],
    relatedSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ['Documentation', 'Training', 'Certification', 'Guideline'],
        },
      },
    ],
    // Regulatory context
    regulatoryBody: {
      type: String,
      trim: true, // e.g., "HHS", "FDA", "CMS"
    },
    effectiveDate: {
      type: Date,
    },
    lastUpdated: {
      type: Date,
    },
    mandatoryCompliance: {
      type: Boolean,
      default: false,
    },
    // Compliance verification
    verificationMethod: {
      type: String,
      trim: true,
    },
    auditFrequency: {
      type: String,
      enum: ['Annual', 'Bi-Annual', 'Quarterly', 'Monthly', 'As Needed'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
healthcareStandardSchema.index({ category: 1 });
healthcareStandardSchema.index({ level: 1 });

const HealthcareStandard = mongoose.model('HealthcareStandard', healthcareStandardSchema);

module.exports = HealthcareStandard;
