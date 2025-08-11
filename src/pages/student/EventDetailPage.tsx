import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Users, Clock, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import EventActions from '@/components/events/EventActions';
import EventHeader from '@/components/events/EventHeader';
import CompetitionInfo from '@/components/events/CompetitionInfo';
import { useAuth } from '@/context/AuthContext';
import { getEventById, getEventRegistrationStatus } from '@/services/api';
import { getMyTeamForEvent } from '@/services/teamApi';
import { formatDate } from '@/lib/utils';

const StudentEventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();

  const { data: event, isLoading: isEventLoading, error: eventError } = useQuery(
    ['event', eventId],
    () => getEventById(eventId!),
    {
      retry: false,
    }
  );

  const { data: registrationStatus, isLoading: isRegistrationLoading, refetch: refetchRegistration } = useQuery(
    ['registrationStatus', eventId, user?.id],
    () => getEventRegistrationStatus(eventId!),
    {
      enabled: !!user && !!eventId,
      retry: false,
    }
  );

  const { data: teamStatus, isLoading: isTeamLoading, refetch: refetchTeam } = useQuery(
    ['teamStatus', eventId, user?.id],
    () => getMyTeamForEvent(eventId!),
    {
      enabled: !!user && !!eventId && !!event?.competition?.isTeamBased,
      retry: false,
    }
  );

  const handleRegistrationSuccess = () => {
    refetchRegistration();
    refetchTeam();
  };

  if (isEventLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-80" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-4 w-80" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (eventError) {
    return (
      <Card>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load event. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!event) {
    return (
      <Card>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Event not found.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto mt-6 p-4">
      <EventHeader event={event} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* Event Details */}
          <Card className="bg-white shadow rounded-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{formatDate(event.startTime)} - {formatDate(event.endTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                {event.competition && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <span>{event.competition.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{event.capacity === 0 ? 'Unlimited' : event.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{event.duration}</span>
                </div>
                <div className="prose">
                  {event.description}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competition Information */}
          {event.competition && (
            <CompetitionInfo competition={event.competition} />
          )}
        </div>

        {/* Event Actions */}
        <EventActions 
          event={event} 
          user={user}
          registrationStatus={registrationStatus || null}
          teamStatus={teamStatus || null}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      </div>
    </div>
  );
};

export default StudentEventDetailPage;
