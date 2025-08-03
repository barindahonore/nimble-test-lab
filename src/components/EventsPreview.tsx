
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trophy, Clock, ArrowRight } from "lucide-react";
import { getAllEvents, Event } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const EventsPreview = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        const response = await getAllEvents({ limit: 3 });
        // Filter out DRAFT events
        const publishedEvents = response.data.filter((event: Event) => event.status !== 'DRAFT');
        setEvents(publishedEvents.slice(0, 3));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestEvents();
  }, []);

  const getCategoryColor = (hasCompetition: boolean) => {
    return hasCompetition 
      ? "bg-primary/10 text-primary"
      : "bg-secondary/10 text-secondary";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PUBLISHED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      IN_PROGRESS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      COMPLETED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    };
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string, startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (status === 'PUBLISHED') {
      if (now < start) return 'Upcoming';
      if (now >= start && now <= end) return 'Live';
      if (now > end) return 'Ended';
    }
    
    switch (status) {
      case 'IN_PROGRESS': return 'Live';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <section id="events" className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs sm:text-sm font-medium">
              Upcoming Events
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Join Exciting
              <span className="text-secondary"> Educational Challenges</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover opportunities to showcase your skills, collaborate with peers, 
              and compete in various academic and leadership challenges.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden bg-gradient-card border-0">
                <div className="p-6">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs sm:text-sm font-medium">
            Upcoming Events
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Join Exciting
            <span className="text-secondary"> Educational Challenges</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover opportunities to showcase your skills, collaborate with peers, 
            and compete in various academic and leadership challenges.
          </p>
        </div>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {events.map((event, index) => (
              <Card 
                key={event.id} 
                className="overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0 animate-fade-in cursor-pointer" 
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={getCategoryColor(!!event.competition)}>
                      {event.competition ? 'Competition' : 'Event'}
                    </Badge>
                    <Badge className={getStatusColor(event.status)}>
                      {getStatusLabel(event.status, event.startTime, event.endTime)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  {event.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Event Details */}
                <div className="px-6 pb-4 space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {formatDate(event.startTime)}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    {formatTime(event.startTime)}
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      {event.location}
                    </div>
                  )}
                  
                  {event.competition?.isTeamBased && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-2 text-primary" />
                        Team Event
                      </div>
                      <div className="flex items-center text-accent font-medium">
                        <Trophy className="w-4 h-4 mr-1" />
                        Competition
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6">
                  <Button className="w-full group" variant="outline">
                    {event.competition ? 'View Competition' : 'View Event'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4 text-6xl">📅</div>
              <h3 className="text-xl font-semibold mb-2">No events available</h3>
              <p className="text-muted-foreground">
                No events are currently published. Please check back later!
              </p>
            </div>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="gradient" 
            size="lg" 
            className="group"
            onClick={() => navigate('/events')}
          >
            View All Events
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
