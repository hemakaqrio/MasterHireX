export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'candidate';
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  keywords?: string[];
  maxApplications: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  candidate: User;
  job: Job | string;
  cvUrl: string;
  score: number;
  extractedText: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilteredCandidate {
  _id: string;
  application: Application | string;
  manuallySelected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: 'admin' | 'candidate') => Promise<void>;
  logout: () => void;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}