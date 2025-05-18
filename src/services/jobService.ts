import api from '../config/axios';
import { Job } from '../types';

export const getJobs = async (): Promise<Job[]> => {
  const response = await api.get<Job[]>('/candidate/jobs');
  return response.data;
};

export const getJob = async (id: string): Promise<Job> => {
  const response = await api.get<Job>(`/admin/jobs/${id}`);
  return response.data;
};

// Admin services
export const getAllJobs = async (): Promise<Job[]> => {
  const response = await api.get<Job[]>('/admin/jobs');
  return response.data;
};

export const createJob = async (job: Partial<Job>): Promise<Job> => {
  const response = await api.post<Job>('/admin/jobs', job);
  return response.data;
};

export const updateJob = async (id: string, job: Partial<Job>): Promise<Job> => {
  const response = await api.patch<Job>(`/admin/jobs/${id}`, job);
  return response.data;
};

export const setJobLimit = async (id: string, maxApplications: number): Promise<Job> => {
  const response = await api.patch<Job>(`/admin/jobs/${id}/limit`, { maxApplications });
  return response.data;
};

export const addKeywords = async (id: string, keywords: string[]): Promise<Job> => {
  const response = await api.post<Job>(`/admin/jobs/${id}/keywords`, { keywords });
  return response.data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await api.delete(`/admin/jobs/${id}`);
};