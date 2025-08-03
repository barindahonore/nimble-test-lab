
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Trophy, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Upload,
  FileText,
  LogOut,
  UserX,
  Crown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getMyTeams, leaveTeam, removeTeamMember, MyTeam } from '@/services/teamApi';
import { SubmissionModal } from '@/components/submissions/SubmissionModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const MyTeamsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myTeams, setMyTeams] = useState<MyTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState<string | null>(null);
  const [submissionModal, setSubmissionModal] = useState<{ isOpen: boolean; teamId: string }>({
    isOpen: false,
    teamId: '',
  });

  const fetchMyTeams = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const teams = await getMyTeams();
      setMyTeams(teams);
    } catch (error: any) {
      console.error('Error fetching my teams:', error);
      setError('Failed to load your teams. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load your teams",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const handleLeaveTeam = async (teamId: string) => {
    setIsLeaving(teamId);
    try {
      await leaveTeam(teamId);
      setMyTeams(prev => prev.filter(team => team.id !== teamId));
      toast({
        title: "Success",
        description: "You have left the team",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave the team",
        variant: "destructive",
      });
    } finally {
      setIsLeaving(null);
    }
  };

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    setIsRemoving(memberId);
    try {
      await removeTeamMember(teamId, memberId);
      setMyTeams(prev => 
        prev.map(team => 
          team.id === teamId
            ? {
                ...team,
                members: team.members.filter(member => member.user.id !== memberId)
              }
            : team
        )
      );
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

  const copyInvitationCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PUBLISHED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredTeams = myTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.competition.event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: myTeams.length,
    active: myTeams.filter(team => team.competition.event.status === 'IN_PROGRESS').length,
    completed: myTeams.filter(team => team.competition.event.status === 'COMPLETED').length,
    withSubmissions: myTeams.filter(team => team.submission).length,
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchMyTeams}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8" />
            My Teams
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your team memberships and collaborate on competitions
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Teams</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">With Submissions</p>
                <p className="text-2xl font-bold text-blue-600">{stats.withSubmissions}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <Trophy className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      {myTeams.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search teams by name or competition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teams Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {myTeams.length === 0 ? 'No Teams Yet' : `Teams (${filteredTeams.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myTeams.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Teams Found</h3>
              <p className="text-muted-foreground mb-4">
                You're not currently a member of any teams. Get an invitation code to join your first team!
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-primary bg-primary/10 px-4 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                Contact your instructor or team leader for an invitation code
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Submission</TableHead>
                  <TableHead>Invitation Code</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team) => {
                  const currentUserMember = team.members.find(member => member.user.id === user?.id);
                  const isLeader = currentUserMember?.role === 'LEADER';
                  
                  return (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>{team.competition.event.title}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(team.competition.event.status)}>
                          {team.competition.event.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{team.members.length}</span>
                          {isLeader && (
                            <Crown className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isLeader ? "default" : "secondary"}>
                          {currentUserMember?.role || 'MEMBER'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {team.submission ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Submitted
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {team.invitationCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyInvitationCode(team.invitationCode)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" title="View competition">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          
                          {team.submission ? (
                            <Button variant="ghost" size="sm" title="View submission">
                              <FileText className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Make submission" 
                              className="text-primary"
                              onClick={() => setSubmissionModal({ isOpen: true, teamId: team.id })}
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                          )}

                          {isLeader && team.members.length > 1 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" title="Manage members">
                                  <UserX className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Manage Team Members</DialogTitle>
                                  <DialogDescription>
                                    Remove members from "{team.name}"
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-3">
                                  {team.members
                                    .filter(member => member.user.id !== user?.id)
                                    .map((member) => (
                                      <div key={member.user.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                          <p className="font-medium">
                                            {member.user.firstName} {member.user.lastName}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {member.role}
                                          </p>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleRemoveMember(team.id, member.user.id)}
                                          disabled={isRemoving === member.user.id}
                                          className="text-destructive hover:text-destructive"
                                        >
                                          {isRemoving === member.user.id ? 'Removing...' : 'Remove'}
                                        </Button>
                                      </div>
                                    ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                title="Leave team"
                              >
                                <LogOut className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Leave Team</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to leave "{team.name}"? You won't be able to access team resources unless invited back.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleLeaveTeam(team.id)}
                                  disabled={isLeaving === team.id}
                                >
                                  {isLeaving === team.id ? 'Leaving...' : 'Leave Team'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Submission Modal */}
      <SubmissionModal
        teamId={submissionModal.teamId}
        isOpen={submissionModal.isOpen}
        onClose={() => setSubmissionModal({ isOpen: false, teamId: '' })}
        onSuccess={() => {
          fetchMyTeams(); // Refresh the teams data
        }}
      />
    </div>
  );
};

export default MyTeamsPage;
