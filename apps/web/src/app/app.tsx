import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

// Public components
import { Header, Footer } from '../components';

// Authentication components
import ForgotPassword from '../components/ForgotPassword';
import Unauthorized from '../components/Unauthorized';

// Dashboard components
import AdminDashboard from '../components/AdminDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import StudentDashboard from '../components/StudentDashboard';

// Protected Route components
import { AdminRoute, TeacherRoute, StudentRoute, PublicRoute } from '../components/ProtectedRoute';
import LoginModal from '../components/LoginModal';

// Header with Login Button
function HeaderWithLogin() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <Header 
        schoolName="EduBot AI School"
        showLoginButton={!user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        user={user}
        onLogout={logout}
      />
      <LoginModal
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}

// Home page component
function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* Floating elements for visual appeal */}
              <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 animate-bounce"></div>
              <div className="absolute top-40 right-10 w-16 h-16 bg-amber-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
              <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-200 rounded-full opacity-20 animate-bounce delay-500"></div>
              
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="text-gray-800">EduBot AI School</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
              Experience the future of education with our AI-powered school management system. 
              Complete digital transformation for Classes 4-10 with personalized learning and smart automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16">
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-lg rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg">
                Admissions Open
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold text-lg rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Virtual Tour</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto lg:mx-0">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl font-bold text-emerald-600 mb-2">1200+</div>
                <div className="text-gray-600">Happy Students</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl font-bold text-teal-600 mb-2">98%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl font-bold text-amber-600 mb-2">AI-Powered</div>
                <div className="text-gray-600">Learning Experience</div>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
                alt="Students learning with AI technology" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl opacity-20"></div>
          </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Academic Excellence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive education powered by cutting-edge AI technology for Classes 4-10
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Smart Learning */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Personalized learning paths with AI tutoring for each student's unique needs
              </p>
            </div>

            {/* Digital Classroom */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Digital Classrooms</h3>
              <p className="text-gray-600 leading-relaxed">
                Interactive smart boards, online assignments, and real-time collaboration tools
              </p>
            </div>

            {/* Assessment System */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated grading, instant feedback, and comprehensive progress tracking
              </p>
            </div>

            {/* Parent Portal */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Parent Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time updates on attendance, grades, and school activities for parents
              </p>
            </div>
          </div>

          {/* Academic Programs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Academic Programs</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <p className="text-gray-700"><strong>CBSE Curriculum:</strong> Comprehensive syllabus for Classes 4-10 with modern teaching methods</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  <p className="text-gray-700"><strong>STEM Focus:</strong> Advanced Science, Technology, Engineering & Mathematics programs</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <p className="text-gray-700"><strong>Language Skills:</strong> Multilingual education with English, Hindi, and regional languages</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Facilities & Services</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <p className="text-gray-700"><strong>Smart Campus:</strong> AI-enabled infrastructure with digital learning resources</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-gray-700"><strong>24/7 Support:</strong> Online learning platform and academic assistance</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <p className="text-gray-700"><strong>Extracurricular:</strong> Sports, arts, robotics, and leadership development programs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="AI-powered education technology" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">AI-Powered</div>
                    <div className="text-xs text-gray-600">Smart Learning</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Pioneering Education with 
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> AI Innovation</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                EduBot AI School is at the forefront of educational technology, providing students in Classes 4-10 
                with an AI-enhanced learning environment that adapts to individual needs and accelerates academic growth.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">State-of-the-art campus with smart classrooms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-teal-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Experienced faculty trained in AI-assisted teaching</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Proven track record of 98% student success rate</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Holistic development through academics and extracurriculars</span>
                </div>
              </div>

              <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-lg rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg">
                Learn About Our Mission
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Our AI-Enhanced Learning Community
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-3xl mx-auto">
            Admissions open for Classes 4-10. Give your child the advantage of AI-powered education 
            with personalized learning paths and comprehensive development.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-10 py-5 bg-white text-emerald-600 font-bold text-lg rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg">
              Apply Now
            </button>
            <button className="px-10 py-5 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-emerald-600 transition-all">
              Schedule Campus Visit
            </button>
          </div>

          {/* School Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-white/90">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2">₹15,000</div>
              <div className="text-emerald-100">Annual Fees (Affordable)</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2">1:15</div>
              <div className="text-emerald-100">Teacher-Student Ratio</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-emerald-100">Board Exam Pass Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        {/* Global Header with Login Modal */}
        <HeaderWithLogin />

        {/* Routes */}
        <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <HomePage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } 
            />

            {/* Protected Dashboard Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/teacher" 
              element={
                <TeacherRoute>
                  <TeacherDashboard />
                </TeacherRoute>
              } 
            />
            <Route 
              path="/student" 
              element={
                <StudentRoute>
                  <StudentDashboard />
                </StudentRoute>
              } 
            />

            {/* Utility Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Footer */}
          <Footer 
            schoolName="EduBot AI School"
            schoolDescription="Empowering students with AI-driven education and comprehensive school management for Classes 4-10."
            address="123 Education Lane, Tech City, TC 12345"
            phone="+91 98765 43210"
            email="info@edubotaischool.edu"
            socialLinks={{
              facebook: "https://facebook.com/edubotaischool",
              twitter: "https://twitter.com/edubotaischool",
              instagram: "https://instagram.com/edubotaischool"
            }}
          />
        </div>
      </AuthProvider>
  );
}

export default App;
