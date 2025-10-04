# EduBot API - Complete School Management System

A comprehensive FastAPI-based backend for school management with AI-powered features.

## 🎯 **Role-Based Access Control**

### 👑 **Admin Capabilities**
**Full System Control:**
- ✅ Create and manage teacher accounts
- ✅ Approve/reject student admissions
- ✅ Create student accounts from approved applications
- ✅ Manage all courses and curriculum
- ✅ Create and update class timetables
- ✅ Generate posters and banners with AI
- ✅ View all reports and analytics
- ✅ Manage attendance records
- ✅ Delete assignments and content
- ✅ Full access to all system features

### 👨‍🏫 **Teacher Capabilities**
**Class Management & Teaching Tools:**
- ✅ View students in their assigned classes
- ✅ Create and manage courses they teach
- ✅ Create assignments for their courses
- ✅ Grade student submissions
- ✅ Provide feedback on assignments
- ✅ Record attendance for their classes
- ✅ View class timetables where they teach
- ✅ Generate educational content with AI
- ✅ View reports for their students
- ✅ Review admission applications

### 👨‍🎓 **Student Capabilities**
**Learning & Progress Tracking:**
- ✅ View their class timetable and schedule
- ✅ See all courses in their class
- ✅ View assigned teachers and contact info
- ✅ Check assignments and due dates
- ✅ Submit assignment solutions
- ✅ View personal academic reports
- ✅ Check attendance records
- ✅ Track assignment grades and feedback
- ✅ View only their own data (privacy protected)

## ✅ **Complete Feature Set**

### 🔐 Authentication & Authorization
- **JWT-based authentication** with role-based access control
- **User roles**: Admin, Teacher, Student
- **Complete auth endpoints**:
  - Login/Logout
  - Password reset via email
  - Token refresh
  - User profile management
  - Change password

### 🎓 Admissions & User Management
- **Complete admission workflow** from application to enrollment
- **Admin controls** for student and teacher account creation
- **Role-based dashboards** with user-specific data
- **Secure application process** with approval workflow

### 📚 Course Management
- **Course creation** and curriculum management
- **Teacher assignment** to courses
- **Class-based organization** with proper access control
- **Course details** with descriptions and credits

### 📅 Timetable System
- **Class schedule management** with weekly timetables
- **Time slot allocation** with course and teacher assignment
- **Classroom assignment** and resource management
- **Role-based timetable access** (students see their class, teachers see their courses)

### 📝 Assignment System
- **Assignment creation** by teachers for their courses
- **Student submission portal** with deadline tracking
- **Grading system** with points and feedback
- **Submission status tracking** (submitted, graded, late)
- **Assignment history** and progress monitoring

### 📊 Attendance Management
- **Record attendance** for students (teachers/admins only)
- **View attendance reports** with statistics
- **Class attendance overview** by date
- **Student attendance history** with filtering
- **Update/delete attendance records**

### 📈 Reports & Analytics
- **Comprehensive student reports** with academic performance
- **Assignment analytics** with grade tracking
- **Attendance statistics** and trends
- **Class performance overview** for teachers
- **Individual progress reports** for students

### 🤖 AI Features (Powered by Gemini)
- **Question generation** for different subjects and difficulties
- **Poster/Banner creation** for school events
- **Educational chatbot** for assistance
- **Free tier support** - works with Gemini's free API tier

### 📧 Email Services
- **Password reset emails** with secure tokens
- **Email templates** for notifications
- **SMTP configuration** for various providers

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. Install Dependencies
```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration
Update `.env` file with:
- **Gemini API Key**: Get free key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Email settings**: For password reset functionality
- **Secret key**: Generate a secure random key

### 4. Run the API
```bash
# Development server with auto-reload
./run.sh

# Or manually:
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📝 **Complete API Endpoints**

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /logout` - User logout  
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `GET /me` - Get current user profile
- `PUT /change-password` - Change user password
- `GET /dashboard` - Role-based dashboard
- `POST /refresh` - Refresh access token

### Admissions & User Management (`/api/admissions`)
- `POST /apply` - Submit admission application
- `GET /` - List all applications (admin/teacher only)
- `GET /{app_id}` - Get application details
- `PUT /{app_id}/decision` - Make admission decision (admin only)
- `POST /{app_id}/create-student` - Create student from approved application
- `POST /create-teacher` - Create teacher account (admin only)
- `DELETE /{app_id}` - Delete application (admin only)

### Course Management (`/api/courses`)
- `POST /` - Create course (admin/teachers)
- `GET /` - List courses with role-based filtering
- `GET /{course_id}` - Get course details
- `PUT /{course_id}` - Update course (admin/course teacher)
- `DELETE /{course_id}` - Delete course (admin only)

### Timetable System (`/api/timetables`)
- `POST /` - Create class timetable (admin only)
- `GET /` - List timetables with role-based access
- `GET /{timetable_id}` - Get timetable details
- `GET /class/{class_name}` - Get specific class timetable
- `PUT /{timetable_id}` - Update timetable (admin only)
- `DELETE /{timetable_id}` - Delete timetable (admin only)

### Assignment System (`/api/assignments`)
- `POST /` - Create assignment (teachers only)
- `GET /` - List assignments with role-based filtering
- `GET /{assignment_id}` - Get assignment details
- `POST /{assignment_id}/submit` - Submit assignment (students only)
- `GET /{assignment_id}/submissions` - Get all submissions (teachers/admins)
- `PUT /submissions/{submission_id}/grade` - Grade submission (teachers)
- `GET /my-submissions` - Get student's own submissions
- `DELETE /{assignment_id}` - Delete assignment (teachers/admins)

### Attendance Management (`/api/attendance`)
- `POST /record` - Record student attendance
- `GET /student/{student_id}` - Get student attendance
- `GET /student/{student_id}/report` - Get attendance report
- `GET /class/{class_id}` - Get class attendance
- `PUT /record/{student_id}/{class_id}` - Update attendance
- `DELETE /record/{student_id}/{class_id}` - Delete attendance

### Reports & Analytics (`/api/reports`)
- `GET /student/{student_id}` - Get comprehensive student report
- `GET /my-report` - Get current student's report
- `GET /class/{class_name}` - Get reports for all students in class (teachers/admins)

### AI Features (`/api/ai`)
- `POST /generate-questions` - Generate educational questions
- `POST /generate-poster` - Create posters/banners
- `POST /chatbot` - Educational chatbot

## 🔧 Configuration Options

### Gemini AI (Free & Paid)
- **Free tier**: 15 requests per minute, 1,500 requests per day
- **Paid tier**: Higher limits, production ready
- **Configuration**: Set `GEMINI_API_KEY` in `.env`

### Email Service
- **SMTP providers**: Gmail, Outlook, SendGrid, etc.
- **Templates**: HTML email templates included
- **Configuration**: Set SMTP settings in `.env`

### Database
- **Current**: In-memory storage (development)
- **Future**: MongoDB integration ready
- **Migration**: Easy switch to persistent storage

## 🛡️ Security Features

- **JWT tokens** with expiration
- **Password hashing** with bcrypt
- **Role-based access control**
- **Request validation** with Pydantic
- **CORS configuration** for web apps
- **Environment-based secrets**

## 🔍 Testing

### Run Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src
```

### Manual Testing
- Use Swagger UI at `/docs` for interactive testing
- All endpoints include request/response schemas
- Example payloads provided in documentation

## 📚 Data Models

### User Types
- **Admin**: Full system access, user management
- **Teacher**: Student management, attendance, AI features
- **Student**: View own data, limited access

### Attendance Tracking
- **Statuses**: Present, Absent, Late
- **Reports**: Individual and class-level analytics
- **History**: Date-range filtering and statistics

### AI Content Types
- **Questions**: MCQ, Short answer, Essay
- **Posters**: Educational, Event, Announcement themes
- **Chat**: Educational assistance and Q&A

## 🚀 Production Deployment

### Environment Variables
```bash
ENVIRONMENT=production
DEBUG=False
GEMINI_API_KEY=your-production-key
MONGODB_URL=your-production-mongodb-url
```

### Security Considerations
- Use strong `SECRET_KEY` for JWT signing
- Enable HTTPS in production
- Configure proper CORS origins
- Use environment-specific email settings
- Monitor API usage and rate limits

## 🔄 Future Enhancements

- **MongoDB integration** for persistent storage
- **File upload** for documents and images
- **Real-time notifications** via WebSocket
- **Advanced reporting** with charts and analytics
- **Mobile app API** extensions
- **Integration APIs** for external systems

## 📞 Support

The API is designed to be:
- **Production ready** with proper error handling
- **Scalable** with async/await patterns
- **Configurable** for different environments
- **Documented** with comprehensive schemas
- **Tested** with validation and error cases

All endpoints include proper HTTP status codes, error messages, and response schemas for easy integration with frontend applications.