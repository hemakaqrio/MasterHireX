import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/public/HomePage';
import JobsList from './pages/public/JobsList';
import JobDetails from './pages/public/JobDetails';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobs from './pages/admin/AdminJobs';
import JobApplications from './pages/admin/JobApplications';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/candidate" replace />} />
        <Route path="/candidate" element={<HomePage />} />
        <Route path="/candidate/jobs" element={<JobsList />} />
        <Route path="/candidate/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      
      {/* Admin Routes */}
      <Route 
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="jobs/:id/applications" element={<JobApplications />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/candidate" replace />} />
    </Routes>
  );
}

export default App;