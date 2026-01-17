# MongoDB Models Documentation

## Overview
This document describes the MongoDB models for the Healthcare Skill Intelligence Platform MVP, with comprehensive healthcare-specific fields for tracking academic performance, projects, learning activities, compliance standards, and medical roles.

## Models

### 1. AcademicPerformance Model (`models/AcademicPerformance.js`)

**Purpose**: Track student academic progression with healthcare context

**Key Features**:
- GPA tracking (cumulative and current)
- Course records with grades and credits
- Academic achievements
- **Healthcare-specific fields**:
  - `healthcareCoursework.totalHealthcareCredits`: Total credits in healthcare courses
  - `healthcareCoursework.healthcareGPA`: GPA specific to healthcare courses
  - `healthcareCoursework.clinicalHours`: Clinical practice hours
  - `healthcareCoursework.researchProjects`: Healthcare research projects
  - `academicCertifications`: Certifications earned through coursework
  - Course-level `healthcareRelevance` tracking (High/Medium/Low/None)

**Relationships**:
- References `User` model via `userId`
- References `Skill` model via `courses.skillsGained`

**Methods**:
- `calculateGPA()`: Calculates cumulative and current GPA

---

### 2. Project Model (`models/Project.js`)

**Purpose**: Record real-world healthcare project experience

**Key Features**:
- Project tracking with timeline and status
- Skills demonstration and proficiency levels
- Team collaboration tracking
- **Healthcare-specific fields**:
  - `healthcareDomain`: Domain categorization (Health Informatics, Medical Devices, etc.)
  - `healthcareCompliance`:
    - `hipaaCompliant`: HIPAA compliance status
    - `fdaRegulated`: FDA regulation status
    - `clinicalTrialCompliant`: Clinical trial compliance
    - `complianceNotes`: Additional compliance documentation
  - `patientImpact`:
    - `impactLevel`: None, Indirect, Moderate, Direct, Life-Critical
    - `impactDescription`: Description of patient impact
    - `estimatedPatientsAffected`: Number of patients affected
  - `regulatoryCompliance`:
    - `standardsFollowed`: References to HealthcareStandard models
    - `complianceLevel`: Not Applicable to Full Compliance

**Relationships**:
- References `User` model via `userId`
- References `Skill` model via `skillsUsed.skillId`
- References `HealthcareStandard` model via `regulatoryCompliance.standardsFollowed`

---

### 3. LearningActivity Model (`models/LearningActivity.js`)

**Purpose**: Capture continuous learning activities with healthcare context

**Key Features**:
- Activity tracking (courses, tutorials, workshops, etc.)
- Time tracking and progress monitoring
- Skills learned tracking
- **Healthcare-specific fields**:
  - `healthcareDomain`: Domain categorization
  - `healthcareRelevance`: High/Medium/Low/None
  - `complianceRelated`:
    - `isComplianceTraining`: Boolean flag
    - `relatedStandards`: References to HealthcareStandard models
    - `certificateEarned`: Certification status
    - `certificateUrl`: Certificate URL
  - `clinicalContext`:
    - `involvesPatientData`: Whether activity involves patient data
    - `clinicalApplication`: Clinical application description
    - `medicalSpecialty`: Related medical specialty

**Relationships**:
- References `User` model via `userId`
- References `Skill` model via `skillsLearned.skillId`
- References `Course` model via `relatedCourseId`
- References `Project` model via `relatedProjectId`
- References `HealthcareStandard` model via `complianceRelated.relatedStandards`

**Methods**:
- `getTotalTime()`: Calculates total learning time in hours

---

### 4. HealthcareStandard Model (`models/HealthcareStandard.js`)

**Purpose**: Define healthcare compliance standards (HIPAA, FDA, etc.)

**Key Features**:
- Standard categorization (HIPAA Compliance, FDA Regulations, Clinical Trials, etc.)
- Difficulty levels (Basic, Intermediate, Advanced, Expert)
- Requirements and resources
- **Regulatory context fields**:
  - `regulatoryBody`: Regulatory authority (HHS, FDA, CMS)
  - `effectiveDate`: When standard became effective
  - `lastUpdated`: Last update date
  - `mandatoryCompliance`: Whether compliance is mandatory
  - `verificationMethod`: How compliance is verified
  - `auditFrequency`: How often audits occur (Annual, Quarterly, etc.)

**Relationships**:
- References `Skill` model via `relatedSkills`

**Indexes**:
- Category index for filtering by standard type
- Level index for filtering by difficulty

---

### 5. MedicalRole Model (`models/MedicalRole.js`)

**Purpose**: Define medical role requirements with skill frameworks

**Key Features**:
- Role categorization (Clinical Informatics, Data Analytics, Medical Devices, etc.)
- Required skills with proficiency levels
- Education and certification requirements
- Salary ranges and career paths
- **Healthcare-specific fields**:
  - `complianceRequirements`: References to required HealthcareStandard models
  - `patientInteractionLevel`: None, Minimal, Moderate, Frequent, Constant
  - `clinicalEnvironment`: Boolean for clinical setting requirement
  - `requiredLicenses`: State-specific license requirements

**Relationships**:
- References `Skill` model via `requiredSkills.skillId`
- References `HealthcareStandard` model via `complianceRequirements`

**Indexes**:
- Category index for filtering by role type
- Title has unique index (from schema definition)

---

## Common Features Across All Models

### Timestamps
All models include automatic `createdAt` and `updatedAt` timestamps via Mongoose.

### Validation
- Required field validation
- Enum validation for categorical fields
- Min/max validation for numeric fields
- Custom validation messages

### Indexes
All models have strategic indexes for efficient querying:
- User ID indexes for user-specific queries
- Healthcare-related field indexes for filtering
- Status/category indexes for common filters

### Relationships
Models are interconnected through references:
- All user-data models reference the `User` model
- Skills are referenced across multiple models
- `HealthcareStandard` is referenced by Project, LearningActivity, and MedicalRole

## Usage in Routes

All models are used in their respective route controllers:
- `/api/academic` - AcademicPerformance operations
- `/api/projects` - Project CRUD operations
- `/api/learning-activities` - LearningActivity tracking
- Healthcare standards and medical roles available for reference and filtering

## MVP Requirements Met

✅ **Academic Performance Tracking**: Comprehensive GPA and course tracking with healthcare context
✅ **Project Experience**: Full project tracking with HIPAA compliance and patient impact
✅ **Continuous Learning**: Detailed learning activity tracking with clinical context
✅ **Healthcare Standards**: Compliance standards including HIPAA, FDA regulations
✅ **Medical Roles**: Role definitions with skill requirements and compliance needs
✅ **Healthcare Context**: All models include healthcare-specific attributes
✅ **Validation & Indexes**: Proper schema validation and query optimization
✅ **Relationships**: Proper relationships to User, Skill, and between models
✅ **Timestamps**: All models track creation and update times

## Example Use Cases

### Tracking HIPAA-Compliant Project
```javascript
{
  title: "EHR Data Encryption System",
  healthcareDomain: "EHR Systems",
  healthcareCompliance: {
    hipaaCompliant: true,
    complianceNotes: "Implements AES-256 encryption for PHI"
  },
  patientImpact: {
    impactLevel: "Direct",
    impactDescription: "Protects patient health information",
    estimatedPatientsAffected: 10000
  }
}
```

### Recording Clinical Learning Activity
```javascript
{
  title: "HIPAA Privacy Rule Training",
  activityType: "Certification",
  healthcareDomain: "Regulatory Compliance",
  complianceRelated: {
    isComplianceTraining: true,
    certificateEarned: true
  },
  clinicalContext: {
    involvesPatientData: true,
    clinicalApplication: "Patient data handling procedures"
  }
}
```
