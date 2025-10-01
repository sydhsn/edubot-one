import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth, useRole } from '../contexts/AuthContext';
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
type TabType = 'overview' | 'students' | 'teachers' | 'register-student' | 'register-teacher';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
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
    } catch (error) {
      console.error('Failed to load users:', error);
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
    } catch (error) {
      console.error('Failed to update user status:', error);
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
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'students', label: 'Students', icon: '👨‍🎓' },
    { id: 'teachers', label: 'Teachers', icon: '👨‍🏫' },
    { id: 'register-student', label: 'Add Student', icon: '➕' },
    { id: 'register-teacher', label: 'Add Teacher', icon: '➕' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.full_name || user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message/Error alerts */}
        {message && (
          <div className="mb-4 bg-green-50 border border-green-300 rounded-md p-4">
            <p className="text-sm text-green-800">{message}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800">Total Students</h3>
                  <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800">Total Teachers</h3>
                  <p className="text-3xl font-bold text-green-600">{teachers.length}</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-800">Total Users</h3>
                  <p className="text-3xl font-bold text-purple-600">{users.length}</p>
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
            <div>
              <h2 className="text-xl font-semibold mb-6">Register New Student</h2>
              <form onSubmit={studentForm.handleSubmit(onRegisterStudent)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      {...studentForm.register('email')}
                      type="email"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {studentForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-600">{studentForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                    <input
                      {...studentForm.register('password')}
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {studentForm.formState.errors.password && (
                      <p className="mt-1 text-sm text-red-600">{studentForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      {...studentForm.register('full_name')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {studentForm.formState.errors.full_name && (
                      <p className="mt-1 text-sm text-red-600">{studentForm.formState.errors.full_name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                    <input
                      {...studentForm.register('student_id')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade</label>
                    <input
                      {...studentForm.register('grade')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Section</label>
                    <input
                      {...studentForm.register('section')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Registering...' : 'Register Student'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'register-teacher' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Register New Teacher</h2>
              <form onSubmit={teacherForm.handleSubmit(onRegisterTeacher)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      {...teacherForm.register('email')}
                      type="email"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {teacherForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-600">{teacherForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                    <input
                      {...teacherForm.register('password')}
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {teacherForm.formState.errors.password && (
                      <p className="mt-1 text-sm text-red-600">{teacherForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input
                      {...teacherForm.register('full_name')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {teacherForm.formState.errors.full_name && (
                      <p className="mt-1 text-sm text-red-600">{teacherForm.formState.errors.full_name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                    <input
                      {...teacherForm.register('employee_id')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                      {...teacherForm.register('department')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input
                      {...teacherForm.register('subject')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isLoading ? 'Registering...' : 'Register Teacher'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;