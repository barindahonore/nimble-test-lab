
import { useState } from 'react';
import { Users, Plus, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MyTeam } from '@/services/teamApi';
import { CreateTeamModal } from './CreateTeamModal';
import { JoinTeamModal } from './JoinTeamModal';

interface TeamSectionProps {
  teamStatus: MyTeam | null;
  isTeamBased: boolean;
  competitionId?: string;
  onTeamUpdate: () => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ 
  teamStatus, 
  isTeamBased, 
  competitionId,
  onTeamUpdate 
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  if (!isTeamBased) {
    return null;
  }

  const handleTeamSuccess = () => {
    onTeamUpdate();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-background to-accent/5 border border-border shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            Team Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {teamStatus ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">{teamStatus.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Invitation Code:</span>
                    <code className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-md font-mono text-sm border border-accent/30">
                      {teamStatus.invitationCode}
                    </code>
                  </div>
                </div>
                {teamStatus.submission && (
                  <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400">
                    ✓ Submitted
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-foreground">Team Members</h4>
                  <Badge variant="secondary" className="text-xs">
                    {teamStatus.members.length} member{teamStatus.members.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="grid gap-3">
                  {teamStatus.members.map((member) => (
                    <div
                      key={member.user.id}
                      className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {member.user.firstName?.[0]}{member.user.lastName?.[0]}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">
                          {member.user.firstName} {member.user.lastName}
                        </span>
                      </div>
                      <Badge 
                        variant={member.role === 'LEADER' ? 'default' : 'secondary'}
                        className={member.role === 'LEADER' ? 'bg-primary/10 text-primary border-primary/20' : ''}
                      >
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-6">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Join the Competition</h3>
                <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                  This is a team-based competition. Create your own team or join an existing one to participate.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button 
                  variant="default"
                  size="lg" 
                  className="flex items-center gap-2 flex-1"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Create Team
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex items-center gap-2 flex-1"
                  onClick={() => setIsJoinModalOpen(true)}
                >
                  <UserPlus className="w-4 h-4" />
                  Join Team
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Render the modals */}
      {competitionId && (
        <>
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
        </>
      )}
    </div>
  );
};
