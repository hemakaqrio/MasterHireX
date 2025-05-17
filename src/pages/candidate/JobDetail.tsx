import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getJob } from '../../services/jobService';
import { applyToJob } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/common/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Job } from '../../types';
import { Calendar, Users, AlertCircle, Upload, FileText, CheckCircle } from 'lucide-react';

interface ApplyFormInputs {
  cv: FileList;
}

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ApplyFormInputs>();
  
  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedJob = await getJob(id);
        setJob(fetchedJob);
      } catch (err) {
        console.error(err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const onSubmit = async (data: ApplyFormInputs) => {
    if (!id || !isAuthenticated) return;
    
    try {
      setApplying(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('cv', data.cv[0]);
      
      await applyToJob(id, formData);
      setSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Application failed. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10 text-center">
          <div className="bg-red-50 text-red-700 p-6 rounded-lg inline-block">
            <AlertCircle size={40} className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Job</h2>
            <p>{error || 'Job not found'}</p>
            <button 
              onClick={() => navigate('/candidate')}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Return to Jobs
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      {success && (
        <div className="bg-green-50 p-4 border-l-4 border-green-500">
          <div className="container mx-auto px-4 flex items-start gap-3">
            <CheckCircle size={24} className="text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800">Application Submitted!</h3>
              <p className="text-green-700">
                Your application for {job.title} has been successfully submitted. We'll review your CV and get back to you.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/candidate')}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Back to Jobs
          </button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-700 text-white p-6">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {job.isActive ? 'Active' : 'Closed'}
            </div>
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Posted: {formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Applications Limit: {job.maxApplications}</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Job Description</h2>
              <div className="text-gray-700 prose max-w-none whitespace-pre-line">
                {job.description}
              </div>
            </div>
            
            {job.keywords && job.keywords.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Key Skills & Requirements</h2>
                <div className="flex flex-wrap gap-2">
                  {job.keywords.map((keyword, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {job.isActive ? (
              <div className="mt-8 border-t pt-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Apply for this Position</h2>
                
                {!isAuthenticated ? (
                  <div className="bg-yellow-50 p-4 rounded-md mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={24} className="text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-800">Authentication Required</h3>
                        <p className="text-yellow-700 mb-2">
                          You need to be logged in as a candidate to apply for this position.
                        </p>
                        <div className="flex gap-3 mt-2">
                          <button 
                            onClick={() => navigate('/login')}
                            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                          >
                            Log In
                          </button>
                          <button 
                            onClick={() => navigate('/signup')}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            Sign Up
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : user?.role !== 'candidate' ? (
                  <div className="bg-yellow-50 p-4 rounded-md mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={24} className="text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-800">Admin Cannot Apply</h3>
                        <p className="text-yellow-700">
                          Admin accounts cannot apply for jobs. Please use a candidate account to apply.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : success ? (
                  <div className="bg-blue-50 p-6 rounded-md text-center">
                    <CheckCircle size={40} className="mx-auto mb-4 text-blue-600" />
                    <h3 className="font-semibold text-lg text-blue-800 mb-2">Application Submitted</h3>
                    <p className="text-blue-700">
                      Your application has been successfully submitted. We'll review your CV and get back to you soon.
                    </p>
                    <button 
                      onClick={() => navigate('/candidate')}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Browse More Jobs
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-start gap-3">
                        <AlertCircle size={20} className="mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}
                  
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Upload Your CV (PDF format)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          id="cv"
                          className="hidden"
                          accept=".pdf"
                          {...register('cv', { 
                            required: 'CV is required',
                            validate: {
                              isPDF: files => 
                                files[0]?.type === 'application/pdf' || 
                                'Only PDF files are accepted'
                            }
                          })}
                        />
                        <label htmlFor="cv" className="cursor-pointer flex flex-col items-center">
                          <Upload size={40} className="text-gray-400 mb-3" />
                          <span className="text-gray-600 mb-1">Click to upload your CV</span>
                          <span className="text-gray-400 text-sm">PDF files only, max 5MB</span>
                        </label>
                      </div>
                      {errors.cv && (
                        <p className="mt-2 text-sm text-red-600">{errors.cv.message}</p>
                      )}
                    </div>
                  
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => navigate('/candidate')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={applying}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {applying ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <FileText size={18} />
                            <span>Submit Application</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="mt-8 bg-red-50 p-6 rounded-md text-center">
                <AlertCircle size={40} className="mx-auto mb-4 text-red-600" />
                <h3 className="font-semibold text-lg text-red-800 mb-2">Applications Closed</h3>
                <p className="text-red-700">
                  This job posting is no longer accepting applications. Please check other available positions.
                </p>
                <button 
                  onClick={() => navigate('/candidate')}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Browse Other Jobs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;