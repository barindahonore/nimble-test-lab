import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Trophy, TrendingUp, Plus, UserPlus } from 'lucide-react';
import { getDashboardData } from '@/services/api';
import StatCard from '@/components/admin/dashboard/StatCard';
import RecentActivityFeed from '@/components/admin/dashboard/RecentActivityFeed';
import EventStatusSummary from '@/components/admin/dashboard/EventStatusSummary';
import EventFormModal from '@/components/admin/EventFormModal';
import CreateJudgeModal from '@/components/admin/CreateJudgeModal';
import { useToast } from '@/hooks/use-toast';

const AdminDashboardPage: React.FC = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  });

  const handleEventCreated = () => {
    setIsEventModalOpen(false);
    toast({
      title: "Event created",
      description: "The event has been successfully created.",
    });
  };

  const handleJudgeCreated = () => {
    toast({
      title: "Judge created",
      description: "New judge account has been created.",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsEventModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
          <CreateJudgeModal onJudgeCreated={handleJudgeCreated} />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={dashboardData?.stats?.totalUsers || 0}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Events"
          value={dashboardData?.stats?.activeEvents || 0}
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Competitions"
          value={dashboardData?.stats?.totalCompetitions || 0}
          icon={Trophy}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Total Registrations"
          value={dashboardData?.stats?.totalRegistrations || 0}
          icon={TrendingUp}
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivityFeed 
              recentEvents={dashboardData?.recentEvents || []} 
              recentUsers={dashboardData?.recentUsers || []} 
            />
          </CardContent>
        </Card>

        {/* Event Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Event Status Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventStatusSummary 
              eventsByStatus={dashboardData?.eventsByStatus || { 
                draft: 0, 
                published: 0, 
                in_progress: 0, 
                completed: 0 
              }} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Event Form Modal */}
      <EventFormModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onEventSaved={handleEventCreated}
      />
    </div>
  );
};

export default AdminDashboardPage;
