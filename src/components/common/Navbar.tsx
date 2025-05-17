import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase as BriefcaseBusiness, Briefcase, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-500';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <BriefcaseBusiness size={28} />
          <span>MasterHireX</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" className={`flex items-center gap-1 ${isActive('/admin')}`}>
                  <BriefcaseBusiness size={18} />
                  <span>Admin</span>
                </Link>
              )}
              
              <Link to="/candidate" className={`flex items-center gap-1 ${isActive('/candidate')}`}>
                <Briefcase size={18} />
                <span>Jobs</span>
              </Link>
              
              <div className="flex items-center gap-2 text-gray-600">
                <User size={18} />
                <span className="hidden md:inline">{user?.email}</span>
              </div>
              
              <button 
                onClick={logout}
                className="flex items-center gap-1 text-red-500 hover:text-red-600"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/candidate" className={`flex items-center gap-1 ${isActive('/candidate')}`}>
                <Briefcase size={18} />
                <span>Browse Jobs</span>
              </Link>
              <Link to="/login" className={`flex items-center gap-1 ${isActive('/login')}`}>
                <span>Admin Login</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;