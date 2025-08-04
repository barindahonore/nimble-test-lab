
import { useState } from 'react';
import { Users, Plus, UserPlus, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MyTeam } from '@/services/teamApi';
import { CreateTeamModal } from './CreateTeamModal';
import { JoinTeamModal } from './JoinTeamModal';

interface TeamSectionProps {
  teamStatus: MyTeam | null;
  isTeamBased: boolean;
  competitionId: string;
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

  const handleCreateTeamClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleJoinTeamClick = () => {
    setIsJoinModalOpen(true);
  };

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
                  onClick={handleCreateTeamClick}
                  type="button"
                >
                  <Plus className="w-4 h-4" />
                  Create Team
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleJoinTeamClick}
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
    </div>
  );
};
