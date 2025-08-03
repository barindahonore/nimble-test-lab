
import { useState, useEffect } from "react";
import { 
  Calendar, 
  BookOpen, 
  Trophy, 
  Clock, 
  Users, 
  ChevronRight,
  Star,
  Upload,
  Search,
  BarChart3,
  Award,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/dashboard');
        
        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch dashboard data');
        }
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load dashboard data';
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

    fetchDashboardData();
  }, [toast]);

  // Mock data for development (remove when API is ready)
  const mockData = {
    upcomingRegistrations: [
      {
        id: 1,
        eventId: "evt1",
        event: {
          title: "Global Leadership Summit",
          startTime: "2024-02-15T09:00:00.000Z",
          location: "Main Auditorium"
        }
      },
      {
        id: 2,
        eventId: "evt2",
        event: {
          title: "Innovation Workshop",
          startTime: "2024-02-20T14:00:00.000Z",
          location: "Tech Lab"
        }
      }
    ],
    activeTeams: [
      {
        id: 1,
        name: "The Innovators",
        competition: {
          event: {
            title: "Entrepreneurship Bootcamp",
            endTime: "2024-02-25T18:00:00.000Z"
          }
        }
      }
    ],
    recentResults: [
      {
        id: 1,
        finalScore: 95,
        team: {
          name: "The Visionaries"
        },
        competition: {
          event: {
            title: "Innovation Project Showcase"
          }
        }
      }
    ]
  };

  const displayData = dashboardData || mockData;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Events Registered</p>
                <p className="text-2xl font-bold text-foreground">{displayData.upcomingRegistrations?.length || 0}</p>
                <p className="text-xs text-primary font-medium">upcoming events</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-900/10 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Teams</p>
                <p className="text-2xl font-bold text-foreground">{displayData.activeTeams?.length || 0}</p>
                <p className="text-xs text-green-600 font-medium">competitions</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/20 dark:to-amber-900/10 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Results</p>
                <p className="text-2xl font-bold text-foreground">{displayData.recentResults?.length || 0}</p>
                <p className="text-xs text-amber-600 font-medium">completed</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center dark:bg-amber-900/30">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-900/10 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-xs text-purple-600 font-medium">badges earned</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Your registered events and deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayData.upcomingRegistrations?.length > 0 ? (
              displayData.upcomingRegistrations.map((registration: any) => (
                <div key={registration.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{registration.event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(registration.event.startTime)} • {registration.event.location}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Registered
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                You have no upcoming events. Explore and register for one!
              </p>
            )}
            <Button variant="ghost" className="w-full mt-3">
              View All Events
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Active Competitions
            </CardTitle>
            <CardDescription>Your active team competitions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayData.activeTeams?.length > 0 ? (
              displayData.activeTeams.map((team: any) => (
                <div key={team.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{team.name}</p>
                      <p className="text-xs text-muted-foreground">{team.competition.event.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Ends: {formatDate(team.competition.event.endTime)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                You are not currently on a team for an active competition.
              </p>
            )}
            <Button variant="ghost" className="w-full mt-3">
              <Target className="w-4 h-4 mr-2" />
              Join Competition
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Star className="w-5 h-5 mr-2 text-primary" />
            Recent Results
          </CardTitle>
          <CardDescription>Your latest competition results</CardDescription>
        </CardHeader>
        <CardContent>
          {displayData.recentResults?.length > 0 ? (
            <div className="space-y-3">
              {displayData.recentResults.map((result: any) => (
                <div key={result.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center dark:bg-amber-900/30">
                      <Trophy className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{result.competition.event.title}</p>
                      <p className="text-xs text-muted-foreground">Team: {result.team.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{result.finalScore}</p>
                    <p className="text-xs text-muted-foreground">Final Score</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No recent results to display.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Frequently used features and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Search className="w-6 h-6" />
              <span>Browse Events</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Upload className="w-6 h-6" />
              <span>Submit Work</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="w-6 h-6" />
              <span>View Progress</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Award className="w-6 h-6" />
              <span>Achievements</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
