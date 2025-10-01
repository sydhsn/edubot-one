import React from 'react';

export const TeacherDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-xl border border-emerald-100 p-8">
          <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Teacher Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="Classroom icon" className="text-3xl">🏫</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-emerald-900">My Classes</h3>
                  <p className="text-sm text-emerald-700">Manage your assigned classes</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="Assignment icon" className="text-3xl">📝</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-teal-900">Assignments</h3>
                  <p className="text-sm text-teal-700">Create and grade assignments</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="Grade report icon" className="text-3xl">📊</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-amber-900">Grade Reports</h3>
                  <p className="text-sm text-amber-700">View student performance</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-6 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="Attendance icon" className="text-3xl">✅</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-emerald-900">Attendance</h3>
                  <p className="text-sm text-emerald-700">Track student attendance</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-amber-100 p-6 rounded-xl border border-teal-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="Message icon" className="text-3xl">💬</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-teal-900">Messages</h3>
                  <p className="text-sm text-teal-700">Communicate with students</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-emerald-100 p-6 rounded-xl border border-amber-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="Curriculum icon" className="text-3xl">📚</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-amber-900">Curriculum</h3>
                  <p className="text-sm text-amber-700">Manage course content</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-teal-50/50 to-amber-50/50 backdrop-blur-sm rounded-xl border border-teal-100">
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 text-sm font-medium transition-all duration-200 shadow-lg">
                Create Assignment
              </button>
              <button className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-emerald-700 text-sm font-medium transition-all duration-200 shadow-lg">
                Take Attendance
              </button>
              <button className="bg-gradient-to-r from-amber-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-emerald-700 text-sm font-medium transition-all duration-200 shadow-lg">
                Grade Papers
              </button>
              <button className="bg-gradient-to-r from-teal-500 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-amber-700 text-sm font-medium transition-all duration-200 shadow-lg">
                Send Announcement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;