
import { Calendar, Users, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Event } from "@/services/api";

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export const EventCard = ({ event, onClick }: EventCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Upcoming</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Live</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="text-muted-foreground">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md border border-border/50 hover:border-border group h-[280px] flex flex-col"
      onClick={onClick}
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
            {event.title}
          </CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            {event.competition && (
              <div className="flex items-center text-amber-600 dark:text-amber-400">
                <Trophy className="h-4 w-4" />
              </div>
            )}
            {getStatusBadge(event.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        <div className="flex-1">
          {event.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3 min-h-[3.75rem]">
              {event.description}
            </p>
          )}
        </div>
        
        <div className="space-y-2 flex-shrink-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="truncate">{formatDate(event.startTime)}</span>
            </div>
            
            {event.competition?.isTeamBased && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Team Event</span>
              </div>
            )}
          </div>

          {event.location && (
            <div className="text-sm text-muted-foreground truncate">
              📍 {event.location}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
