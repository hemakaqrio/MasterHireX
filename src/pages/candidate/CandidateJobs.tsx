import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';
import JobCard from '../../components/common/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getJobs } from '../../services/jobService';
import { Job } from '../../types';
import { SearchIcon, Briefcase } from 'lucide-react';

const CandidateJobs: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const fetchedJobs = await getJobs();
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

  return (
    <Layout>
      <div className="bg-blue-50 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Available Job Opportunities
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our current job openings and apply with your CV. Our intelligent system will match your skills with the right opportunity.
            </p>
          </div>
          
          <div className="relative max-w-md mx-auto mb-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs by title, description or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-300 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <LoadingSpinner fullPage />
        ) : error ? (
          <div className="text-center py-10 text-red-600">
            <p>{error}</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="inline-block bg-gray-100 p-4 rounded-full mb-4">
              <Briefcase size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Found</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `No jobs match your search for "${searchTerm}". Try different keywords.` 
                : 'There are no active job listings at the moment. Please check back later.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CandidateJobs;