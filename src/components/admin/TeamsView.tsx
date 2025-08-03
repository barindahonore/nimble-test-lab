
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCompetitionTeams } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, User, Calendar, Crown, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamsViewProps {
  competitionId: string;
}

const TeamsView: React.FC<TeamsViewProps> = ({ competitionId }) => {
  console.log('TeamsView - Competition ID:', competitionId);

  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['competition-teams', competitionId],
    queryFn: () => {
      console.log('Fetching teams for competition:', competitionId);
      return getCompetitionTeams(competitionId);
    },
    enabled: !!competitionId,
  });

  console.log('Teams data:', teams);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    console.error('Error loading teams:', error);
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Error Loading Teams</h3>
        <p className="text-destructive">Error loading teams. Please try again later.</p>
      </div>
    );
  }

  const totalMembers = teams?.reduce((sum, team) => sum + team.members.length, 0) || 0;
  const avgTeamSize = teams?.length ? (totalMembers / teams.length).toFixed(1) : '0';

  const copyInvitationCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Teams</p>
                <p className="text-2xl font-bold text-foreground">{teams?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-foreground">{totalMembers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Team Size</p>
                <p className="text-2xl font-bold text-foreground">{avgTeamSize}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams Table */}
      {teams && teams.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Registered Teams ({teams.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Team</TableHead>
                    <TableHead className="font-semibold">Members</TableHead>
                    <TableHead className="font-semibold">Invitation Code</TableHead>
                    <TableHead className="font-semibold">Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-sm">
                            {team.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{team.name}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {team.members.map((member, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              {member.role === 'LEADER' ? (
                                <Crown className="w-3 h-3 text-yellow-600" />
                              ) : (
                                <User className="w-3 h-3 text-muted-foreground" />
                              )}
                              <span className="font-medium">
                                {member.user.firstName} {member.user.lastName}
                              </span>
                              <Badge 
                                variant={member.role === 'LEADER' ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {member.role}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                            {team.invitationCode}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyInvitationCode(team.invitationCode)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{new Date(team.createdAt).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Teams Registered</h3>
            <p className="text-muted-foreground">No teams have registered for this competition yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamsView;
