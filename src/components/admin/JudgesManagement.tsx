import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCompetitionJudges, 
  assignJudge, 
  removeJudge, 
  getAllUsers 
} from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { UserPlus, Trash2, User, Mail, Calendar, Users } from 'lucide-react';

interface JudgesManagementProps {
  competitionId: string;
}

const JudgesManagement: React.FC<JudgesManagementProps> = ({ competitionId }) => {
  const [selectedJudgeId, setSelectedJudgeId] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  console.log('JudgesManagement - Competition ID:', competitionId);

  // Fetch assigned judges
  const { data: judges, isLoading: judgesLoading } = useQuery({
    queryKey: ['competition-judges', competitionId],
    queryFn: () => getCompetitionJudges(competitionId),
    enabled: !!competitionId,
  });

  // Fetch all users with JUDGE role
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users', { role: 'JUDGE' }],
    queryFn: () => getAllUsers({ role: 'JUDGE', limit: 100 }),
  });

  const allJudges = usersData?.data || [];
  const assignedJudgeIds = judges?.map(j => j.judge.id) || [];
  const availableJudges = allJudges.filter(user => !assignedJudgeIds.includes(user.id));

  // Assign judge mutation
  const assignJudgeMutation = useMutation({
    mutationFn: (judgeId: string) => assignJudge(competitionId, { judgeId }),
    onSuccess: () => {
      toast({
        title: "Judge assigned",
        description: "Judge has been successfully assigned to the competition.",
      });
      queryClient.invalidateQueries({ queryKey: ['competition-judges', competitionId] });
      setSelectedJudgeId('');
    },
    onError: (error: any) => {
      toast({
        title: "Error assigning judge",
        description: error.response?.data?.message || "Failed to assign judge.",
        variant: "destructive",
      });
    },
  });

  // Remove judge mutation
  const removeJudgeMutation = useMutation({
    mutationFn: (judgeId: string) => removeJudge(competitionId, judgeId),
    onSuccess: () => {
      toast({
        title: "Judge removed",
        description: "Judge has been successfully removed from the competition.",
      });
      queryClient.invalidateQueries({ queryKey: ['competition-judges', competitionId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error removing judge",
        description: error.response?.data?.message || "Failed to remove judge.",
        variant: "destructive",
      });
    },
  });

  const handleAssignJudge = () => {
    if (selectedJudgeId) {
      assignJudgeMutation.mutate(selectedJudgeId);
    }
  };

  const handleRemoveJudge = (judgeId: string) => {
    if (window.confirm('Are you sure you want to remove this judge from the competition?')) {
      removeJudgeMutation.mutate(judgeId);
    }
  };

  const handleRefreshJudges = () => {
    queryClient.invalidateQueries({ queryKey: ['users', { role: 'JUDGE' }] });
  };

  if (judgesLoading || usersLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Judges</p>
                <p className="text-2xl font-bold text-foreground">{judges?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Judges</p>
                <p className="text-2xl font-bold text-foreground">{availableJudges.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Judges</p>
                <p className="text-2xl font-bold text-foreground">{allJudges.length}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign New Judge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Assign New Judge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={selectedJudgeId} onValueChange={setSelectedJudgeId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a judge to assign" />
              </SelectTrigger>
              <SelectContent>
                {availableJudges.map((judge) => (
                  <SelectItem key={judge.id} value={judge.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {judge.firstName} {judge.lastName} ({judge.email})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleAssignJudge}
              disabled={!selectedJudgeId || assignJudgeMutation.isPending}
              className="min-w-32"
            >
              {assignJudgeMutation.isPending ? 'Assigning...' : 'Assign Judge'}
            </Button>
          </div>
          {availableJudges.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
              No available judges to assign. All judges are already assigned to this competition.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Assigned Judges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Assigned Judges ({judges?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {judges && judges.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Judge</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Assigned Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {judges.map((judgeAssignment) => (
                    <TableRow key={judgeAssignment.judgeId} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {judgeAssignment.judge.firstName[0]}{judgeAssignment.judge.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {judgeAssignment.judge.firstName} {judgeAssignment.judge.lastName}
                            </p>
                            <Badge variant="secondary" className="text-xs">Judge</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{judgeAssignment.judge.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{new Date(judgeAssignment.assignedAt).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveJudge(judgeAssignment.judgeId)}
                          disabled={removeJudgeMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Judges Assigned</h3>
              <p className="text-muted-foreground">No judges have been assigned to this competition yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JudgesManagement;
