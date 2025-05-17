import { create } from 'zustand';
import { toast } from 'react-toastify';
import api from '../utils/axios';
import { endpoints } from '../config/constants';

export interface Application {
  _id: string;
  jobId: string;
  candidateId: string;
  candidateEmail: string;
  cvUrl: string;
  score: number;
  status: 'pending' | 'filtered' | 'rejected';
  extractedText?: string;
  matchedKeywords?: {
    term: string;
    count: number;
    weight: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ApplicationsState {
  applications: Application[];
  filteredApplications: Application[];
  currentApplication: Application | null;
  loading: boolean;
  error: string | null;
  
  // Admin actions
  fetchApplications: (jobId: string) => Promise<void>;
  getApplication: (appId: string) => Promise<Application | null>;
  updateScore: (appId: string, score: number) => Promise<boolean>;
  filterApplication: (appId: string) => Promise<boolean>;
  fetchFilteredApplications: () => Promise<void>;
  exportFilteredApplications: (type: 'json' | 'csv') => Promise<void>;
}

export const useApplicationsStore = create<ApplicationsState>((set, get) => ({
  applications: [],
  filteredApplications: [],
  currentApplication: null,
  loading: false,
  error: null,
  
  fetchApplications: async (jobId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(endpoints.adminApplications(jobId));
      set({ applications: response.data, loading: false });
    } catch (error) {
      set({ 
        error: 'Failed to fetch applications',
        loading: false,
      });
      toast.error('Failed to fetch applications');
    }
  },
  
  getApplication: async (appId: string) => {
    set({ loading: true, error: null });
    try {
      // First check if we already have the application in the store
      const existingApp = get().applications.find(app => app._id === appId);
      if (existingApp) {
        set({ currentApplication: existingApp, loading: false });
        return existingApp;
      }
      
      // Otherwise fetch it
      const response = await api.get(`/admin/applications/detail/${appId}`);
      set({ currentApplication: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: 'Failed to fetch application details',
        loading: false,
      });
      toast.error('Failed to fetch application details');
      return null;
    }
  },
  
  updateScore: async (appId: string, score: number) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/admin/applications/${appId}/score`, { score });
      
      // Update application in the list
      const updatedApplications = get().applications.map(app => 
        app._id === appId ? { ...app, score } : app
      );
      
      set({ applications: updatedApplications, loading: false });
      
      toast.success('Score updated successfully');
      return true;
    } catch (error) {
      let message = 'Failed to update score';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
  
  filterApplication: async (appId: string) => {
    set({ loading: true, error: null });
    try {
      await api.post(endpoints.adminFilteredApplication(appId));
      
      // Update application in the list
      const updatedApplications = get().applications.map(app => 
        app._id === appId ? { ...app, status: 'filtered' } : app
      );
      
      set({ applications: updatedApplications, loading: false });
      
      toast.success('Application added to filtered list');
      return true;
    } catch (error) {
      let message = 'Failed to filter application';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
  
  fetchFilteredApplications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/admin/filtered');
      set({ filteredApplications: response.data, loading: false });
    } catch (error) {
      set({ 
        error: 'Failed to fetch filtered applications',
        loading: false,
      });
      toast.error('Failed to fetch filtered applications');
    }
  },
  
  exportFilteredApplications: async (type: 'json' | 'csv') => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        endpoints.adminExportFiltered(type),
        { responseType: 'blob' }
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `filtered-candidates.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      set({ loading: false });
      toast.success(`Exported successfully as ${type.toUpperCase()}`);
    } catch (error) {
      set({ 
        error: 'Failed to export data',
        loading: false,
      });
      toast.error('Failed to export data');
    }
  },
}));