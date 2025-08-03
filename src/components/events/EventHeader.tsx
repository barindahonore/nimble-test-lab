
import { format } from 'date-fns';
import { Calendar, MapPin, User, Clock, Trophy, Users, Star, Zap } from 'lucide-react';
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
      return 'Live Event';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
};

export const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  const isCompetition = !!event.competition;
  
  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      <Card className="relative border-0 shadow-2xl bg-gradient-to-br from-background/95 via-background/90 to-accent/5 backdrop-blur-xl">
        <CardContent className="p-12">
          <div className="max-w-4xl mx-auto">
            {/* Status & Category Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Badge 
                variant={getStatusVariant(event.status)} 
                className="px-4 py-2 text-sm font-semibold shadow-md"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                {getStatusLabel(event.status)}
              </Badge>
              
              {isCompetition && (
                <Badge 
                  variant="outline" 
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 shadow-md"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Competition
                </Badge>
              )}

              {event.competition?.isTeamBased && (
                <Badge 
                  variant="outline" 
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-md"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Team Event
                </Badge>
              )}
            </div>
            
            {/* Title Section */}
            <div className="space-y-6 mb-10">
              <h1 className="text-5xl lg:text-6xl font-black text-foreground leading-tight">
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  {event.title}
                </span>
              </h1>
              
              {event.description && (
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-light">
                  {event.description}
                </p>
              )}
            </div>
            
            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Date */}
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-card/80 to-card/40 backdrop-blur border border-border/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-sm font-bold text-foreground">
                    {format(new Date(event.startTime), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              {/* Time */}
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-card/80 to-card/40 backdrop-blur border border-border/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p className="text-sm font-bold text-foreground">
                    {format(new Date(event.startTime), 'h:mm a')}
                  </p>
                </div>
              </div>
              
              {/* Location */}
              {event.location && (
                <div className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-card/80 to-card/40 backdrop-blur border border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-sm font-bold text-foreground">{event.location}</p>
                  </div>
                </div>
              )}
              
              {/* Organizer */}
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-card/80 to-card/40 backdrop-blur border border-border/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Organizer</p>
                  <p className="text-sm font-bold text-foreground">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </p>
                </div>
              </div>
            </div>

            {/* Competition Highlights */}
            {isCompetition && (
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Competition Highlights</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-muted-foreground">Competitive Challenge</span>
                  </div>
                  
                  {event.competition?.isTeamBased && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-muted-foreground">Team Collaboration</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">Win Recognition</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
