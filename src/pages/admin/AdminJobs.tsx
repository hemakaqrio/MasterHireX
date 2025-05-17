import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  MoreVertical,
  Calendar,
  Users,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useJobsStore, Job } from '../../store/jobsStore';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const AdminJobs = () => {
  const { fetchAdminJobs, jobs, loading, deleteJob } = useJobsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    fetchAdminJobs();
  }, [fetchAdminJobs]);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchTerm, jobs]);
  
  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    
    setIsDeleting(jobToDelete._id);
    
    try {
      const success = await deleteJob(jobToDelete._id);
      if (success) {
        toast.success(`Job "${jobToDelete.title}" deleted successfully`);
      }
    } finally {
      setIsDeleting(null);
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };
  
  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jobs Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create, edit, and manage job vacancies
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/admin/jobs/new"
              className="btn btn-primary inline-flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Job
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                className="block w-full pl-10 input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <select className="input">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="btn btn-outline">
                Filter
              </button>
            </div>
          </div>
        </div>
        
        {loading && jobs.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <LoadingSpinner size={40} />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Posted
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.company} • {job.location}</div>
                          </div>
                        </div>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{job.currentApplications}</span>
                          <span className="mx-1">/</span>
                          <span>{job.maxApplications}</span>
                        </div>
                        {job.currentApplications > 0 && (
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ 
                                  width: `${Math.min(
                                    (job.currentApplications / job.maxApplications) * 100, 
                                    100
                                  )}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                          {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <Link 
                            to={`/admin/jobs/${job._id}/applications`}
                            className="text-gray-500 hover:text-gray-700"
                            title="View Applications"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link 
                            to={`/admin/jobs/edit/${job._id}`}
                            className="text-gray-500 hover:text-gray-700"
                            title="Edit Job"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(job)}
                            className="text-gray-500 hover:text-red-600"
                            title="Delete Job"
                            disabled={isDeleting === job._id}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="text-center">
              <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new job listing.
              </p>
              <div className="mt-6">
                <Link to="/admin/jobs/new" className="btn btn-primary">
                  Add New Job
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && jobToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Job
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{jobToDelete.title}"? This action cannot be undone,
                        and all associated applications will also be deleted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn bg-red-600 text-white hover:bg-red-700 sm:ml-3"
                  disabled={isDeleting === jobToDelete._id}
                  onClick={handleDeleteConfirm}
                >
                  {isDeleting === jobToDelete._id ? (
                    <LoadingSpinner size={20} className="mr-2" />
                  ) : null}
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-outline mt-3 sm:mt-0"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting === jobToDelete._id}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminJobs;