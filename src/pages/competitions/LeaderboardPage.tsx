import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Award, Users, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LeaderboardTable from '@/components/competitions/LeaderboardTable';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

interface Competition {
  id: string;
  event: {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    status: string;
  };
  isTeamBased: boolean;
  judgingCriteria: Array<{
    name: string;
    maxScore: number;
  }>;
}

interface LeaderboardEntry {
  id: string;
  score: number;
  rank: number;
  user?: {
    firstName: string;
    lastName: string;
  };
  team?: {
    name: string;
    members: Array<{
      firstName: string;
      lastName: string;
    }>;
  };
}

const LeaderboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: competition, isLoading: competitionLoading } = useQuery({
    queryKey: ['competition', id],
    queryFn: async () => {
      const response = await api.get(`/competitions/${id}`);
      return response.data.data as Competition;
    },
    enabled: !!id,
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['leaderboard', id],
    queryFn: async () => {
      const response = await api.get(`/competitions/${id}/leaderboard`);
      return response.data.data as LeaderboardEntry[];
    },
    enabled: !!id,
  });

  if (competitionLoading || leaderboardLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Competition Not Found</h1>
          <p className="text-gray-600">The competition you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const maxPossibleScore = competition.judgingCriteria.reduce((total, criterion) => total + criterion.maxScore, 0);

  // Render content that works both in and outside of student layout
  const content = (
    <div className="space-y-6">
      {/* Competition Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">{competition.event.title}</h1>
            <p className="text-blue-100">Competition Leaderboard</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {new Date(competition.event.startTime).toLocaleDateString()} - {new Date(competition.event.endTime).toLocaleDateString()}
            </span>
          </div>
          {competition.event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{competition.event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              {competition.isTeamBased ? 'Team Competition' : 'Individual Competition'}
            </span>
          </div>
        </div>
      </div>

      {/* Competition Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboard?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Possible Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maxPossibleScore}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competition Status</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={competition.event.status === 'PUBLISHED' ? 'default' : 'secondary'}>
              {competition.event.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Judging Criteria */}
      <Card>
        <CardHeader>
          <CardTitle>Judging Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competition.judgingCriteria.map((criterion, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{criterion.name}</span>
                <Badge variant="outline">{criterion.maxScore} pts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard && leaderboard.length > 0 ? (
            <LeaderboardTable leaderboardData={leaderboard} />
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No submissions have been evaluated yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // If user is a student, wrap in container for student layout compatibility
  if (user?.role === 'STUDENT') {
    return (
      <div className="container mx-auto px-6 py-6">
        {content}
      </div>
    );
  }

  // For non-students or unauthenticated users, use full container
  return (
    <div className="container mx-auto px-4 py-8">
      {content}
    </div>
  );
};

export default LeaderboardPage;
