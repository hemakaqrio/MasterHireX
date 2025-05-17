import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Calendar, ArrowRight } from 'lucide-react';
import { useJobsStore, Job } from '../../store/jobsStore';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const JobsList = () => {
  const { fetchPublicJobs, publicJobs, loading } = useJobsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  
  useEffect(() => {
    fetchPublicJobs();
  }, [fetchPublicJobs]);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = publicJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(publicJobs);
    }
  }, [searchTerm, publicJobs]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already handled by useEffect above
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Next Opportunity</h1>
          <p className="mt-2 text-xl text-gray-600">
            Browse our latest job openings and find the perfect match for your skills
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by job title, company, or location"
                  className="block w-full pl-10 input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary md:w-auto">
                Search Jobs
              </button>
            </div>
          </form>
        </div>
        
        {loading ? (
          <div className="my-12">
            <LoadingSpinner className="h-12 w-12 mx-auto" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div 
                key={job._id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-y-1 sm:gap-x-4">
                      <div className="flex items-center">
                        <Briefcase className="mr-1.5 h-4 w-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1.5 h-4 w-4" />
                        {job.location}
                      </div>
                      {job.salary && (
                        <div className="flex items-center">
                          <span className="mr-1.5">💰</span>
                          {job.salary}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="mr-1.5 h-4 w-4" />
                        Posted {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700 line-clamp-2">{job.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.requirements.slice(0, 3).map((req, idx) => (
                        <span 
                          key={idx} 
                          className="badge badge-outline"
                        >
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 3 && (
                        <span className="badge badge-outline">+{job.requirements.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <Link
                      to={`/candidate/jobs/${job._id}`}
                      className="btn btn-primary flex items-center gap-1"
                    >
                      View Job <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or check back later for new opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;