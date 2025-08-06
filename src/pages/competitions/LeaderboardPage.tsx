
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Trophy, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getEventById, getCompetitionLeaderboard, LeaderboardEntry, Event } from '@/services/api';
import LeaderboardTable from '@/components/competitions/LeaderboardTable';

const LeaderboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch event details
        const eventData = await getEventById(id);
        setEvent(eventData);

        // Fetch leaderboard data if competition exists
        if (eventData.competition) {
          const leaderboard = await getCompetitionLeaderboard(eventData.competition.eventId);
          console.log(leaderboard)
          setLeaderboardData(leaderboard);
        } else {
          setError('This event is not a competition or does not have results available.');
        }
      } catch (err: any) {
        console.error('Failed to fetch leaderboard data:', err);
        
        if (err.response?.status === 403) {
          setError('Competition results are not yet available. Please check back later.');
        } else if (err.response?.status === 404) {
          setError('Competition not found or results are not available.');
        } else {
          setError('Failed to load leaderboard data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (!id) {
    return <Navigate to="/events" replace />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Competition Leaderboard</h1>
            {event && (
              <p className="text-lg text-muted-foreground">{event.title}</p>
            )}
          </div>

          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-left">
              {error}
            </AlertDescription>
          </Alert>

          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
          </div>
          {event && (
            <p className="text-lg text-muted-foreground">{event.title}</p>
          )}
        </div>

        {/* Leaderboard */}
        {leaderboardData.length > 0 ? (
          <LeaderboardTable leaderboardData={leaderboardData} />
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Results Available
              </h3>
              <p className="text-muted-foreground">
                Results will be displayed once the competition is completed and scored.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
