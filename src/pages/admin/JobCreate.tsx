import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Layout from '../../components/common/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { createJob } from '../../services/jobService';
import { AlertCircle, X } from 'lucide-react';

interface JobFormInputs {
  title: string;
  description: string;
  maxApplications: number;
  newKeyword: string;
}

const JobCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors } 
  } = useForm<JobFormInputs>({
    defaultValues: {
      maxApplications: 100,
      newKeyword: ''
    }
  });
  
  const newKeyword = watch('newKeyword');
  
  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setValue('newKeyword', '');
    }
  };
  
  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };
  
  const onSubmit = async (data: JobFormInputs) => {
    try {
      setLoading(true);
      setError(null);
      
      const { newKeyword, ...jobData } = data;
      
      await createJob({
        ...jobData,
        keywords: keywords,
        isActive: true
      });
      
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/admin')}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-3xl mx-auto">
          <div className="bg-blue-700 text-white p-6">
            <h1 className="text-2xl font-bold">Create New Job Vacancy</h1>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Job Title*
                </label>
                <input
                  id="title"
                  type="text"
                  className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. Senior Software Engineer"
                  {...register('title', { required: 'Job title is required' })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Job Description*
                </label>
                <textarea
                  id="description"
                  rows={6}
                  className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter detailed job description..."
                  {...register('description', { required: 'Job description is required' })}
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="maxApplications" className="block text-gray-700 font-medium mb-2">
                  Maximum Applications
                </label>
                <input
                  id="maxApplications"
                  type="number"
                  min="1"
                  className={`w-full px-3 py-2 border ${errors.maxApplications ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register('maxApplications', { 
                    required: 'Maximum applications is required',
                    min: {
                      value: 1,
                      message: 'Value must be at least 1'
                    }
                  })}
                />
                {errors.maxApplications && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxApplications.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Job post will automatically close when this limit is reached
                </p>
              </div>
              
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">
                  Keywords for CV Scoring
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add a keyword..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('newKeyword')}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <div 
                      key={index} 
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      <span>{keyword}</span>
                      <button 
                        type="button" 
                        onClick={() => removeKeyword(keyword)}
                        className="text-blue-700 hover:text-blue-900 focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {keywords.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      Add keywords to help score candidate CVs (e.g. JavaScript, React, AWS)
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Create Job Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobCreate;