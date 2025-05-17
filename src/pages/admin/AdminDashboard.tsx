import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Award, BarChart2, TrendingUp, Calendar } from 'lucide-react';
import { useJobsStore } from '../../store/jobsStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { fetchAdminJobs, jobs, loading } = useJobsStore();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    applicationRate: 0,
  });
  
  useEffect(() => {
    fetchAdminJobs();
  }, [fetchAdminJobs]);
  
  useEffect(() => {
    if (jobs.length > 0) {
      const activeJobs = jobs.filter(job => job.isActive).length;
      const totalApplications = jobs.reduce(
        (sum, job) => sum + job.currentApplications, 
        0
      );
      const applicationRate = totalApplications / jobs.length;
      
      setStats({
        totalJobs: jobs.length,
        activeJobs,
        totalApplications,
        applicationRate,
      });
    }
  }, [jobs]);
  
  if (loading && jobs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your recruitment activities
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Jobs</h2>
              <span className="text-3xl font-semibold text-gray-900">{stats.totalJobs}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Active Jobs</h2>
              <span className="text-3xl font-semibold text-gray-900">{stats.activeJobs}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Applications</h2>
              <span className="text-3xl font-semibold text-gray-900">{stats.totalApplications}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Avg. Applications</h2>
              <span className="text-3xl font-semibold text-gray-900">
                {stats.applicationRate.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Jobs</h2>
          <Link to="/admin/jobs" className="text-sm font-medium text-primary hover:text-primary/80">
            View all
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.slice(0, 5).map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.currentApplications} / {job.maxApplications}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                      {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/admin/jobs/${job._id}/applications`}
                      className="text-primary hover:text-primary/80 mr-4"
                    >
                      View Applications
                    </Link>
                    <Link 
                      to={`/admin/jobs/edit/${job._id}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No jobs found. <Link to="/admin/jobs/new" className="text-primary font-medium">Create your first job</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Top Candidates */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Top Candidates</h2>
          <Link to="/admin/filtered" className="text-sm font-medium text-primary hover:text-primary/80">
            View all
          </Link>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No filtered candidates yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start reviewing applications and filter candidates to see them here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;