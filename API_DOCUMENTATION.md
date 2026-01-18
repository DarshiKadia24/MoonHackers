# API Documentation - Healthcare Skill Intelligence Platform

## Base URL
```
http://localhost:5001/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "healthcareSpecialization": "Health Informatics",
  "healthcareCareerGoal": "Healthcare Data Analyst"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### Get Current User
```http
GET /auth/me
```

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "healthcareSpecialization": "Health Informatics",
    "healthcareCareerGoal": "Healthcare Data Analyst"
  }
}
```

---

## Skills Endpoints

### Get All Skills
```http
GET /skills?category=Clinical&specialty=Health Informatics
```

**Query Parameters:**
- `category` (optional): Filter by category (Clinical, Technical, Regulatory, Analytical, Soft Skills)
- `specialty` (optional): Filter by healthcare specialty
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "skills": [
    {
      "id": "skill-id",
      "name": "HIPAA Compliance",
      "description": "Understanding and implementing HIPAA regulations",
      "category": "Regulatory",
      "healthcareContext": {
        "specialty": "Health Informatics",
        "importance": 10,
        "clinicalRelevance": "Critical",
        "patientImpact": "Life-Critical"
      }
    }
  ],
  "count": 50
}
```

---

### Get Skill by ID
```http
GET /skills/:id
```

**Response:**
```json
{
  "success": true,
  "skill": {
    "id": "skill-id",
    "name": "HIPAA Compliance",
    "description": "Understanding and implementing HIPAA regulations",
    "category": "Regulatory"
  }
}
```

---

### Create Skill
```http
POST /skills
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "HL7 FHIR",
  "description": "Fast Healthcare Interoperability Resources standard",
  "category": "Technical",
  "healthcareContext": {
    "specialty": "Health Informatics",
    "importance": 9,
    "clinicalRelevance": "High",
    "patientImpact": "Direct"
  }
}
```

---

## User Skills Endpoints

### Get User Skills
```http
GET /user-skills?userId=user-id
```

**Query Parameters:**
- `userId`: User ID to filter by
- `skillId` (optional): Filter by skill ID

**Response:**
```json
{
  "success": true,
  "userSkills": [
    {
      "id": "user-skill-id",
      "userId": "user-id",
      "skillId": "skill-id",
      "proficiency": {
        "level": "Resident",
        "score": 75
      },
      "evidence": [],
      "goal": {
        "targetLevel": "Specialist",
        "targetDate": "2024-12-31"
      }
    }
  ]
}
```

---

### Rate/Update User Skill
```http
POST /user-skills
PUT /user-skills/:id
```

**Request Body:**
```json
{
  "userId": "user-id",
  "skillId": "skill-id",
  "proficiency": {
    "level": "Resident",
    "score": 75
  },
  "evidence": [
    {
      "type": "certification",
      "itemId": "cert-id",
      "date": "2024-01-15"
    }
  ]
}
```

---

## Gap Analysis Endpoints

### Analyze Skill Gaps
```http
POST /analysis/gap
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "userId": "user-id",
  "targetRole": "Healthcare Data Analyst",
  "targetSpecialty": "Health Informatics"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "readinessScore": 65,
    "gaps": [
      {
        "skillId": "skill-id",
        "skillName": "HIPAA Compliance",
        "currentLevel": "Intern",
        "requiredLevel": "Specialist",
        "gap": 2,
        "gapSeverity": "High",
        "importance": 10,
        "estimatedLearningTime": 120
      }
    ],
    "categorizedGaps": {
      "Clinical": [...],
      "Technical": [...],
      "Regulatory": [...]
    },
    "criticalGaps": [...],
    "quickWins": [...],
    "focusAreas": [...]
  }
}
```

---

### Get Course Recommendations
```http
POST /analysis/recommendations
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "userId": "user-id",
  "targetRole": "Healthcare Data Analyst",
  "targetSpecialty": "Health Informatics",
  "learningStyle": "balanced",
  "timeAvailable": 10
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "courseId": "course-id",
      "courseTitle": "HIPAA Compliance Masterclass",
      "matchScore": 95,
      "gapsCovered": ["HIPAA Compliance", "Privacy Regulations"],
      "whyRecommended": "Addresses critical gap in HIPAA Compliance",
      "learningPath": {
        "phases": [
          {
            "name": "Foundation",
            "duration": 2,
            "courses": [...]
          }
        ]
      }
    }
  ]
}
```

---

### Generate Learning Path
```http
POST /analysis/learning-path
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "userId": "user-id",
  "targetRole": "Healthcare Data Analyst",
  "targetSpecialty": "Health Informatics",
  "pace": "balanced"
}
```

**Response:**
```json
{
  "success": true,
  "learningPath": {
    "totalDuration": 24,
    "phases": [
      {
        "name": "Foundation Phase",
        "duration": 8,
        "skills": [...],
        "courses": [...],
        "estimatedCompletionDate": "2024-09-01"
      }
    ],
    "milestones": [
      {
        "week": 4,
        "title": "Foundation Complete",
        "criteria": ["Complete 3 courses", "Pass 2 assessments"]
      }
    ],
    "weeklyBreakdown": [...]
  }
}
```

---

## GitHub API Integration Endpoints

### Search GitHub Projects
```http
GET /github/projects?query=healthcare+ehr&per_page=10
```

**Query Parameters:**
- `query`: Search query for GitHub repositories
- `per_page` (optional): Number of results per page (default: 10, max: 30)
- `page` (optional): Page number

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": 12345,
      "name": "healthcare-ehr-system",
      "full_name": "user/healthcare-ehr-system",
      "description": "Open source EHR system",
      "url": "https://github.com/user/healthcare-ehr-system",
      "stars": 1250,
      "language": "JavaScript",
      "topics": ["healthcare", "ehr", "fhir"]
    }
  ],
  "total_count": 1234
}
```

---

### Get Project Recommendations Based on Skills
```http
POST /github/recommendations
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "userId": "user-id",
  "targetRole": "Healthcare Data Analyst"
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "skillName": "HIPAA Compliance",
      "projects": [
        {
          "id": 12345,
          "name": "hipaa-compliance-toolkit",
          "description": "HIPAA compliance tools and templates",
          "url": "https://github.com/user/hipaa-compliance-toolkit",
          "stars": 890,
          "matchScore": 95,
          "healthcareRelevance": "High"
        }
      ]
    }
  ]
}
```

---

## Academic Performance Endpoints

### Get Academic Performance
```http
GET /academic/:userId
```

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user-id",
    "cumulativeGPA": 3.75,
    "currentGPA": 3.85,
    "totalCredits": 120,
    "courses": [
      {
        "courseCode": "CS101",
        "courseName": "Introduction to Computer Science",
        "credits": 3,
        "grade": "A",
        "semester": "Fall 2023",
        "healthcareRelevance": "Low"
      }
    ],
    "healthcareCoursework": {
      "totalHealthcareCredits": 45,
      "healthcareGPA": 3.9,
      "clinicalHours": 120,
      "researchProjects": 2
    }
  }
}
```

---

### Create/Update Academic Performance
```http
POST /academic
PUT /academic/:id
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "userId": "user-id",
  "cumulativeGPA": 3.75,
  "courses": [
    {
      "courseCode": "HI201",
      "courseName": "Healthcare Informatics",
      "credits": 3,
      "grade": "A",
      "semester": "Spring 2024",
      "healthcareRelevance": "High"
    }
  ],
  "healthcareCoursework": {
    "clinicalHours": 120
  }
}
```

---

## Projects Endpoints

### Get User Projects
```http
GET /projects/:userId?limit=10&skip=0
```

**Query Parameters:**
- `limit` (optional): Number of projects to return
- `skip` (optional): Number of projects to skip for pagination

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": "project-id",
      "userId": "user-id",
      "title": "EHR Integration System",
      "description": "FHIR-compliant EHR integration",
      "status": "completed",
      "healthcareDomain": "Health Informatics",
      "healthcareCompliance": {
        "hipaaCompliant": true,
        "fdaRegulated": false
      },
      "patientImpact": {
        "impactLevel": "Direct",
        "estimatedPatientsAffected": 5000
      }
    }
  ],
  "count": 5
}
```

---

### Create Project
```http
POST /projects
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "userId": "user-id",
  "title": "Telemedicine Platform",
  "description": "HIPAA-compliant telemedicine solution",
  "status": "in-progress",
  "healthcareDomain": "Telemedicine",
  "healthcareCompliance": {
    "hipaaCompliant": true,
    "fdaRegulated": false,
    "complianceNotes": "Follows HIPAA privacy and security rules"
  },
  "patientImpact": {
    "impactLevel": "Direct",
    "estimatedPatientsAffected": 10000
  },
  "skillsUsed": [
    {
      "skillId": "skill-id",
      "proficiencyLevel": "Resident"
    }
  ]
}
```

---

## Learning Activities Endpoints

### Get User Learning Activities
```http
GET /learning-activities/:userId?limit=10
```

**Response:**
```json
{
  "success": true,
  "activities": [
    {
      "id": "activity-id",
      "userId": "user-id",
      "activityType": "course",
      "title": "HIPAA Privacy Training",
      "status": "completed",
      "timeSpent": 10,
      "healthcareDomain": "Healthcare Cybersecurity",
      "complianceRelated": {
        "isComplianceTraining": true,
        "certificateEarned": true,
        "certificateUrl": "https://..."
      }
    }
  ],
  "totalHours": 120
}
```

---

### Create Learning Activity
```http
POST /learning-activities
```

**Headers:** Requires authentication

**Request Body:**
```json
{
  "userId": "user-id",
  "activityType": "workshop",
  "title": "Clinical Data Analysis Workshop",
  "status": "in-progress",
  "timeSpent": 5,
  "healthcareDomain": "Health Informatics",
  "healthcareRelevance": "High",
  "clinicalContext": {
    "involvesPatientData": true,
    "medicalSpecialty": "Cardiology"
  }
}
```

---

## Career Paths Endpoints

### Get All Career Paths
```http
GET /career-paths?specialty=Health Informatics
```

**Query Parameters:**
- `specialty` (optional): Filter by healthcare specialty

**Response:**
```json
{
  "success": true,
  "careerPaths": [
    {
      "id": "career-path-id",
      "title": "Healthcare Data Analyst",
      "description": "Analyze healthcare data for insights",
      "healthcareSpecialty": "Health Informatics",
      "requiredSkills": [
        {
          "skillId": "skill-id",
          "skillName": "Clinical Data Analysis",
          "requiredLevel": "Specialist",
          "importance": 9
        }
      ],
      "salaryRange": {
        "min": 70000,
        "max": 110000
      }
    }
  ]
}
```

---

## Progress Endpoints

### Get User Progress
```http
GET /progress/:userId
```

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "progress": {
    "overall": 65,
    "skillsByCategory": {
      "Clinical": 70,
      "Technical": 60,
      "Regulatory": 65
    },
    "skillsBySpecialty": {
      "Health Informatics": 70
    },
    "averageScore": 65,
    "timeline": [
      {
        "date": "2024-01-15",
        "score": 60
      }
    ]
  }
}
```

---

## Recommendations Endpoints

### Get User Recommendations
```http
GET /recommendations/:userId
```

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "recommendations": {
    "skillsToImprove": [
      {
        "skillId": "skill-id",
        "skillName": "HIPAA Compliance",
        "currentLevel": "Intern",
        "recommendedLevel": "Specialist",
        "priority": "High"
      }
    ],
    "recommendedCourses": [
      {
        "courseId": "course-id",
        "title": "HIPAA Compliance Masterclass",
        "matchScore": 95
      }
    ],
    "careerPaths": [
      {
        "careerPathId": "career-path-id",
        "title": "Healthcare Data Analyst",
        "readinessScore": 65
      }
    ]
  }
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP Status Codes:
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or token invalid
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Rate Limiting

- GitHub API endpoints: Limited by GitHub's rate limits (60 requests/hour for unauthenticated, 5000/hour for authenticated)
- All other endpoints: No rate limiting currently implemented

---

## Notes

1. All dates should be in ISO 8601 format (e.g., "2024-01-15T10:30:00Z")
2. Pagination is available on list endpoints using `page` and `limit` query parameters
3. JWT tokens expire after 30 days by default
4. All request bodies should be sent as JSON with `Content-Type: application/json` header
5. User IDs can be in MongoDB ObjectId format or string format - the system normalizes them automatically

---

## Demo Users

The seed script creates three demo accounts:

| Email | Password | Specialization |
|-------|----------|---------------|
| health@demo.com | demo123 | Health Informatics |
| clinical@demo.com | demo123 | Clinical Data |
| cyber@demo.com | demo123 | Healthcare Cybersecurity |

---

For more information, see the [README.md](../README.md) and [MODELS_DOCUMENTATION.md](MODELS_DOCUMENTATION.md) files.
