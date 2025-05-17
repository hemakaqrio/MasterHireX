import api from '../config/axios';
import { Application, FilteredCandidate } from '../types';

// Candidate services
export const applyToJob = async (jobId: string, formData: FormData): Promise<Application> => {
  const response = await api.post<Application>(`/candidate/apply/${jobId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Admin services
export const getApplications = async (jobId: string): Promise<Application[]> => {
  const response = await api.get<Application[]>(`/admin/applications/${jobId}`);
  return response.data;
};

export const updateApplicationScore = async (
  applicationId: string, 
  score: number
): Promise<Application> => {
  const response = await api.patch<Application>(`/admin/applications/${applicationId}/score`, { score });
  return response.data;
};

export const addToFiltered = async (applicationId: string): Promise<FilteredCandidate> => {
  const response = await api.post<FilteredCandidate>(`/admin/filtered/${applicationId}`);
  return response.data;
};

export const getFilteredCandidates = async (): Promise<FilteredCandidate[]> => {
  const response = await api.get<FilteredCandidate[]>('/admin/filtered');
  return response.data;
};

export const exportFiltered = async (type: 'json' | 'csv'): Promise<Blob> => {
  const response = await api.get(`/admin/filtered/export?type=${type}`, {
    responseType: 'blob',
  });
  return response.data;
};