
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Copy, 
  Crown, 
  User, 
  ExternalLink, 
  FileText, 
  Upload,
  LogOut,
  Trash2
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MyTeam, removeTeamMember } from '@/services/teamApi';

interface TeamCardProps {
  team: MyTeam;
  currentUserId: string;
  onLeaveTeam: (teamId: string) => void;
  onRemoveMember: (teamId: string, memberId: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ 
  team, 
  currentUserId, 
  onLeaveTeam, 
  onRemoveMember 
}) => {
  const { toast } = useToast();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const currentUserMember = team.members.find(member => member.user.id === currentUserId);
  const isLeader = currentUserMember?.role === 'LEADER';

  const copyInvitationCode = async () => {
    try {
      await navigator.clipboard.writeText(team.invitationCode);
      toast({
        title: "Copied!",
        description: "Invitation code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy invitation code",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setIsRemoving(memberId);
    try {
      await removeTeamMember(team.id, memberId);
      onRemoveMember(team.id, memberId);
      toast({
        title: "Success",
        description: "Member removed from team",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(null);
    }
  };

  return (
    <Card className="group hover:shadow-glow transition-all duration-300 hover:scale-[1.02] bg-gradient-card border-border/50">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              {team.name}
            </CardTitle>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                🏆 {team.competition.event.title}
              </p>
              <Badge 
                variant={team.competition.event.status === 'IN_PROGRESS' ? 'default' : 'secondary'}
                className="text-xs font-semibold"
              >
                {team.competition.event.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Invitation Code */}
        <div className="bg-gradient-subtle border border-border/50 p-4 rounded-xl">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            🔗 Team Invitation Code
          </p>
          <div className="flex items-center gap-3">
            <code className="bg-background border border-border px-3 py-2 rounded-lg text-sm font-mono flex-1 select-all">
              {team.invitationCode}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyInvitationCode}
              className="h-9 w-9 p-0 hover:shadow-button-hover"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Team Members */}
        <div>
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            👥 Team Members <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {team.members.length}
            </span>
          </p>
          <div className="space-y-3">
            {team.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gradient-subtle border border-border/30 rounded-xl hover:shadow-card transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    member.role === 'LEADER' 
                      ? 'bg-gradient-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {member.role === 'LEADER' ? (
                      <Crown className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {member.user.firstName} {member.user.lastName}
                    </p>
                    <Badge 
                      variant={member.role === 'LEADER' ? "default" : "secondary"}
                      className="text-xs mt-1"
                    >
                      {member.role}
                    </Badge>
                  </div>
                </div>
                
                {/* Remove button - only for leaders, and not for themselves */}
                {isLeader && member.user.id !== currentUserId && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove Team Member</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove {member.user.firstName} {member.user.lastName} from the team? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() => handleRemoveMember(member.user.id)}
                          disabled={isRemoving === member.user.id}
                        >
                          {isRemoving === member.user.id ? 'Removing...' : 'Remove Member'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2 hover:shadow-button-hover">
              <ExternalLink className="w-4 h-4" />
              View Competition
            </Button>
            
            {team.submission ? (
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                View Submission
              </Button>
            ) : (
              <Button variant="hero" size="sm" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Make Submission
              </Button>
            )}
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                Leave Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave Team</DialogTitle>
                <DialogDescription>
                  Are you sure you want to leave "{team.name}"? You won't be able to access team resources or participate in the competition unless you're invited back.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => onLeaveTeam(team.id)}
                >
                  Leave Team
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
