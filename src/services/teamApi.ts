
import api from './api';

// Team interfaces
export interface TeamMember {
  role: 'LEADER' | 'MEMBER';
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface MyTeam {
  id: string;
  name: string;
  invitationCode: string;
  competition: {
    id: string;
    event: {
      id: string;
      title: string;
      status: string;
    };
  };
  members: TeamMember[];
  submission: {
    id: string;
  } | null;
}

export interface MyTeamsResponse {
  success: boolean;
  data: MyTeam[];
}

// Get all teams for the current user
export const getMyTeams = async (): Promise<MyTeam[]> => {
  const response = await api.get<MyTeamsResponse>('/teams/my-teams');
  return response.data.data;
};

// Create a new team
export const createTeam = async (competitionId: string, name: string) => {
  const response = await api.post(`/teams/competitions/${competitionId}`, { name });
  return response.data.data;
};

// Join a team using invitation code
export const joinTeam = async (invitationCode: string) => {
  const response = await api.post('/teams/join', { invitationCode });
  return response.data.data;
};

// Leave a team
export const leaveTeam = async (teamId: string) => {
  const response = await api.post(`/teams/${teamId}/leave`);
  return response.data;
};

// Remove a team member (leader action)
export const removeTeamMember = async (teamId: string, memberId: string) => {
  const response = await api.delete(`/teams/${teamId}/members/${memberId}`);
  return response.data;
};

// Submission interfaces
export interface SubmissionContent {
  url: string;
  description: string;
}

export interface Submission {
  id: string;
  submittedAt: string;
  content: SubmissionContent;
  teamId: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  data: Submission;
}

// Create a submission
export const createSubmission = async (teamId: string, content: SubmissionContent) => {
  const response = await api.post<SubmissionResponse>(`/teams/${teamId}/submission`, {
    content,
  });
  return response.data.data;
};
