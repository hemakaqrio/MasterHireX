import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Briefcase, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Briefcase className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">MasterHireX</span>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-4">
              <Link 
                to="/candidate" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/candidate/jobs" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
              >
                Job Openings
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10 transition-colors">
                    <User className="h-5 w-5" />
                    <span>{user?.email}</span>
                  </button>
                  
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg invisible group-hover:visible transition-all z-10">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-white text-primary hover:bg-gray-100 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-foreground/10 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/candidate"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/candidate/jobs"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Job Openings
          </Link>
        </div>
        
        <div className="pt-4 pb-3 border-t border-primary-foreground/10">
          {isAuthenticated ? (
            <div>
              <div className="px-4 py-2">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-primary-foreground/70">{user?.role}</p>
              </div>
              <div className="mt-3 px-2 space-y-1">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;