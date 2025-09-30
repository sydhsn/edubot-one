export interface HeaderProps {
  schoolName?: string;
  logoUrl?: string;
  showLoginButton?: boolean;
  onLoginClick?: () => void;
}

export function Header({ 
  schoolName = "EduBot AI School", 
  logoUrl,
  showLoginButton = true,
  onLoginClick
}: HeaderProps) {
  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
              {logoUrl ? (
                <img src={logoUrl} alt={schoolName} className="w-8 h-8" />
              ) : (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              )}
            </div>
            <span className="text-xl font-bold text-gray-900">{schoolName}</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button className="text-gray-600 hover:text-emerald-600 transition-colors">
              Home
            </button>
            <button className="text-gray-600 hover:text-emerald-600 transition-colors">
              About
            </button>
            <button className="text-gray-600 hover:text-emerald-600 transition-colors">
              Academics
            </button>
            <button className="text-gray-600 hover:text-emerald-600 transition-colors">
              Admissions
            </button>
            <button className="text-gray-600 hover:text-emerald-600 transition-colors">
              Contact
            </button>
          </div>

          {/* Login Button */}
          {showLoginButton && (
            <div className="flex items-center space-x-4">
              <button 
                onClick={onLoginClick}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-sm"
              >
                Login
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}