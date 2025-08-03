
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllEvents } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Trophy,
  Users,
  FileText,
  Settings,
  Calendar,
  MapPin,
  Clock,
  TrendingUp
} from 'lucide-react';
import CompetitionSettingsForm from '@/components/admin/CompetitionSettingsForm';
import JudgesManagement from '@/components/admin/JudgesManagement';
import TeamsView from '@/components/admin/TeamsView';
import SubmissionsView from '@/components/admin/SubmissionsView';

const CompetitionManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: eventsData, isLoading, error } = useQuery({
    queryKey: ['events', { search: '', page: 1, limit: 1000 }],
    queryFn: () => getAllEvents({ search: '', page: 1, limit: 1000 }),
  });

  const event = eventsData?.data?.find(e => e.id === id);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Error loading competition. Please try again later.</p>
            <Button 
              onClick={() => navigate('/admin/events')}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const competition = event.competition;
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>",event)
  if (!competition) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">This event hasn't been promoted to a competition yet.</p>
            <Button 
              onClick={() => navigate('/admin/events')}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/events')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Button>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>
          <p className="text-muted-foreground">Competition management and configuration</p>
          
          <div className="flex items-center gap-4 mt-3">
            <Badge className={getStatusColor(event.status)}>
              {event.status.replace('_', ' ')}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{new Date(event.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{event.duration} hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-900/10 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Configuration</p>
                <p className="text-2xl font-bold text-foreground">
                  {competition.isTeamBased ? 'Team-based' : 'Individual'}
                </p>
                {competition.isTeamBased && (
                  <p className="text-xs text-blue-600 font-medium flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {competition.minTeamSize}-{competition.maxTeamSize} members
                  </p>
                )}
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
                <p className="text-sm font-medium text-muted-foreground">Assigned Judges</p>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-green-600 font-medium">Active judges</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900/30">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-900/10 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registered Teams</p>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-purple-600 font-medium">Active participants</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900/30">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-900/10 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-orange-600 font-medium">Submitted projects</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center dark:bg-orange-900/30">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50">
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="judges" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Judges
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Teams
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Submissions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="p-6">
              <CompetitionSettingsForm 
                eventId={id!} 
                competition={competition} 
              />
            </TabsContent>
            
            <TabsContent value="judges" className="p-6">
              <JudgesManagement competitionId={event.id} />
            </TabsContent>
            
            <TabsContent value="teams" className="p-6">
              <TeamsView competitionId={event.id} />
            </TabsContent>
            
            <TabsContent value="submissions" className="p-6">
              <SubmissionsView competitionId={event.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitionManagementPage;
