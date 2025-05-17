import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-blue-100 p-6 rounded-full mb-6">
          <FileQuestion size={60} className="text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/candidate"
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;