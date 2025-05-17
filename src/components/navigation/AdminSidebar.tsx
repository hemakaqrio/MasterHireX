import { Link, useLocation } from 'react-router-dom';
import { X, ChevronDown, LayoutDashboard, Briefcase, FileText, Users, BarChart } from 'lucide-react';
import { useState } from 'react';

type AdminSidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const AdminSidebar = ({ isOpen, setIsOpen }: AdminSidebarProps) => {
  const location = useLocation();
  const [jobsOpen, setJobsOpen] = useState(false);
  
  // Check if the current location matches a given path
  const isActivePath = (path: string) => location.pathname === path;
  const isActiveGroup = (basePath: string) => location.pathname.startsWith(basePath);
  
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${
          isOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform md:translate-x-0 md:static md:inset-auto md:z-auto ${
          isOpen ? 'translate-x-0 ease-out duration-300' : '-translate-x-full ease-in duration-200'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/admin" className="flex items-center">
            <Briefcase className="h-8 w-8 text-primary mr-2" />
            <span className="text-lg font-bold text-primary">RecruitX</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full py-4">
          <nav className="px-2 space-y-1">
            <Link
              to="/admin"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActivePath('/admin')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            
            <div className="space-y-1">
              <button
                onClick={() => setJobsOpen(!jobsOpen)}
                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md justify-between ${
                  isActiveGroup('/admin/jobs')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Briefcase className="mr-3 h-5 w-5" />
                  Jobs Management
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${jobsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              
              {jobsOpen && (
                <div className="pl-8 space-y-1">
                  <Link
                    to="/admin/jobs"
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActivePath('/admin/jobs')
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Jobs
                  </Link>
                </div>
              )}
            </div>
            
            <Link
              to="/admin/filtered"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActivePath('/admin/filtered')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Filtered Candidates
            </Link>
            
            <Link
              to="/admin/statistics"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActivePath('/admin/statistics')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart className="mr-3 h-5 w-5" />
              Statistics
            </Link>
            
            <Link
              to="/admin/exports"
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActivePath('/admin/exports')
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="mr-3 h-5 w-5" />
              Data Export
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;