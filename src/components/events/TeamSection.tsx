
import { useState } from 'react';
import { Users, Plus, UserPlus, Trophy, Code, Target } from 'lucide-react';
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

  const handleCreateTeamClick = () => {
    console.log('Create team button clicked, competitionId:', competitionId);
    console.log('competitionId type:', typeof competitionId);
    console.log('competitionId is defined:', competitionId !== undefined);
    setIsCreateModalOpen(true);
  };

  const handleJoinTeamClick = () => {
    console.log('Join team button clicked, competitionId:', competitionId);
    setIsJoinModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-background via-background to-accent/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <CardHeader className="relative pb-6 border-b border-border/10">
          <CardTitle className="flex items-center gap-4 text-3xl font-bold">
            <div className="relative p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Team Status
              </span>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Collaborate and compete together
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="relative pt-8">
          {teamStatus ? (
            <div className="space-y-8">
              {/* Team Info Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-bold text-foreground">{teamStatus.name}</h3>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 py-1">
                      <Trophy className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  
                  <div className="bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl p-4 border border-accent/20">
                    <div className="flex items-center gap-3">
                      <Code className="w-5 h-5 text-accent-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Invitation Code:</span>
                      <code className="bg-background/80 backdrop-blur text-foreground px-4 py-2 rounded-lg font-mono text-sm border border-border/50 select-all">
                        {teamStatus.invitationCode}
                      </code>
                    </div>
                  </div>
                </div>

                {teamStatus.submission && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-semibold text-sm">Submitted</span>
                  </div>
                )}
              </div>

              {/* Team Members */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Team Members
                  </h4>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {teamStatus.members.length} member{teamStatus.members.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="grid gap-4">
                  {teamStatus.members.map((member) => (
                    <div
                      key={member.user.id}
                      className="group flex items-center justify-between p-6 bg-gradient-to-r from-card/80 to-card/40 backdrop-blur border border-border/50 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                          member.role === 'LEADER' 
                            ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg' 
                            : 'bg-gradient-to-br from-muted to-muted/60 text-muted-foreground'
                        }`}>
                          {member.user.firstName?.[0]}{member.user.lastName?.[0]}
                          {member.role === 'LEADER' && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">👑</span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <p className="font-semibold text-foreground text-lg">
                            {member.user.firstName} {member.user.lastName}
                          </p>
                          <Badge 
                            variant={member.role === 'LEADER' ? 'default' : 'secondary'}
                            className={`text-xs font-medium ${
                              member.role === 'LEADER' 
                                ? 'bg-gradient-to-r from-primary to-accent text-white' 
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse" />
                  <Users className="w-12 h-12 text-primary relative z-10" />
                </div>
                
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Ready to Compete?
                </h3>
                <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                  This is a team-based competition. Create your own team to lead the way, or join an existing team to collaborate.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button 
                  variant="hero"
                  size="lg" 
                  className="flex items-center gap-3 flex-1 h-14 text-base font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={handleCreateTeamClick}
                  type="button"
                >
                  <Plus className="w-5 h-5" />
                  Create Team
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex items-center gap-3 flex-1 h-14 text-base font-semibold border-2 hover:bg-accent/10 hover:border-primary/30 transition-all duration-300"
                  onClick={handleJoinTeamClick}
                  type="button"
                >
                  <UserPlus className="w-5 h-5" />
                  Join Team
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals - Always render when buttons are pressed */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          console.log('Closing create modal');
          setIsCreateModalOpen(false);
        }}
        competitionId={competitionId || ''}
        onSuccess={handleTeamSuccess}
      />
      <JoinTeamModal
        isOpen={isJoinModalOpen}
        onClose={() => {
          console.log('Closing join modal');
          setIsJoinModalOpen(false);
        }}
        onSuccess={handleTeamSuccess}
      />
    </div>
  );
};
