
import { useState } from 'react';
import { Users, Upload, CheckCircle, Code, Trophy, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event, EventRegistration } from '@/services/api';
import { MyTeam } from '@/services/teamApi';
import { CreateTeamModal } from './CreateTeamModal';
import { JoinTeamModal } from './JoinTeamModal';
import { SubmissionModal } from '@/components/submissions/SubmissionModal';
import { CompetitionInfo } from './CompetitionInfo';

// Individual submission interface
interface IndividualSubmission {
  id: string;
  content: {
    url: string;
    description: string;
  };
  submittedAt: string;
  competition: {
    id: string;
    event: {
      id: string;
      title: string;
    };
  };
  finalScore?: number;
}

interface CompetitionMainSectionProps {
  event: Event;
  registration: EventRegistration;
  teamStatus: MyTeam | null;
  userSubmission: IndividualSubmission | null;
  onTeamUpdate: () => void;
  onSubmissionUpdate: () => void;
}

export const CompetitionMainSection: React.FC<CompetitionMainSectionProps> = ({
  event,
  registration,
  teamStatus,
  userSubmission,
  onTeamUpdate,
  onSubmissionUpdate,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  const hasEnded = new Date(event.endTime) < new Date();
  const isTeamBased = event.competition?.isTeamBased || false;

  const handleTeamSuccess = () => {
    onTeamUpdate();
  };

  const handleSubmissionSuccess = () => {
    onSubmissionUpdate();
    setIsSubmissionModalOpen(false);
  };

  const handleViewSubmission = () => {
    if (userSubmission?.content?.url) {
      window.open(userSubmission.content.url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Competition Info */}
      <CompetitionInfo 
        competition={event.competition!} 
        eventEndTime={event.endTime}
      />

      {/* Main Competition Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isTeamBased ? <Users className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            {isTeamBased ? 'Team Management' : 'Individual Submission'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isTeamBased ? (
            // Team-based competition logic
            teamStatus ? (
              <div className="space-y-6">
                {/* Team Info */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{teamStatus.name}</h3>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Code className="w-4 h-4" />
                      <span>Invitation Code:</span>
                      <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                        {teamStatus.invitationCode}
                      </code>
                    </div>
                  </div>

                  {teamStatus.submission && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Submitted
                    </Badge>
                  )}
                </div>

                {/* Team Members */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Team Members</h4>
                    <Badge variant="outline">
                      {teamStatus.members.length} member{teamStatus.members.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {teamStatus.members.map((member) => (
                      <div
                        key={member.user.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            member.role === 'LEADER' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {member.user.firstName?.[0]}{member.user.lastName?.[0]}
                          </div>
                          
                          <div>
                            <p className="font-medium text-sm">
                              {member.user.firstName} {member.user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Submission Section */}
                {!teamStatus.submission && !hasEnded && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">Ready to Submit?</h4>
                        <p className="text-sm text-blue-700">
                          Your team can submit your project when ready.
                        </p>
                      </div>
                      <Button 
                        onClick={() => setIsSubmissionModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Project
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // No team yet - show team creation/joining options
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Join a Team</h3>
                <p className="text-muted-foreground mb-6">
                  This is a team-based competition. Create your own team or join an existing one.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => setIsCreateModalOpen(true)}
                    type="button"
                  >
                    <Users className="w-4 h-4" />
                    Create Team
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => setIsJoinModalOpen(true)}
                    type="button"
                  >
                    <Users className="w-4 h-4" />
                    Join Team
                  </Button>
                </div>
              </div>
            )
          ) : (
            // Individual competition logic
            userSubmission ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900">Submission Complete!</h3>
                    <p className="text-sm text-green-700">
                      You submitted your project on {new Date(userSubmission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Submission Details */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Your Submission</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {userSubmission.content.description}
                  </p>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleViewSubmission}
                    >
                      View Project
                    </Button>
                    
                    {hasEnded && (
                      <Link to={`/competitions/${event.competition!.eventId}/leaderboard`}>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Results
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Score Display */}
                {userSubmission.finalScore !== null && userSubmission.finalScore !== undefined && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-primary" />
                      <div>
                        <h4 className="font-semibold">Final Score</h4>
                        <p className="text-2xl font-bold text-primary">
                          {userSubmission.finalScore}/100
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // No submission yet - show submission button
              <div className="text-center py-8">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Submit?</h3>
                <p className="text-muted-foreground mb-6">
                  Submit your individual project for this competition.
                </p>

                {!hasEnded ? (
                  <Button 
                    size="lg"
                    onClick={() => setIsSubmissionModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Submit Your Project
                  </Button>
                ) : (
                  <p className="text-muted-foreground">
                    Submission period has ended.
                  </p>
                )}
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {isTeamBased && (
        <>
          <CreateTeamModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            competitionId={event.competition!.id}
            onSuccess={handleTeamSuccess}
          />
          <JoinTeamModal
            isOpen={isJoinModalOpen}
            onClose={() => setIsJoinModalOpen(false)}
            onSuccess={handleTeamSuccess}
          />
        </>
      )}

      <SubmissionModal
        teamId={isTeamBased ? teamStatus?.id : undefined}
        competitionId={!isTeamBased ? event.competition!.id : undefined}
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSuccess={handleSubmissionSuccess}
      />
    </div>
  );
};
