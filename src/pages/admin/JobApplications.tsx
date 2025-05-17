import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Check, 
  Edit2, 
  File, 
  Filter,
  ThumbsUp,
  ThumbsDown,
  UserCheck,
  Users
} from 'lucide-react';
import { useJobsStore } from '../../store/jobsStore';
import { useApplicationsStore, Application } from '../../store/applicationsStore';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const JobApplications = () => {
  const { id } = useParams<{ id: string }>();
  const { getAdminJob, currentJob, loading: jobLoading } = useJobsStore();
  const { 
    fetchApplications, 
    applications, 
    loading: applicationsLoading,
    updateScore,
    filterApplication
  } = useApplicationsStore();
  
  const [editingScore, setEditingScore] = useState<string | null>(null);
  const [scoreValue, setScoreValue] = useState<number>(0);
  const [processingFilter, setProcessingFilter] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      getAdminJob(id);
      fetchApplications(id);
    }
  }, [id, getAdminJob, fetchApplications]);
  
  const handleScoreEdit = (application: Application) => {
    setEditingScore(application._id);
    setScoreValue(application.score);
  };
  
  const handleScoreSave = async (applicationId: string) => {
    try {
      await updateScore(applicationId, scoreValue);
      setEditingScore(null);
    } catch (error) {
      toast.error('Failed to update score');
    }
  };
  
  const handleFilterCandidate = async (applicationId: string) => {
    setProcessingFilter(applicationId);
    try {
      await filterApplication(applicationId);
      toast.success('Candidate added to filtered list');
    } catch (error) {
      toast.error('Failed to filter candidate');
    } finally {
      setProcessingFilter(null);
    }
  };
  
  const loading = jobLoading || applicationsLoading;
  
  if (loading && !currentJob) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }
  
  if (!currentJob) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Job not found</h3>
        <p className="mt-1 text-gray-500">
          The job you're looking for does not exist or has been deleted.
        </p>
        <div className="mt-6">
          <Link to="/admin/jobs" className="btn btn-primary">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/jobs" className="inline-flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900">{currentJob.title}</h1>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <span>{currentJob.company}</span>
          <span className="mx-2">•</span>
          <span>{currentJob.location}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Applications</h2>
            </div>
            
            {applicationsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <LoadingSpinner size={32} />
              </div>
            ) : applications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No one has applied to this position yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CV
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied On
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                              {application.candidateEmail.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {application.candidateEmail}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {application.candidateId.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a 
                            href={application.cvUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:text-primary/80"
                          >
                            <File className="h-4 w-4 mr-1" />
                            View CV
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingScore === application._id ? (
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={scoreValue}
                                onChange={(e) => setScoreValue(parseInt(e.target.value))}
                                className="input w-20 mr-2"
                              />
                              <button
                                onClick={() => handleScoreSave(application._id)}
                                className="text-green-600 hover:text-green-800"
                                title="Save"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <div 
                                className={`font-medium ${
                                  application.score >= 70 
                                    ? 'text-green-600' 
                                    : application.score >= 40 
                                    ? 'text-yellow-600' 
                                    : 'text-red-600'
                                }`}
                              >
                                {application.score}%
                              </div>
                              <button
                                onClick={() => handleScoreEdit(application)}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                                title="Edit Score"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <a
                              href={application.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700"
                              title="Download CV"
                            >
                              <Download className="h-5 w-5" />
                            </a>
                            {application.status === 'filtered' ? (
                              <span className="inline-flex items-center text-green-600" title="Already Filtered">
                                <UserCheck className="h-5 w-5" />
                              </span>
                            ) : (
                              <button
                                onClick={() => handleFilterCandidate(application._id)}
                                className="text-gray-500 hover:text-primary"
                                title="Add to Filtered List"
                                disabled={processingFilter === application._id}
                              >
                                {processingFilter === application._id ? (
                                  <LoadingSpinner size={20} />
                                ) : (
                                  <Filter className="h-5 w-5" />
                                )}
                              </button>
                            )}
                            <button
                              className="text-gray-500 hover:text-green-600"
                              title="Approve"
                            >
                              <ThumbsUp className="h-5 w-5" />
                            </button>
                            <button
                              className="text-gray-500 hover:text-red-600"
                              title="Reject"
                            >
                              <ThumbsDown className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Job Details</h2>
            </div>
            <div className="p-6">
              <dl className="divide-y divide-gray-200">
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      currentJob.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentJob.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Applications</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {currentJob.currentApplications} / {currentJob.maxApplications}
                  </dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="text-sm font-medium text-gray-900">{currentJob.company}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="text-sm font-medium text-gray-900">{currentJob.location}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Posted On</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {format(new Date(currentJob.createdAt), 'MMMM dd, yyyy')}
                  </dd>
                </div>
              </dl>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Keywords</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentJob.keywords && currentJob.keywords.length > 0 ? (
                    currentJob.keywords.map((keyword, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {keyword.term} ({keyword.weight})
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No keywords defined</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <Link
                  to={`/admin/jobs/edit/${currentJob._id}`}
                  className="btn btn-outline flex-1"
                >
                  Edit Job
                </Link>
                <Link
                  to={`/candidate/jobs/${currentJob._id}`}
                  target="_blank"
                  className="btn btn-outline flex-1"
                >
                  View Public Post
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplications;