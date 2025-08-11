
import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Users, FileText, Flag, ShieldCheck, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Event, registerForEvent, EventRegistration } from '@/services/api';
import { joinTeam, createTeam, MyTeam, createSubmission } from '@/services/teamApi';
import { formatDate } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import TeamCreateDialog from '../teams/TeamCreateDialog';
import TeamJoinDialog from '../teams/TeamJoinDialog';
import SubmissionDialog from '../submissions/SubmissionDialog';

interface EventActionsProps {
  event: Event;
  user: any;
  registrationStatus: EventRegistration | null;
  teamStatus: MyTeam | null;
  onRegistrationSuccess: () => void;
}

const EventActions: React.FC<EventActionsProps> = ({ 
  event, 
  user,
  registrationStatus,
  teamStatus,
  onRegistrationSuccess
}) => {
  const { toast } = useToast()
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = React.useState(false);
  const [isJoinTeamDialogOpen, setIsJoinTeamDialogOpen] = React.useState(false);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = React.useState(false);

  const isRegistered = !!registrationStatus;
  const isTeamEvent = event.competition?.isTeamBased;
  const hasTeam = !!teamStatus;
  const canSubmit = event.competition && isRegistered && (isTeamEvent ? hasTeam : true);
  
  // Check if event has ended
  const isEventEnded = new Date(event.endTime) < new Date();

  const { mutate: register, isPending: isRegistering } = useMutation({
    mutationFn: () => registerForEvent(event.id),
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You have successfully registered for this event.",
      })
      onRegistrationSuccess();
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
    mutationFn: (invitationCode: string) => joinTeam(invitationCode),
    onSuccess: () => {
      toast({
        title: "Team Join Successful",
        description: "You have successfully joined this team.",
      })
      onRegistrationSuccess();
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
    mutationFn: (teamName: string) => createTeam(event.competition?.id || '', teamName),
    onSuccess: () => {
      toast({
        title: "Team Creation Successful",
        description: "You have successfully created a team for this event.",
      })
      onRegistrationSuccess();
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
    mutationFn: (submissionUrl: string) => createSubmission(teamStatus?.id || '', { url: submissionUrl, description: '' }),
    onSuccess: () => {
      toast({
        title: "Submission Successful",
        description: "You have successfully submitted to this competition.",
      })
      onRegistrationSuccess();
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

  const handleJoinTeam = (invitationCode: string) => {
    join(invitationCode);
    setIsJoinTeamDialogOpen(false);
  };

  const handleSubmit = (submissionUrl: string) => {
    submit(submissionUrl);
    setIsSubmissionDialogOpen(false);
  };

  const getLeaderboardLink = () => {
    if (user?.role?.name === 'STUDENT') {
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
              {event.status} - {formatDate(event.startTime)}
            </Badge>
          </div>

          {/* Registration Section */}
          {!isRegistered && !isEventEnded && (
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

          {/* Event Ended Message */}
          {isEventEnded && !isRegistered && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">Registration</h3>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Registration is no longer available. This event has ended.
                </p>
              </div>
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
