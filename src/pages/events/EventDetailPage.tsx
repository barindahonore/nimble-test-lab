
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getEventById, Event, EventRegistration, getMyEventRegistration } from '@/services/api';
import { getMyTeams, MyTeam } from '@/services/teamApi';
import { getMySubmissions, UserSubmission } from '@/services/submissionsApi';
import { EventHeader } from '@/components/events/EventHeader';
import { EventActions } from '@/components/events/EventActions';
import { CompetitionInfo } from '@/components/events/CompetitionInfo';
import { CompetitionMainSection } from '@/components/events/CompetitionMainSection';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [teamStatus, setTeamStatus] = useState<MyTeam | null>(null);
  const [userSubmission, setUserSubmission] = useState<UserSubmission | null>(null);
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
          
          // If registered, get additional user data
          if (registrationData) {
            // Get user's submissions to check for individual submissions
            const submissions = await getMySubmissions();
            const relevantSubmission = submissions.find(sub => 
              sub.competition.id === eventData.competition?.id
            );
            setUserSubmission(relevantSubmission || null);
            
            // If it's a team-based competition, get team info
            if (eventData.competition?.isTeamBased) {
              const teams = await getMyTeams();
              const relevantTeam = teams.find(team => 
                team.competition.event.id === eventData.id
              );
              setTeamStatus(relevantTeam || null);
            }
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

  const handleRegistrationSuccess = async () => {
    await fetchData();
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

  const handleSubmissionUpdate = async () => {
    if (!user || !event?.competition) return;
    
    try {
      const submissions = await getMySubmissions();
      const relevantSubmission = submissions.find(sub => 
        sub.competition.id === event.competition?.id
      );
      setUserSubmission(relevantSubmission || null);
    } catch (error) {
      console.error('Failed to refresh submission data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  if (!id) {
    return <Navigate to="/events" replace />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-40 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            {error || 'Event not found'}
          </h2>
          <p className="text-muted-foreground">
            The event you're looking for might have been removed or is currently unavailable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <EventHeader event={event} />
        
        <EventActions
          event={event}
          user={user}
          registrationStatus={registration}
          teamStatus={teamStatus}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
        
        {event.competition && (
          <CompetitionInfo 
            competition={event.competition} 
            eventEndTime={event.endTime}
          />
        )}
        
        {user && registration && event.competition && (
          <CompetitionMainSection
            event={event}
            teamStatus={teamStatus}
            userSubmission={userSubmission}
            competitionId={event.competition.id}
            onTeamUpdate={handleTeamUpdate}
            onSubmissionUpdate={handleSubmissionUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
