import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Users, Clock, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getEventById, getEventRegistrationStatus } from '@/services/api';
import { getMyTeamForEvent } from '@/services/teamApi';
import EventActions from '@/components/events/EventActions';
import EventHeader from '@/components/events/EventHeader';
import CompetitionInfo from '@/components/events/CompetitionInfo';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';

interface Params {
  eventId?: string;
}

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<Params>();
  const { user } = useAuth();

  const { data: event, isLoading: isEventLoading, error: eventError } = useQuery(
    ['event', eventId],
    () => getEventById(eventId || ''),
    {
      enabled: !!eventId,
    }
  );

  const { data: registrationStatus, isLoading: isRegistrationLoading, error: registrationError, refetch: refetchRegistration } = useQuery(
    ['registrationStatus', eventId, user?.id],
    () => getEventRegistrationStatus(eventId || ''),
    {
      enabled: !!eventId && !!user?.id,
    }
  );

  const { data: teamStatus, isLoading: isTeamLoading, error: teamError, refetch: refetchTeam } = useQuery(
    ['teamStatus', eventId, user?.id],
    () => getMyTeamForEvent(eventId || ''),
    {
      enabled: !!eventId && !!user?.id && !!event?.competition?.isTeamBased,
    }
  );

  const onRegistrationSuccess = () => {
    refetchRegistration();
    refetchTeam();
  };

  if (isEventLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-64" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {eventError.message || 'Failed to load event details.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Event not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <EventHeader event={event} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* Event Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>About this Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{formatDate(event.startTime)} - {formatDate(event.endTime)}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              )}
              <p>{event.description}</p>
            </CardContent>
          </Card>

          {/* Competition Information */}
          {event.competition && (
            <CompetitionInfo competition={event.competition} />
          )}
        </div>

        {/* Event Actions */}
        <div>
          <EventActions 
            event={event} 
            user={user}
            registrationStatus={registrationStatus || null}
            teamStatus={teamStatus || null}
            onRegistrationSuccess={onRegistrationSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
