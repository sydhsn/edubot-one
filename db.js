/**
 * MongoDB Atlas Connection Configuration
 * 
 * This file documents the MongoDB setup for the School Management System.
 * The actual connection is handled by Python's motor driver using environment variables.
 * 
 * Database: MongoDB Atlas (Cloud)
 * Connection: Configured via .env file
 * 
 * Environment Variables:
 * - DATABASE_URL: MongoDB Atlas connection string
 * - DATABASE_NAME: Database name (default: school_bd)
 * 
 * Collections:
 * - users: Students, teachers, and admin users
 * - admissions: Student admission records
 * - attendance: Attendance tracking
 * - courses: Course management
 * - assignments: Assignment management
 * 
 * Indexes:
 * - users.email (unique)
 * - users.employee_id
 * - users.admission_number
 * - admissions.admission_id (unique)
 * - admissions.email
 * - admissions.registered_by
 * 
 * Default Admin User:
 * - Email: admin@school.com
 * - Password: admin123
 * - Role: admin
 * 
 * Note: This is automatically created when the API starts if it doesn't exist.
 */

// Connection string format (for reference):
// mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

module.exports = {
    // This file is for documentation only
    // Actual connection is handled by Python backend
    info: "MongoDB Atlas connection configured via Python backend"
};