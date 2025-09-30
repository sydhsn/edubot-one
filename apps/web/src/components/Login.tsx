import { useState } from 'react';

export interface LoginProps {
  onClose?: () => void;
  onLogin?: (role: 'student' | 'teacher' | 'admin', credentials: { username: string; password: string }) => void;
}

export function Login({ onClose, onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      onLogin?.(selectedRole, { username, password });
      setIsLoading(false);
    }, 1000);
  };

  const roleConfigs = {
    student: {
      title: 'Student Login',
      description: 'Access your classes, assignments, and grades',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-emerald-500',
      buttonBg: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800',
      focusRing: 'focus:ring-emerald-200',
      cardBg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
    },
    teacher: {
      title: 'Teacher Login',
      description: 'Manage classes, students, and curriculum',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      borderColor: 'border-teal-500',
      bgColor: 'bg-teal-50',
      iconBg: 'bg-teal-500',
      buttonBg: 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800',
      focusRing: 'focus:ring-teal-200',
      cardBg: 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200'
    },
    admin: {
      title: 'Admin Login',
      description: 'School management and administration',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-50',
      iconBg: 'bg-amber-500',
      buttonBg: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800',
      focusRing: 'focus:ring-amber-200',
      cardBg: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
    }
  };

  const currentRole = roleConfigs[selectedRole];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">EduBot AI School</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Role Selection */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Role</h3>
          <div className="grid grid-cols-1 gap-3 mb-6">
            {(Object.keys(roleConfigs) as Array<keyof typeof roleConfigs>).map((role) => {
              const config = roleConfigs[role];
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? `${config.borderColor} ${config.bgColor}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected 
                        ? `${config.iconBg} text-white` 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {config.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{config.title}</div>
                      <div className="text-sm text-gray-600">{config.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          <div className={`${currentRole.cardBg} rounded-xl p-6 border`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg ${currentRole.iconBg} text-white`}>
                {currentRole.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{currentRole.title}</h4>
                <p className="text-sm text-gray-600">{currentRole.description}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedRole === 'student' ? 'Student ID' : 'Username'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={selectedRole === 'student' ? 'Enter your student ID' : 'Enter your username'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-emerald-600 hover:text-emerald-700">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 ${currentRole.buttonBg} text-white font-semibold rounded-lg ${currentRole.focusRing} focus:ring-4 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  `Sign in as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-white/70 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 font-medium mb-1">Demo Credentials:</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div><strong>Student:</strong> student123 / pass123</div>
                <div><strong>Teacher:</strong> teacher123 / pass123</div>
                <div><strong>Admin:</strong> admin123 / pass123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}