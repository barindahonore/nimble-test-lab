
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { getEventById, Event, EventRegistration, getMyEventRegistration } from '@/services/api';
import { getMyTeams, MyTeam } from '@/services/teamApi';
import { EventHeader } from '@/components/events/EventHeader';
import { EventActions } from '@/components/events/EventActions';
import { CompetitionInfo } from '@/components/events/CompetitionInfo';
import { TeamSection } from '@/components/events/TeamSection';

const StudentEventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [teamStatus, setTeamStatus] = useState<MyTeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Always fetch event details
      const eventData = await getEventById(id);
      setEvent(eventData);
      
      // Only fetch user-specific data if logged in
      if (user) {
        try {
          const registrationData = await getMyEventRegistration(id);
          setRegistration(registrationData);
          
          // If registered and it's a team-based competition, get team info
          if (registrationData && eventData.competition?.isTeamBased) {
            const teams = await getMyTeams();
            const relevantTeam = teams.find(team => 
              team.competition.event.id === eventData.id
            );
            setTeamStatus(relevantTeam || null);
          }
        } catch (userDataError) {
          console.log('User data fetch failed (user may not be registered):', userDataError);
          // Don't set error state for user-specific data failures
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamUpdate = async () => {
    if (!user || !event?.competition?.isTeamBased) return;
    
    try {
      const teams = await getMyTeams();
      const relevantTeam = teams.find(team => 
        team.competition.event.id === event.id
      );
      setTeamStatus(relevantTeam || null);
    } catch (error) {
      console.error('Failed to refresh team data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  if (!id) {
    return <Navigate to="/student/events" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/10 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="animate-pulse space-y-8">
            <div className="h-80 bg-gradient-to-r from-muted/50 to-muted/30 rounded-3xl" />
            <div className="h-32 bg-gradient-to-r from-muted/30 to-muted/20 rounded-2xl" />
            <div className="h-48 bg-gradient-to-r from-muted/40 to-muted/25 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-destructive mb-4">
              {error || 'Event not found'}
            </h2>
            <p className="text-muted-foreground">
              The event you're looking for might have been removed or is currently unavailable.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/10 p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <EventHeader event={event} />
        
        <EventActions
          event={event}
          user={user}
          registrationStatus={registration}
          teamStatus={teamStatus}
          onRegistrationSuccess={fetchData}
        />
        
        {event.competition && (
          <CompetitionInfo competition={event.competition} />
        )}
        
        {user && registration && event.competition && event.competition.id && (
          <TeamSection
            teamStatus={teamStatus}
            isTeamBased={event.competition.isTeamBased}
            competitionId={event.competition.id}
            onTeamUpdate={handleTeamUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default StudentEventDetailPage;
