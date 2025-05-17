import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

type AdminHeaderProps = {
  onMenuButtonClick: () => void;
};

const AdminHeader = ({ onMenuButtonClick }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow-sm h-16 flex items-center z-10">
      <div className="flex justify-between items-center w-full px-4">
        <button
          onClick={onMenuButtonClick}
          className="text-gray-500 focus:outline-none md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="ml-4 md:ml-0">
          <h1 className="text-lg font-medium text-gray-900">Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center">
          <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent"></span>
          </button>
          
          <div className="relative ml-3">
            <div className="group relative">
              <button className="flex items-center space-x-2 p-2 rounded-full text-gray-700 hover:text-gray-900 focus:outline-none">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                  {user?.email.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.email}</span>
              </button>
              
              <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg invisible group-hover:visible transition-all z-10">
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;