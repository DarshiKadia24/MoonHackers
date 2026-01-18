# Quick Setup Guide - Healthcare Skill Intelligence Platform

This guide will help you quickly set up and run the Healthcare Skill Intelligence Platform locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment

```bash
# Navigate to backend directory
cd backend

# Copy the example environment file
cp .env.example .env

# Edit .env file with your settings (optional - defaults work for local development)
```

**Default Configuration** (`.env`):
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/skill-intelligence
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Windows
# Start MongoDB as a Windows service or run mongod.exe

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGO_URI` in `.env` with your Atlas connection string

### Step 4: Seed the Database

```bash
# In backend directory
cd backend
node seed.js
```

This creates:
- 50+ healthcare-specific skills
- 30+ healthcare courses
- 20+ healthcare career paths
- 3 demo user accounts (see below)

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

### Step 6: Login with Demo Account

Open `http://localhost:3000` in your browser and login with:

| Email | Password | Specialization |
|-------|----------|---------------|
| health@demo.com | demo123 | Health Informatics |
| clinical@demo.com | demo123 | Clinical Data |
| cyber@demo.com | demo123 | Healthcare Cybersecurity |

## What's Included

The platform comes pre-loaded with:

### Skills (50+)
- **Clinical Skills**: EHR Systems, Clinical Workflows, Patient Care Coordination
- **Technical Skills**: FHIR, HL7, Healthcare Databases, Medical Imaging
- **Regulatory Skills**: HIPAA Compliance, FDA Regulations, Clinical Trials
- **Analytical Skills**: Healthcare Analytics, Clinical Data Analysis, Outcomes Research
- **Soft Skills**: Healthcare Communication, Teamwork, Documentation

### Courses (30+)
- HIPAA Compliance courses
- Clinical data analysis training
- Healthcare IT certifications
- Medical device regulations
- Telemedicine implementation

### Career Paths (20+)
- Healthcare Data Analyst
- Clinical Informatics Specialist
- Medical Device Engineer
- Healthcare Cybersecurity Analyst
- Telemedicine Coordinator
- And more...

## Testing the Platform

### 1. Assess Your Skills
- Navigate to **Skills Assessment**
- Rate your proficiency in various healthcare skills
- Add evidence (certifications, projects)

### 2. View Gap Analysis
- Go to **Gap Analysis**
- Select a target career role
- See your skill gaps with severity indicators
- Get estimated learning times

### 3. Get Course Recommendations
- Visit **Courses** page
- View personalized course recommendations
- Filter by gap severity (Critical, High, Medium, Low)
- See learning paths for each skill

### 4. Explore Career Paths
- Check out **Career Paths**
- Interactive hospital floor plan visualization
- See required skills and salary ranges
- View your readiness score for each path

### 5. Add Your Data
- Update your **Profile**
- Add academic performance (GPA, courses)
- Add project experience
- Track learning activities

## API Testing

The backend API runs on `http://localhost:5001/api`

### Example API Calls:

**Get all skills:**
```bash
curl http://localhost:5001/api/skills
```

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"health@demo.com","password":"demo123"}'
```

**Get gap analysis (requires auth token):**
```bash
curl -X POST http://localhost:5001/api/analysis/gap \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"userId":"USER_ID","targetRole":"Healthcare Data Analyst"}'
```

For complete API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## Troubleshooting

### MongoDB Connection Error
- **Issue**: `MongooseServerSelectionError: connect ECONNREFUSED`
- **Solution**: Ensure MongoDB is running. Check with `mongosh` or MongoDB Compass

### Port Already in Use
- **Issue**: `Error: listen EADDRINUSE: address already in use`
- **Solution**: 
  - Change `PORT` in `.env` to a different port (e.g., 5002)
  - Or kill the process using the port

### Frontend Build Errors
- **Issue**: `Module not found` or dependency errors
- **Solution**: 
  ```bash
  cd frontend
  rm -rf node_modules package-lock.json
  npm install
  ```

### Backend Module Errors
- **Issue**: `Cannot find module` errors
- **Solution**: 
  ```bash
  cd backend
  rm -rf node_modules package-lock.json
  npm install
  ```

### JWT Token Errors
- **Issue**: `JsonWebTokenError: invalid token`
- **Solution**: 
  - Logout and login again
  - Clear browser local storage
  - Ensure `JWT_SECRET` is set in `.env`

## Development Tips

### Hot Reload
- Backend uses **nodemon** for auto-reload on file changes
- Frontend uses **React's hot reload** for instant updates

### Database Reset
```bash
# Drop the database and re-seed
cd backend
mongosh skill-intelligence --eval "db.dropDatabase()"
node seed.js
```

### View Database
Use MongoDB Compass or mongosh:
```bash
mongosh skill-intelligence
db.users.find().pretty()
db.skills.find().pretty()
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Serve production build
npm install -g serve
serve -s build
```

## Next Steps

1. **Customize Skills**: Add your own healthcare skills via the API or admin interface
2. **Add Courses**: Integrate with real course platforms (Coursera, edX, Udemy)
3. **Configure GitHub API**: Add GitHub token for more API requests
4. **Deploy**: Deploy to Heroku, Vercel, or AWS
5. **Extend**: Add more features like notifications, social features, certificates

## Resources

- **README**: [README.md](README.md) - Comprehensive project documentation
- **API Docs**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - All API endpoints
- **Models**: [backend/MODELS_DOCUMENTATION.md](backend/MODELS_DOCUMENTATION.md) - Database schemas

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check console logs for error messages
4. Verify all services are running (MongoDB, backend, frontend)

---

**Enjoy building your healthcare career with the Skill Intelligence Platform! 🏥💡**
