export const apiUrl = 'http://localhost:5000/api';

export const endpoints = {
  // Auth
  login: '/auth/login',
  signup: '/auth/signup',
  
  // Candidate routes
  candidateJobs: '/candidate/jobs',
  applyJob: (jobId: string) => `/candidate/apply/${jobId}`,
  
  // Admin routes
  adminJobs: '/admin/jobs',
  adminJobLimit: (jobId: string) => `/admin/jobs/${jobId}/limit`,
  adminJobKeywords: (jobId: string) => `/admin/jobs/${jobId}/keywords`,
  adminApplications: (jobId: string) => `/admin/applications/${jobId}`,
  adminFilteredApplication: (appId: string) => `/admin/filtered/${appId}`,
  adminExportFiltered: (type: 'json' | 'csv') => `/admin/filtered/export?type=${type}`,
};