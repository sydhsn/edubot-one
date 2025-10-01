import React from 'react';

export const StudentDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-xl border border-emerald-100 p-8">
          <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Student Portal
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="Books icon" className="text-3xl">📚</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-emerald-900">My Courses</h3>
                  <p className="text-sm text-emerald-700">View enrolled courses</p>
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
                  <p className="text-sm text-teal-700">View and submit assignments</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="Grade chart icon" className="text-3xl">📊</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-amber-900">Grades</h3>
                  <p className="text-sm text-amber-700">View your academic progress</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-6 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="Calendar icon" className="text-3xl">📅</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-emerald-900">Schedule</h3>
                  <p className="text-sm text-emerald-700">View class timetable</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-amber-100 p-6 rounded-xl border border-teal-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="Clock icon" className="text-3xl">🕐</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-teal-900">Attendance</h3>
                  <p className="text-sm text-teal-700">Check attendance record</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-emerald-100 p-6 rounded-xl border border-amber-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span role="img" aria-label="Message icon" className="text-3xl">💬</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-amber-900">Messages</h3>
                  <p className="text-sm text-amber-700">School announcements</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Recent Activity</h3>
            <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-emerald-200">
                  <div>
                    <p className="text-sm font-medium text-emerald-900">Math Assignment Due</p>
                    <p className="text-xs text-emerald-700">Due: Tomorrow, 11:59 PM</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full border border-amber-200">Pending</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-emerald-200">
                  <div>
                    <p className="text-sm font-medium text-emerald-900">Science Quiz Results</p>
                    <p className="text-xs text-emerald-700">Score: 85/100</p>
                  </div>
                  <span className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full border border-teal-200">Completed</span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-emerald-900">History Class</p>
                    <p className="text-xs text-emerald-700">Next: Today, 2:00 PM</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full border border-emerald-200">Upcoming</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-teal-50/50 to-amber-50/50 backdrop-blur-sm rounded-xl border border-teal-100">
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 text-sm font-medium transition-all duration-200 shadow-lg">
                Submit Assignment
              </button>
              <button className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-emerald-700 text-sm font-medium transition-all duration-200 shadow-lg">
                Check Grades
              </button>
              <button className="bg-gradient-to-r from-amber-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-emerald-700 text-sm font-medium transition-all duration-200 shadow-lg">
                View Schedule
              </button>
              <button className="bg-gradient-to-r from-teal-500 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-amber-700 text-sm font-medium transition-all duration-200 shadow-lg">
                Contact Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;