import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Users, FileText, Flag, ShieldCheck, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { registerForEvent, joinTeam, createTeam, submitToCompetition } from '@/services/api';
import TeamCreateDialog from '../teams/TeamCreateDialog';
import TeamJoinDialog from '../teams/TeamJoinDialog';
import SubmissionDialog from '../submissions/SubmissionDialog';

interface EventActionsProps {
  event: Event;
  onJoinTeam?: () => void;
  onCreateTeam?: () => void;
  onRegister?: () => void;
  onSubmit?: () => void;
}

const EventActions: React.FC<EventActionsProps> = ({ event, onJoinTeam, onCreateTeam, onRegister, onSubmit }) => {
  const { user } = useAuth();
  const { toast } = useToast()
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = React.useState(false);
  const [isJoinTeamDialogOpen, setIsJoinTeamDialogOpen] = React.useState(false);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = React.useState(false);

  const isRegistered = event.participants?.some(participant => participant.userId === user?.id);
  const isTeamEvent = event.type === 'TEAM';
  const hasTeam = user?.teamMemberships?.some(teamMembership => teamMembership.team.eventId === event.id);
  const canSubmit = event.competition && isRegistered && (event.competition.submissionType === 'TEAM' ? hasTeam : true);

  const { mutate: register, isPending: isRegistering } = useMutation({
    mutationFn: () => registerForEvent(event.id),
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You have successfully registered for this event.",
      })
      onRegister?.();
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for this event. Please try again.",
        variant: "destructive",
      })
    },
  })

  const { mutate: join, isPending: isJoining } = useMutation({
    mutationFn: (teamId: string) => joinTeam(teamId),
    onSuccess: () => {
      toast({
        title: "Team Join Successful",
        description: "You have successfully joined this team.",
      })
      onJoinTeam?.();
    },
    onError: (error: any) => {
      toast({
        title: "Team Join Failed",
        description: error.message || "Failed to join this team. Please try again.",
        variant: "destructive",
      })
    },
  })

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: (teamName: string) => createTeam(event.id, teamName),
    onSuccess: () => {
      toast({
        title: "Team Creation Successful",
        description: "You have successfully created a team for this event.",
      })
      onCreateTeam?.();
    },
    onError: (error: any) => {
      toast({
        title: "Team Creation Failed",
        description: error.message || "Failed to create a team. Please try again.",
        variant: "destructive",
      })
    },
  })

  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: (submissionUrl: string) => submitToCompetition(event.competition?.eventId || '', submissionUrl),
    onSuccess: () => {
      toast({
        title: "Submission Successful",
        description: "You have successfully submitted to this competition.",
      })
      onSubmit?.();
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit to this competition. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleRegister = () => {
    register();
  };

  const handleCreateTeam = (teamName: string) => {
    create(teamName);
    setIsCreateTeamDialogOpen(false);
  };

  const handleJoinTeam = (teamId: string) => {
    join(teamId);
    setIsJoinTeamDialogOpen(false);
  };

  const handleSubmit = (submissionUrl: string) => {
    submit(submissionUrl);
    setIsSubmissionDialogOpen(false);
  };

  const getLeaderboardLink = () => {
    if (user?.role === 'STUDENT') {
      return `/student/events/${event.id}/leaderboard`;
    }
    return `/competitions/${event.id}/leaderboard`;
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Please <Link to="/login" className="text-primary underline">login</Link> to view event actions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Status Display */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">Status</h3>
            </div>
            <Badge variant="secondary">
              {event.status} - {formatDate(event.startDate)}
            </Badge>
          </div>

          {/* Registration Section */}
          {!isRegistered && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-primary" />
                <h3 className="font-medium">Registration</h3>
              </div>
              <Button 
                onClick={handleRegister} 
                variant="outline" 
                className="w-full"
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Register for Event
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Team Section */}
          {isTeamEvent && isRegistered && !hasTeam && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="font-medium">Teams</h3>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsCreateTeamDialogOpen(true)} 
                  variant="outline" 
                  className="w-1/2"
                  disabled={isCreating}
                >
                  Create Team
                </Button>
                <Button 
                  onClick={() => setIsJoinTeamDialogOpen(true)} 
                  variant="secondary" 
                  className="w-1/2"
                  disabled={isJoining}
                >
                  Join Team
                </Button>
              </div>
            </div>
          )}

          {/* Submission Section */}
          {canSubmit && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="font-medium">Submit to Competition</h3>
              </div>
              <Button 
                onClick={() => setIsSubmissionDialogOpen(true)} 
                variant="outline" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Solution
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Competition Results Section */}
          {event.competition && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                <h3 className="font-medium">Competition Results</h3>
              </div>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full"
              >
                <Link to={getLeaderboardLink()}>
                  <Trophy className="w-4 h-4 mr-2" />
                  View Leaderboard
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Dialogs */}
      <TeamCreateDialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen} onCreate={handleCreateTeam} />
      <TeamJoinDialog open={isJoinTeamDialogOpen} onOpenChange={setIsJoinTeamDialogOpen} onJoin={handleJoinTeam} eventId={event.id} />
      <SubmissionDialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen} onSubmit={handleSubmit} />
    </Card>
  );
};

export default EventActions;
