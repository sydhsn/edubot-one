// MongoDB initialization script
db = db.getSiblingDB('edubot');

// Create collections
db.createCollection('users');
db.createCollection('students');
db.createCollection('admissions');
db.createCollection('attendance');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.students.createIndex({ "student_id": 1 }, { unique: true });
db.admissions.createIndex({ "application_id": 1 }, { unique: true });

// Insert sample data
db.users.insertOne({
    email: "admin@edubot.com",
    username: "admin",
    full_name: "Administrator",
    role: "admin",
    is_active: true,
    created_at: new Date()
});

print('Database initialized successfully!');