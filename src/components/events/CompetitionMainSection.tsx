
import { useState } from 'react';
import { Users, Plus, UserPlus, Code, FileText, CheckCircle, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/services/api';
import { MyTeam } from '@/services/teamApi';
import { UserSubmission } from '@/services/submissionsApi';
import { CreateTeamModal } from './CreateTeamModal';
import { JoinTeamModal } from './JoinTeamModal';
import { SubmissionModal } from '@/components/submissions/SubmissionModal';

interface CompetitionMainSectionProps {
  event: Event;
  teamStatus: MyTeam | null;
  userSubmission: UserSubmission | null;
  competitionId: string;
  onTeamUpdate: () => void;
  onSubmissionUpdate: () => void;
}

export const CompetitionMainSection: React.FC<CompetitionMainSectionProps> = ({ 
  event,
  teamStatus, 
  userSubmission,
  competitionId,
  onTeamUpdate,
  onSubmissionUpdate
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  const isTeamBased = event.competition?.isTeamBased ?? false;

  console.log('CompetitionMainSection render:', {
    eventId: event.id,
    competitionId,
    isTeamBased,
    hasCompetition: !!event.competition,
    userSubmission,
    teamStatus
  });

  const handleTeamSuccess = () => {
    onTeamUpdate();
  };

  const handleSubmissionSuccess = () => {
    setIsSubmissionModalOpen(false);
    onSubmissionUpdate();
  };

  // Team-based competition rendering
  if (isTeamBased) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Status
            </CardTitle>
          </CardHeader>

          <CardContent>
            {teamStatus ? (
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
              </div>
            ) : (
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
                    <Plus className="w-4 h-4" />
                    Create Team
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => setIsJoinModalOpen(true)}
                    type="button"
                  >
                    <UserPlus className="w-4 h-4" />
                    Join Team
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <CreateTeamModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          competitionId={competitionId}
          onSuccess={handleTeamSuccess}
        />
        <JoinTeamModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          onSuccess={handleTeamSuccess}
        />
        {teamStatus && (
          <SubmissionModal
            teamId={teamStatus.id}
            isOpen={isSubmissionModalOpen}
            onClose={() => setIsSubmissionModalOpen(false)}
            onSuccess={handleSubmissionSuccess}
          />
        )}
      </div>
    );
  }

  // Individual competition rendering
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Individual Submission
          </CardTitle>
        </CardHeader>

        <CardContent>
          {userSubmission ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Submission Complete</h3>
              <p className="text-muted-foreground mb-4">
                You have successfully submitted your work for this competition.
              </p>
              
              {userSubmission.finalScore !== null && userSubmission.finalScore !== undefined ? (
                <div className="mb-4">
                  <Badge variant="default" className="bg-green-100 text-green-800 text-lg px-4 py-2">
                    Final Score: {userSubmission.finalScore}
                  </Badge>
                </div>
              ) : (
                <div className="mb-4">
                  <Badge variant="secondary">
                    Awaiting Evaluation
                  </Badge>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                <p>Submitted on {new Date(userSubmission.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Submit</h3>
              <p className="text-muted-foreground mb-6">
                Submit your individual work for this competition.
              </p>

              <Button 
                className="flex items-center gap-2"
                onClick={() => setIsSubmissionModalOpen(true)}
                type="button"
                size="lg"
              >
                <FileText className="w-4 h-4" />
                Make Individual Submission
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Modal */}
      <SubmissionModal
        competitionId={competitionId}
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSuccess={handleSubmissionSuccess}
      />
    </div>
  );
};
