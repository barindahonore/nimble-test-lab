import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://vierry-api.ishimwe.rw/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const getDashboardData = async () => {
  const response = await api.get('/dashboard');
  return response.data.data;
};

// User Profile API
export const getUserProfile = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data.data;
};

export const updateUserProfile = async (userId: string, data: { firstName: string; lastName: string }) => {
  const response = await api.patch(`/users/me`, data);
  return response.data.data;
};

// Judge Creation API
export const createJudge = async (judgeData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const response = await api.post('/users/judges', judgeData);
  return response.data.data;
};

// User Management API
export interface UserFilters {
  name?: string;
  email?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  role: { name: 'ADMIN' | 'JUDGE' | 'STUDENT' };
  createdAt: string;
}

export interface Role {
  id: number;
  name: string;
}

export const getAllUsers = async (filters: UserFilters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.name) params.append('name', filters.name);
  if (filters.email) params.append('email', filters.email);
  if (filters.role) params.append('role', filters.role);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await api.get(`/users?${params}`);
  return response.data;
};

export const updateUser = async (userId: string, data: { roleId?: number; status?: string }) => {
  const response = await api.patch(`/users/${userId}`, data);
  return response.data.data;
};

export const getAllRoles = async (): Promise<Role[]> => {
  const response = await api.get('/roles');
  return response.data.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// Event Management API
export interface EventFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface JudgingCriterion {
  id?: string;
  name: string;
  description?: string;
  weight?: number; // Keep for backward compatibility with forms
  maxScore?: number; // Add for API response compatibility
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  maxParticipants?: number;
  organizer: {
    firstName: string;
    lastName: string;
  };
  competition: Competition | null;
  createdAt: string;
}

export interface Competition {
  id: string;
  isTeamBased: boolean;
  teamSize?: number;
  minTeamSize?: number;
  maxTeamSize?: number;
  judgingCriteria?: JudgingCriterion[];
}

export interface Registration {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  registeredAt: string;
}

// Updated Judge interface to match the actual API response
export interface Judge {
  competitionId: string;
  judgeId: string;
  assignedAt: string;
  judge: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface TeamMember {
  teamId: string;
  userId: string;
  role: 'LEADER' | 'MEMBER';
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface Team {
  id: string;
  name: string;
  invitationCode: string;
  createdAt: string;
  updatedAt: string;
  competitionId: string;
  members: TeamMember[];
}

export interface Submission {
  id: string;
  team: {
    name: string;
  };
  submittedAt: string;
  status: 'PENDING' | 'REVIEWED' | 'SCORED';
  finalScore?: number;
}

export const getAllEvents = async (filters: EventFilters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await api.get(`/events?${params}`);
  return response.data;
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'organizer' | 'competition' | 'createdAt'>) => {
  const response = await api.post('/events', eventData);
  return response.data.data;
};

export const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
  const response = await api.patch(`/events/${eventId}`, eventData);
  return response.data.data;
};

export const deleteEvent = async (eventId: string) => {
  const response = await api.delete(`/events/${eventId}`);
  return response.data;
};

export const getEventRegistrations = async (eventId: string): Promise<Registration[]> => {
  const response = await api.get(`/events/${eventId}/registrations`);
  return response.data.data;
};

export const createCompetition = async (eventId: string, competitionData: {
  isTeamBased: boolean;
  teamSize?: number;
  judgingCriteria?: string;
}) => {
  const response = await api.post(`/events/${eventId}/competition`, competitionData);
  return response.data.data;
};

export const updateCompetition = async (eventId: string, competitionData: Partial<Competition>) => {
  const response = await api.patch(`/events/${eventId}/competition`, competitionData);
  return response.data.data;
};

export const getCompetitionJudges = async (competitionId: string): Promise<Judge[]> => {
  console.log('API call - getCompetitionJudges for competition:', competitionId);
  const response = await api.get(`/competitions/${competitionId}/judges`);
  console.log('API response for judges:', response.data);
  return response.data.data;
};

export const assignJudge = async (competitionId: string, judgeData: { judgeId: string }) => {
  const response = await api.post(`/competitions/${competitionId}/judges`, judgeData);
  return response.data.data;
};

export const removeJudge = async (competitionId: string, judgeId: string) => {
  const response = await api.delete(`/competitions/${competitionId}/judges/${judgeId}`);
  return response.data;
};

export const getCompetitionTeams = async (competitionId: string): Promise<Team[]> => {
  console.log('API call - getCompetitionTeams for competition:', competitionId);
  const response = await api.get(`/competitions/${competitionId}/teams`);
  console.log('API response for teams:', response.data);
  return response.data.data;
};

export const getCompetitionSubmissions = async (competitionId: string): Promise<Submission[]> => {
  const response = await api.get(`/competitions/${competitionId}/submissions`);
  return response.data.data;
};

// Judge Evaluation API
export interface SubmissionDetail {
  id: string;
  content: {
    url?: string;
    description?: string;
  };
  team: {
    name: string;
  };
  submittedAt: string;
  status: 'PENDING' | 'REVIEWED' | 'SCORED';
  finalScore?: number;
}

export interface EvaluationData {
  scores: Record<string, number>;
  comments: string;
}

export const getSubmissionDetail = async (submissionId: string): Promise<SubmissionDetail> => {
  const response = await api.get(`/submissions/${submissionId}`);
  return response.data.data;
};

export const submitEvaluation = async (submissionId: string, evaluationData: EvaluationData) => {
  const response = await api.post(`/submissions/${submissionId}/evaluations`, evaluationData);
  return response.data.data;
};

export const getEventById = async (eventId: string): Promise<Event> => {
  const response = await api.get(`/events/${eventId}`);
  return response.data.data;
};

// Registration interfaces
export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
}

export interface EventRegistrationResponse {
  success: boolean;
  data: EventRegistration;
}

// Event registration endpoints
export const registerForEvent = async (eventId: string) => {
  const response = await api.post<EventRegistrationResponse>(`/events/${eventId}/register`);
  return response.data.data;
};

export const getMyEventRegistration = async (eventId: string): Promise<EventRegistration | null> => {
  try {
    const response = await api.get<EventRegistrationResponse>(`/events/${eventId}/registration/me`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export default api;
