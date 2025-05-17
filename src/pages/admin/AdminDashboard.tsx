import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import JobCard from '../../components/common/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Job } from '../../types';
import { getAllJobs } from '../../services/jobService';
import { PlusCircle, Briefcase, AlertCircle, Search } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const fetchedJobs = await getAllJobs();
        setJobs(fetchedJobs);
      } catch (err) {
        console.error(err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);
  
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.keywords?.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const activeJobsCount = jobs.filter(job => job.isActive).length;
  const closedJobsCount = jobs.filter(job => !job.isActive).length;

  return (
    <Layout>
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Manage job vacancies and review applications</p>
            </div>
            
            <Link 
              to="/admin/jobs/create" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <PlusCircle size={18} />
              <span>Create New Job</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Total Job Vacancies</h3>
              <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Active Jobs</h3>
              <p className="text-3xl font-bold text-green-600">{activeJobsCount}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Closed Jobs</h3>
              <p className="text-3xl font-bold text-red-600">{closedJobsCount}</p>
            </div>
          </div>
          
          <div className="relative max-w-md mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">All Job Vacancies</h2>
        
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="mt-0.5" />
              <span>{error}</span>
            </div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard key={job._id} job={job} isAdmin={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="inline-block bg-gray-100 p-4 rounded-full mb-4">
              <Briefcase size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? `No jobs match your search for "${searchTerm}". Try different keywords.` 
                : 'You haven\'t created any job listings yet.'}
            </p>
            <Link 
              to="/admin/jobs/create" 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <PlusCircle size={18} />
              <span>Create Your First Job</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;