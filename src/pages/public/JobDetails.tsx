import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Building, Calendar, AlertCircle, ArrowLeft, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useJobsStore } from '../../store/jobsStore';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getPublicJob, currentJob, loading, applyToJob } = useJobsStore();
  const { isAuthenticated } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (id) {
      getPublicJob(id);
    }
  }, [id, getPublicJob]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      // Check if file is a PDF
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size cannot exceed 5MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };
  
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to apply for this job');
      return;
    }
    
    if (!file) {
      toast.error('Please upload your CV');
      return;
    }
    
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await applyToJob(id, file);
      if (success) {
        setSubmitted(true);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }
  
  if (!currentJob) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-error mx-auto" />
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Job Not Found</h2>
          <p className="mt-2 text-gray-600">
            The job posting you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link to="/candidate/jobs" className="btn btn-primary">
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/candidate/jobs" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to job listings
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentJob.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-y-2 gap-x-4 mt-2">
                <div className="flex items-center">
                  <Building className="mr-1.5 h-4 w-4" />
                  {currentJob.company}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-1.5 h-4 w-4" />
                  {currentJob.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1.5 h-4 w-4" />
                  Posted {format(new Date(currentJob.createdAt), 'MMMM dd, yyyy')}
                </div>
              </div>
              
              {currentJob.maxApplications > 0 && (
                <div className="mt-3 text-sm">
                  <span className="text-accent font-medium">
                    {currentJob.maxApplications - currentJob.currentApplications} spots remaining
                  </span>
                  {' '}of {currentJob.maxApplications} total positions
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose text-gray-700 mb-6 whitespace-pre-line">
                {currentJob.description}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {currentJob.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
            
            {currentJob.maxApplications <= currentJob.currentApplications ? (
              <div className="border-t border-gray-200 mt-8 pt-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Applications Closed</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          This position has reached its maximum number of applications. 
                          Please check other available positions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : submitted ? (
              <div className="border-t border-gray-200 mt-8 pt-6">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Application Submitted</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          Your application has been successfully submitted. 
                          We'll review your CV and get back to you soon.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 mt-8 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply for this Position</h2>
                
                {!isAuthenticated ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                    <p className="text-sm text-blue-700">
                      Please <Link to="/login" className="font-medium underline">login</Link> or{' '}
                      <Link to="/signup" className="font-medium underline">create an account</Link> to apply for this job.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
                        Upload your CV (PDF, max 5MB)
                      </label>
                      <div className="mt-1 flex items-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                          <span className="btn btn-outline flex items-center">
                            <Upload className="mr-2 h-4 w-4" />
                            {file ? 'Change file' : 'Select file'}
                          </span>
                          <input
                            id="cv"
                            name="cv"
                            type="file"
                            accept=".pdf"
                            className="sr-only"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                        {file && (
                          <span className="ml-3 text-sm text-gray-500">
                            {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Our AI will analyze your CV to match you with the job requirements.
                      </p>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting || !file}
                        className="btn btn-primary w-full sm:w-auto flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;