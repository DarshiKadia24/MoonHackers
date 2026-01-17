const mongoose = require('mongoose');

const medicalRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Clinical Informatics', 'Data Analytics', 'Medical Devices', 'Telemedicine', 'Cybersecurity', 'Administration'],
      required: true,
    },
    requiredSkills: [
      {
        skillId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill',
          required: true,
        },
        proficiencyLevel: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          required: true,
        },
        isCore: {
          type: Boolean,
          default: false,
        },
      },
    ],
    salaryRange: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    educationRequirements: [
      {
        level: {
          type: String,
          enum: ['Certificate', 'Associate', 'Bachelor', 'Master', 'Doctorate'],
        },
        field: String,
        required: Boolean,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        required: Boolean,
      },
    ],
    careerPath: [
      {
        stage: String,
        description: String,
        typicalDuration: String,
      },
    ],
    // Healthcare-specific requirements
    complianceRequirements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthcareStandard',
      },
    ],
    patientInteractionLevel: {
      type: String,
      enum: ['None', 'Minimal', 'Moderate', 'Frequent', 'Constant'],
      default: 'None',
    },
    clinicalEnvironment: {
      type: Boolean,
      default: false,
    },
    requiredLicenses: [
      {
        name: String,
        state: String,
        required: Boolean,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
medicalRoleSchema.index({ category: 1 });
// Note: title field already has unique index from schema definition

const MedicalRole = mongoose.model('MedicalRole', medicalRoleSchema);

module.exports = MedicalRole;
