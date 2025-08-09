
import api from './api';

export interface UserSubmission {
  id: string;
  submittedAt: string;
  finalScore?: number;
  team?: {
    name: string;
  };
  submitter?: {
    id: string;
  };
  competition: {
    id: string;
    event: {
      title: string;
    };
  };
  content?: {
    url?: string;
    description?: string;
  };
}

export interface UserSubmissionsResponse {
  success: boolean;
  data: UserSubmission[];
}

export const getMySubmissions = async (): Promise<UserSubmission[]> => {
  const response = await api.get<UserSubmissionsResponse>('/submissions/me');
  return response.data.data;
};
