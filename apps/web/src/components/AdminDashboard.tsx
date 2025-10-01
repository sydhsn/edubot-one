import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRole } from '../contexts/AuthContext';
import AuthService, { RegisterStudentRequest, RegisterTeacherRequest } from '../services/authService';
import { User } from '../services/api';

// Form data interfaces
interface StudentFormData {
  email: string;
  password: string;
  full_name: string;
  student_id?: string;
  grade?: string;
  section?: string;
}

interface TeacherFormData {
  email: string;
  password: string;
  full_name: string;
  employee_id?: string;
  department?: string;
  subject?: string;
}

// Validation schemas
const studentSchema: yup.ObjectSchema<StudentFormData> = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  full_name: yup.string().required('Full name is required'),
  student_id: yup.string().notRequired(),
  grade: yup.string().notRequired(),
  section: yup.string().notRequired(),
}).required();

const teacherSchema: yup.ObjectSchema<TeacherFormData> = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  full_name: yup.string().required('Full name is required'),
  employee_id: yup.string().notRequired(),
  department: yup.string().notRequired(),
  subject: yup.string().notRequired(),
}).required();

// Tab type
type TabType = 'overview' | 'students' | 'teachers' | 'register-student' | 'register-teacher' | 'analytics' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useRole();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Student form
  const studentForm = useForm<StudentFormData>({
    // @ts-expect-error - Complex type inference issue between Yup and React Hook Form
    resolver: yupResolver(studentSchema),
  });

  // Teacher form
  const teacherForm = useForm<TeacherFormData>({
    // @ts-expect-error - Complex type inference issue between Yup and React Hook Form
    resolver: yupResolver(teacherSchema),
  });

  // Load users data
  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const [allUsers, studentList, teacherList] = await Promise.all([
        AuthService.getAllUsers(),
        AuthService.getUsersByRole('student'),
        AuthService.getUsersByRole('teacher'),
      ]);
      setUsers(allUsers);
      setStudents(studentList);
      setTeachers(teacherList);
    } catch {
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Register student
  const onRegisterStudent: SubmitHandler<StudentFormData> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      setMessage(null);
      
      await AuthService.registerStudent(data as RegisterStudentRequest);
      setMessage('Student registered successfully!');
      studentForm.reset();
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register student');
    } finally {
      setIsLoading(false);
    }
  };

  // Register teacher
  const onRegisterTeacher: SubmitHandler<TeacherFormData> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      setMessage(null);
      
      await AuthService.registerTeacher(data as RegisterTeacherRequest);
      setMessage('Teacher registered successfully!');
      teacherForm.reset();
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register teacher');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user status
  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await AuthService.updateUserStatus(userId, isActive);
      await loadUsers();
      setMessage(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch {
      setError('Failed to update user status');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: '📊', color: 'from-blue-500 to-cyan-500' },
    { id: 'students', label: 'Students', icon: '👨‍🎓', color: 'from-green-500 to-emerald-500' },
    { id: 'teachers', label: 'Teachers', icon: '👨‍🏫', color: 'from-purple-500 to-violet-500' },
    { id: 'register-student', label: 'Add Student', icon: '➕', color: 'from-indigo-500 to-blue-500' },
    { id: 'register-teacher', label: 'Add Teacher', icon: '➕', color: 'from-pink-500 to-rose-500' },
    { id: 'analytics', label: 'Analytics', icon: '📈', color: 'from-orange-500 to-amber-500' },
    { id: 'settings', label: 'Settings', icon: '⚙️', color: 'from-gray-500 to-slate-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message/Error alerts */}
        {message && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-700">{message}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-2 shadow-lg border border-white/20">
            <nav className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {activeTab === 'overview' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">School Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Students</p>
                      <p className="text-3xl font-bold">{students.length}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-2xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Teachers</p>
                      <p className="text-3xl font-bold">{teachers.length}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-violet-500 p-6 rounded-2xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Active Classes</p>
                      <p className="text-3xl font-bold">12</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-6 rounded-2xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Total Users</p>
                      <p className="text-3xl font-bold">{users.length}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('register-student')}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 flex items-center space-x-3"
                    >
                      <span role="img" aria-label="Plus icon">➕</span>
                      <span>Add New Student</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('register-teacher')}
                      className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-200 transform hover:scale-105 flex items-center space-x-3"
                    >
                      <span role="img" aria-label="Plus icon">➕</span>
                      <span>Add New Teacher</span>
                    </button>
                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 flex items-center space-x-3">
                      <span role="img" aria-label="Chart icon">📊</span>
                      <span>Generate Report</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm" role="img" aria-label="User icon">👤</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">New student registered</p>
                        <p className="text-xs text-gray-600">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm" role="img" aria-label="Teacher icon">👨‍🏫</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">Teacher profile updated</p>
                        <p className="text-xs text-gray-600">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm" role="img" aria-label="Document icon">📝</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">System backup completed</p>
                        <p className="text-xs text-gray-600">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Student Management</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.full_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => updateUserStatus(student.id, !student.is_active)}
                            className={`mr-2 px-3 py-1 rounded text-xs font-medium ${
                              student.is_active
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {student.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Teacher Management</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {teacher.full_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {teacher.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            teacher.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {teacher.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => updateUserStatus(teacher.id, !teacher.is_active)}
                            className={`mr-2 px-3 py-1 rounded text-xs font-medium ${
                              teacher.is_active
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {teacher.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'register-student' && (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span role="img" aria-label="Student" className="text-3xl text-white">👨‍🎓</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Register New Student</h2>
                  <p className="text-gray-600">Add a new student to the school management system</p>
                </div>

                <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
                    <h3 className="text-xl font-semibold text-white">Student Information</h3>
                    <p className="text-blue-100 text-sm">Please fill in all required fields marked with *</p>
                  </div>

                  <form onSubmit={studentForm.handleSubmit(onRegisterStudent)} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Personal Information */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Personal Details</h4>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              {...studentForm.register('full_name')}
                              type="text"
                              placeholder="Enter student's full name"
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="Person" className="text-gray-400">👤</span>
                            </div>
                          </div>
                          {studentForm.formState.errors.full_name && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <span role="img" aria-label="Error" className="mr-1">⚠️</span>
                              {studentForm.formState.errors.full_name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              {...studentForm.register('email')}
                              type="email"
                              placeholder="student@example.com"
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="Email" className="text-gray-400">📧</span>
                            </div>
                          </div>
                          {studentForm.formState.errors.email && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <span role="img" aria-label="Error" className="mr-1">⚠️</span>
                              {studentForm.formState.errors.email.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              {...studentForm.register('password')}
                              type="password"
                              placeholder="Create a secure password"
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="Password" className="text-gray-400">🔒</span>
                            </div>
                          </div>
                          {studentForm.formState.errors.password && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <span role="img" aria-label="Error" className="mr-1">⚠️</span>
                              {studentForm.formState.errors.password.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Academic Information */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Academic Details</h4>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                          <div className="relative">
                            <input
                              {...studentForm.register('student_id')}
                              type="text"
                              placeholder="Auto-generated if left empty"
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="ID" className="text-gray-400">🆔</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Grade/Class</label>
                          <div className="relative">
                            <select
                              {...studentForm.register('grade')}
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                            >
                              <option value="">Select Grade</option>
                              <option value="1">Grade 1</option>
                              <option value="2">Grade 2</option>
                              <option value="3">Grade 3</option>
                              <option value="4">Grade 4</option>
                              <option value="5">Grade 5</option>
                              <option value="6">Grade 6</option>
                              <option value="7">Grade 7</option>
                              <option value="8">Grade 8</option>
                              <option value="9">Grade 9</option>
                              <option value="10">Grade 10</option>
                              <option value="11">Grade 11</option>
                              <option value="12">Grade 12</option>
                            </select>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="Grade" className="text-gray-400">📚</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                          <div className="relative">
                            <select
                              {...studentForm.register('section')}
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                            >
                              <option value="">Select Section</option>
                              <option value="A">Section A</option>
                              <option value="B">Section B</option>
                              <option value="C">Section C</option>
                              <option value="D">Section D</option>
                            </select>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="Section" className="text-gray-400">🔤</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-start space-x-3">
                            <span role="img" aria-label="Info" className="text-blue-500 mt-0.5">ℹ️</span>
                            <div>
                              <h5 className="text-sm font-medium text-blue-800">Registration Notes</h5>
                              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                                <li>• Student will receive login credentials via email</li>
                                <li>• Default access includes class materials and results</li>
                                <li>• Parents will be notified of the registration</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering Student...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <span role="img" aria-label="Plus icon" className="mr-2">➕</span>
                            Register Student
                          </div>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => studentForm.reset()}
                        className="flex-1 bg-gray-200 text-gray-800 py-4 px-8 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                      >
                        <div className="flex items-center justify-center">
                          <span role="img" aria-label="Refresh icon" className="mr-2">🔄</span>
                          Clear Form
                        </div>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'register-teacher' && (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span role="img" aria-label="Teacher" className="text-3xl text-white">👨‍🏫</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Register New Teacher</h2>
                  <p className="text-gray-600">Add a new teacher to the school management system</p>
                </div>

                <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-6">
                    <h3 className="text-xl font-semibold text-white">Teacher Information</h3>
                    <p className="text-purple-100 text-sm">Please fill in all required fields marked with *</p>
                  </div>

                  <form onSubmit={teacherForm.handleSubmit(onRegisterTeacher)} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Personal Information */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Personal Details</h4>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              {...teacherForm.register('full_name')}
                              type="text"
                              placeholder="Enter teacher's full name"
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="Person" className="text-gray-400">👤</span>
                            </div>
                          </div>
                          {teacherForm.formState.errors.full_name && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <span role="img" aria-label="Error" className="mr-1">⚠️</span>
                              {teacherForm.formState.errors.full_name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              {...teacherForm.register('email')}
                              type="email"
                              placeholder="teacher@example.com"
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="Email" className="text-gray-400">📧</span>
                            </div>
                          </div>
                          {teacherForm.formState.errors.email && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <span role="img" aria-label="Error" className="mr-1">⚠️</span>
                              {teacherForm.formState.errors.email.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              {...teacherForm.register('password')}
                              type="password"
                              placeholder="Create a secure password"
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="Password" className="text-gray-400">🔒</span>
                            </div>
                          </div>
                          {teacherForm.formState.errors.password && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <span role="img" aria-label="Error" className="mr-1">⚠️</span>
                              {teacherForm.formState.errors.password.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Professional Information */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Professional Details</h4>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                          <div className="relative">
                            <input
                              {...teacherForm.register('employee_id')}
                              type="text"
                              placeholder="Auto-generated if left empty"
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="ID" className="text-gray-400">🆔</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                          <div className="relative">
                            <select
                              {...teacherForm.register('department')}
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                            >
                              <option value="">Select Department</option>
                              <option value="Mathematics">Mathematics</option>
                              <option value="Science">Science</option>
                              <option value="English">English</option>
                              <option value="Social Studies">Social Studies</option>
                              <option value="Physical Education">Physical Education</option>
                              <option value="Arts">Arts</option>
                              <option value="Music">Music</option>
                              <option value="Computer Science">Computer Science</option>
                              <option value="Languages">Foreign Languages</option>
                              <option value="Special Education">Special Education</option>
                            </select>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="Department" className="text-gray-400">🏢</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Subject</label>
                          <div className="relative">
                            <select
                              {...teacherForm.register('subject')}
                              className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                            >
                              <option value="">Select Subject</option>
                              <option value="Algebra">Algebra</option>
                              <option value="Geometry">Geometry</option>
                              <option value="Biology">Biology</option>
                              <option value="Chemistry">Chemistry</option>
                              <option value="Physics">Physics</option>
                              <option value="English Literature">English Literature</option>
                              <option value="Grammar">Grammar</option>
                              <option value="History">History</option>
                              <option value="Geography">Geography</option>
                              <option value="Physical Education">Physical Education</option>
                              <option value="Art">Art</option>
                              <option value="Music">Music</option>
                              <option value="Computer Programming">Computer Programming</option>
                              <option value="Spanish">Spanish</option>
                              <option value="French">French</option>
                            </select>
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <span role="img" aria-label="Subject" className="text-gray-400">📚</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                          <div className="flex items-start space-x-3">
                            <span role="img" aria-label="Info" className="text-purple-500 mt-0.5">ℹ️</span>
                            <div>
                              <h5 className="text-sm font-medium text-purple-800">Registration Notes</h5>
                              <ul className="text-xs text-purple-700 mt-1 space-y-1">
                                <li>• Teacher will receive login credentials via email</li>
                                <li>• Access includes student management and grading</li>
                                <li>• Profile can be updated after registration</li>
                                <li>• Admin approval may be required for certain actions</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white py-4 px-8 rounded-xl hover:from-purple-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering Teacher...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <span role="img" aria-label="Plus icon" className="mr-2">➕</span>
                            Register Teacher
                          </div>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => teacherForm.reset()}
                        className="flex-1 bg-gray-200 text-gray-800 py-4 px-8 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                      >
                        <div className="flex items-center justify-center">
                          <span role="img" aria-label="Refresh icon" className="mr-2">🔄</span>
                          Clear Form
                        </div>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Analytics Dashboard</h2>
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-600">Average Grade</p>
                        <p className="text-2xl font-bold text-green-600">85.4%</p>
                      </div>
                      <div className="text-green-500">
                        <span role="img" aria-label="Trending up">📈</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-600">Attendance Rate</p>
                        <p className="text-2xl font-bold text-blue-600">92.1%</p>
                      </div>
                      <div className="text-blue-500">
                        <span role="img" aria-label="Present">✅</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-600">Assignment Completion</p>
                        <p className="text-2xl font-bold text-purple-600">78.3%</p>
                      </div>
                      <div className="text-purple-500">
                        <span role="img" aria-label="Tasks">📝</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Distribution</h3>
                  <div className="space-y-3">
                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'].map((grade, index) => (
                      <div key={grade} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{grade}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${
                                index % 3 === 0 ? 'from-blue-500 to-cyan-500' :
                                index % 3 === 1 ? 'from-green-500 to-emerald-500' :
                                'from-purple-500 to-violet-500'
                              }`}
                              style={{ width: `${60 + index * 8}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">{15 + index * 3}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { time: '2 hours ago', action: 'New student enrolled in Grade 3', type: 'enrollment' },
                    { time: '4 hours ago', action: 'Teacher completed grade submission', type: 'grades' },
                    { time: '1 day ago', action: 'Parent-teacher meeting scheduled', type: 'meeting' },
                    { time: '2 days ago', action: 'System backup completed successfully', type: 'system' },
                    { time: '3 days ago', action: 'New semester started', type: 'semester' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-white/40 rounded-xl">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'enrollment' ? 'bg-green-100' :
                        activity.type === 'grades' ? 'bg-blue-100' :
                        activity.type === 'meeting' ? 'bg-purple-100' :
                        activity.type === 'system' ? 'bg-gray-100' :
                        'bg-orange-100'
                      }`}>
                        <span role="img" aria-label="Activity" className="text-lg">
                          {activity.type === 'enrollment' ? '👤' :
                           activity.type === 'grades' ? '📊' :
                           activity.type === 'meeting' ? '🤝' :
                           activity.type === 'system' ? '⚙️' :
                           '🎓'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">System Settings</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* School Information */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">School Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                      <input
                        type="text"
                        defaultValue="EduBot Academy"
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">School Address</label>
                      <textarea
                        rows={3}
                        defaultValue="123 Education Street, Learning City, LC 12345"
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        defaultValue="admin@edubot.academy"
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* System Preferences */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">System Preferences</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Email Notifications</p>
                        <p className="text-xs text-gray-600">Receive system notifications via email</p>
                      </div>
                      <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Auto Backup</p>
                        <p className="text-xs text-gray-600">Automatically backup data daily</p>
                      </div>
                      <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Maintenance Mode</p>
                        <p className="text-xs text-gray-600">Put system in maintenance mode</p>
                      </div>
                      <button className="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                      <select className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>2024-2025</option>
                        <option>2023-2024</option>
                        <option>2022-2023</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                      <select className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>UTC-05:00 (Eastern Time)</option>
                        <option>UTC-06:00 (Central Time)</option>
                        <option>UTC-07:00 (Mountain Time)</option>
                        <option>UTC-08:00 (Pacific Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Save Settings
                </button>
                <button className="bg-gradient-to-r from-gray-600 to-slate-600 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-slate-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Reset to Defaults
                </button>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Export Data
                </button>
                <button className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Import Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;