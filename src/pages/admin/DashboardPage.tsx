
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, Trophy, Settings, Plus, UserCheck, BarChart3, Database, Activity, Award, TrendingUp, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PlatformStats {
  totalUsers: number;
  totalRegistrations: number;
  totalCompetitions: number;
  eventsByStatus: {
    draft: number;
    published: number;
    in_progress: number;
    completed: number;
  };
}

interface RecentEvent {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface RecentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  role: {
    name: string;
  };
}

interface RecentActivity {
  recentEvents: RecentEvent[];
  recentUsers: RecentUser[];
}

interface DashboardData {
  platformStats: PlatformStats;
  recentActivity: RecentActivity;
}

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published": return "bg-green-50 text-green-700 border-green-200";
      case "draft": return "bg-gray-50 text-gray-700 border-gray-200";
      case "in_progress": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "completed": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "student": return "bg-blue-50 text-blue-700 border-blue-200";
      case "judge": return "bg-purple-50 text-purple-700 border-purple-200";
      case "admin": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">Dashboard Error</h2>
          <p className="text-muted-foreground">{error || 'Unable to load dashboard data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { platformStats, recentActivity } = dashboardData;
  const activeEvents = platformStats.eventsByStatus.published + platformStats.eventsByStatus.in_progress;

  return (
    <div className="p-6 space-y-6">
      {/* Platform Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-900/10 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{platformStats.totalUsers}</p>
                <p className="text-xs text-blue-600 font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% this month
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900/30">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-900/10 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                <p className="text-2xl font-bold text-foreground">{activeEvents}</p>
                <p className="text-xs text-green-600 font-medium flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  {platformStats.eventsByStatus.published} published
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-900/10 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Registrations</p>
                <p className="text-2xl font-bold text-foreground">{platformStats.totalRegistrations}</p>
                <p className="text-xs text-purple-600 font-medium flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  Event sign-ups
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                <UserPlus className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-900/10 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Competitions</p>
                <p className="text-2xl font-bold text-foreground">{platformStats.totalCompetitions}</p>
                <p className="text-xs text-orange-600 font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  All-time events
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center dark:bg-orange-900/30">
                <Trophy className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Settings className="w-5 h-5 mr-2 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Frequently used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Plus className="w-6 h-6" />
              <span>Create Event</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <UserCheck className="w-6 h-6" />
              <span>Add User</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="w-6 h-6" />
              <span>View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Database className="w-6 h-6" />
              <span>Backup Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Event Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Recent Events
            </CardTitle>
            <CardDescription>Latest platform events and activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.recentEvents.length > 0 ? (
              recentActivity.recentEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(event.status)}>
                    {event.status.toLowerCase().replace('_', ' ')}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent events</p>
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
              Recent Users & Event Status
            </CardTitle>
            <CardDescription>New user registrations and event breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{platformStats.eventsByStatus.published}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{platformStats.eventsByStatus.in_progress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{platformStats.eventsByStatus.draft}</p>
                <p className="text-xs text-muted-foreground">Drafts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{platformStats.eventsByStatus.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              {recentActivity.recentUsers.length > 0 ? (
                recentActivity.recentUsers.slice(0, 3).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded border border-border bg-muted/20">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getRoleColor(user.role.name)}>
                      {user.role.name.toLowerCase()}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent users</p>
              )}
            </div>
            
            <Button variant="ghost" className="w-full">
              Manage Users
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
