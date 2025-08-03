
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, ArrowRight, AlertCircle, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

interface Competition {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  submissionsAwaitingEvaluation: number;
  totalSubmissions?: number;
}

const EventsPage: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get('/dashboard');
        
        if (response.data.success) {
          setCompetitions(response.data.data.competitionsToJudge || []);
        } else {
          throw new Error(response.data.message || 'Failed to fetch competitions');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to load competitions';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetitions();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published": return "bg-green-50 text-green-700 border-green-200";
      case "draft": return "bg-gray-50 text-gray-700 border-gray-200";
      case "in_progress": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "completed": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "published": return <Calendar className="w-4 h-4" />;
      case "in_progress": return <Clock className="w-4 h-4" />;
      case "completed": return <Trophy className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleStartJudging = (competitionId: string) => {
    navigate(`/judge/competitions/${competitionId}/evaluate`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Event Judging</h1>
            <p className="text-muted-foreground">Your assigned competitions and evaluations</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading competitions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Event Judging</h1>
            <p className="text-muted-foreground">Your assigned competitions and evaluations</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Failed to Load</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Judging</h1>
          <p className="text-muted-foreground">Your assigned competitions and evaluations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {competitions.length} competitions
          </Badge>
          <Badge variant="outline">
            {competitions.reduce((sum, comp) => sum + comp.submissionsAwaitingEvaluation, 0)} pending evaluations
          </Badge>
        </div>
      </div>

      {competitions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Competitions Assigned</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You don't have any competitions assigned for judging at the moment. Check back later or contact an administrator.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {competitions.map((competition) => (
            <Card key={competition.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{competition.title}</CardTitle>
                    <CardDescription className="mt-1">{competition.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className={getStatusColor(competition.status)}>
                    {getStatusIcon(competition.status)}
                    <span className="ml-1">{competition.status.toLowerCase().replace('_', ' ')}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(competition.startTime).toLocaleDateString()} - {new Date(competition.endTime).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {competition.totalSubmissions || competition.submissionsAwaitingEvaluation} submissions
                  </div>
                </div>

                {competition.submissionsAwaitingEvaluation > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 dark:bg-orange-900/20 dark:border-orange-800">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        {competition.submissionsAwaitingEvaluation} submission{competition.submissionsAwaitingEvaluation > 1 ? 's' : ''} awaiting evaluation
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {/* Could add view details functionality */}}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleStartJudging(competition.id)}
                    disabled={competition.submissionsAwaitingEvaluation === 0}
                    className="flex items-center"
                  >
                    {competition.submissionsAwaitingEvaluation > 0 ? 'Start Judging' : 'All Evaluated'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
