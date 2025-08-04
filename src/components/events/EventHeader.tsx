
import { format } from 'date-fns';
import { Calendar, MapPin, User, Clock, Trophy, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Event } from '@/services/api';

interface EventHeaderProps {
  event: Event;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'default';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'Published';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
};

export const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  const isCompetition = !!event.competition;
  
  return (
    <Card>
      <CardContent className="p-6">
        {/* Status & Category Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={getStatusVariant(event.status)}>
            {getStatusLabel(event.status)}
          </Badge>
          
          {isCompetition && (
            <Badge variant="outline">
              <Trophy className="w-3 h-3 mr-1" />
              Competition
            </Badge>
          )}

          {event.competition?.isTeamBased && (
            <Badge variant="outline">
              <Users className="w-3 h-3 mr-1" />
              Team Event
            </Badge>
          )}
        </div>
        
        {/* Title Section */}
        <div className="space-y-3 mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            {event.title}
          </h1>
          
          {event.description && (
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          )}
        </div>
        
        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="text-sm font-medium">
                {format(new Date(event.startTime), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          
          {/* Time */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="text-sm font-medium">
                {format(new Date(event.startTime), 'h:mm a')}
              </p>
            </div>
          </div>
          
          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-sm font-medium">{event.location}</p>
              </div>
            </div>
          )}
          
          {/* Organizer */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Organizer</p>
              <p className="text-sm font-medium">
                {event.organizer.firstName} {event.organizer.lastName}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
