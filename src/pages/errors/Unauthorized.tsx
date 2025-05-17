import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-red-100 p-6 rounded-full mb-6">
          <ShieldAlert size={60} className="text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Access Denied
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
          You don't have permission to access this page.
        </p>
        <div className="flex gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            to={user?.role === 'admin' ? '/admin' : '/candidate'}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {user?.role === 'admin' ? 'Go to Dashboard' : 'Browse Jobs'}
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;