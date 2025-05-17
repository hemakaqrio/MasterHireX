import { create } from 'zustand';
import { toast } from 'react-toastify';
import api from '../utils/axios';
import { endpoints } from '../config/constants';

export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salary?: string;
  company: string;
  isActive: boolean;
  maxApplications: number;
  currentApplications: number;
  keywords: {
    term: string;
    weight: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface JobState {
  jobs: Job[];
  publicJobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
  
  // Public actions
  fetchPublicJobs: () => Promise<void>;
  getPublicJob: (id: string) => Promise<Job | null>;
  applyToJob: (jobId: string, cvFile: File) => Promise<boolean>;
  
  // Admin actions
  fetchAdminJobs: () => Promise<void>;
  getAdminJob: (id: string) => Promise<Job | null>;
  createJob: (jobData: Partial<Job>) => Promise<Job | null>;
  updateJob: (id: string, jobData: Partial<Job>) => Promise<Job | null>;
  deleteJob: (id: string) => Promise<boolean>;
  setApplicationLimit: (id: string, limit: number) => Promise<boolean>;
  updateKeywords: (id: string, keywords: { term: string; weight: number }[]) => Promise<boolean>;
}

export const useJobsStore = create<JobState>((set, get) => ({
  jobs: [],
  publicJobs: [],
  currentJob: null,
  loading: false,
  error: null,
  
  // Public actions
  fetchPublicJobs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(endpoints.candidateJobs);
      set({ publicJobs: response.data, loading: false });
    } catch (error) {
      set({ 
        error: 'Failed to fetch jobs',
        loading: false,
      });
      toast.error('Failed to fetch jobs');
    }
  },
  
  getPublicJob: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // First check if we already have the job in the store
      const existingJob = get().publicJobs.find(job => job._id === id);
      if (existingJob) {
        set({ currentJob: existingJob, loading: false });
        return existingJob;
      }
      
      // Otherwise fetch it
      const response = await api.get(`${endpoints.candidateJobs}/${id}`);
      set({ currentJob: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: 'Failed to fetch job details',
        loading: false,
      });
      toast.error('Failed to fetch job details');
      return null;
    }
  },
  
  applyToJob: async (jobId: string, cvFile: File) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      
      await api.post(
        endpoints.applyJob(jobId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      set({ loading: false });
      toast.success('Application submitted successfully');
      return true;
    } catch (error) {
      let message = 'Failed to submit application';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
  
  // Admin actions
  fetchAdminJobs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(endpoints.adminJobs);
      set({ jobs: response.data, loading: false });
    } catch (error) {
      set({ 
        error: 'Failed to fetch jobs',
        loading: false,
      });
      toast.error('Failed to fetch jobs');
    }
  },
  
  getAdminJob: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // First check if we already have the job in the store
      const existingJob = get().jobs.find(job => job._id === id);
      if (existingJob) {
        set({ currentJob: existingJob, loading: false });
        return existingJob;
      }
      
      // Otherwise fetch it
      const response = await api.get(`${endpoints.adminJobs}/${id}`);
      set({ currentJob: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: 'Failed to fetch job details',
        loading: false,
      });
      toast.error('Failed to fetch job details');
      return null;
    }
  },
  
  createJob: async (jobData: Partial<Job>) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(endpoints.adminJobs, jobData);
      
      // Update jobs list
      const updatedJobs = [...get().jobs, response.data];
      set({ jobs: updatedJobs, loading: false });
      
      toast.success('Job created successfully');
      return response.data;
    } catch (error) {
      let message = 'Failed to create job';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },
  
  updateJob: async (id: string, jobData: Partial<Job>) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`${endpoints.adminJobs}/${id}`, jobData);
      
      // Update jobs list
      const updatedJobs = get().jobs.map(job => 
        job._id === id ? response.data : job
      );
      
      set({ 
        jobs: updatedJobs,
        currentJob: response.data,
        loading: false,
      });
      
      toast.success('Job updated successfully');
      return response.data;
    } catch (error) {
      let message = 'Failed to update job';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },
  
  deleteJob: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`${endpoints.adminJobs}/${id}`);
      
      // Update jobs list
      const updatedJobs = get().jobs.filter(job => job._id !== id);
      set({ jobs: updatedJobs, loading: false });
      
      toast.success('Job deleted successfully');
      return true;
    } catch (error) {
      let message = 'Failed to delete job';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
  
  setApplicationLimit: async (id: string, limit: number) => {
    set({ loading: true, error: null });
    try {
      await api.patch(endpoints.adminJobLimit(id), { limit });
      
      // Update job in the list
      const updatedJobs = get().jobs.map(job => 
        job._id === id ? { ...job, maxApplications: limit } : job
      );
      
      set({ jobs: updatedJobs, loading: false });
      
      toast.success('Application limit updated successfully');
      return true;
    } catch (error) {
      let message = 'Failed to update application limit';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
  
  updateKeywords: async (id: string, keywords: { term: string; weight: number }[]) => {
    set({ loading: true, error: null });
    try {
      await api.post(endpoints.adminJobKeywords(id), { keywords });
      
      // Update job in the list
      const updatedJobs = get().jobs.map(job => 
        job._id === id ? { ...job, keywords } : job
      );
      
      set({ jobs: updatedJobs, loading: false });
      
      toast.success('Keywords updated successfully');
      return true;
    } catch (error) {
      let message = 'Failed to update keywords';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
}));