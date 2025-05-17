import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Common components
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CandidateJobs from './pages/candidate/CandidateJobs';
import JobDetail from './pages/candidate/JobDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import JobCreate from './pages/admin/JobCreate';
import JobEdit from './pages/admin/JobEdit';
import ApplicationList from './pages/admin/ApplicationList';
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Candidate Routes (Public) */}
          <Route path="/candidate" element={<CandidateJobs />} />
          <Route path="/candidate/jobs/:id" element={<JobDetail />} />
          
          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/jobs/create" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <JobCreate />
            </ProtectedRoute>
          } />
          <Route path="/admin/jobs/:id/edit" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <JobEdit />
            </ProtectedRoute>
          } />
          <Route path="/admin/jobs/:id" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ApplicationList />
            </ProtectedRoute>
          } />
          
          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;