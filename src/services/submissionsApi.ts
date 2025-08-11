
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface UserSubmission {
  id: string;
  submittedAt: string;
  finalScore: number | null;
  content: {
    url?: string;
    description?: string;
  };
  competition: {
    id: string;
    event: {
      id: string;
      title: string;
    };
  };
  team?: {
    id: string;
    name: string;
  };
}

export const getMySubmissions = async (): Promise<UserSubmission[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/submissions/my`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
};
