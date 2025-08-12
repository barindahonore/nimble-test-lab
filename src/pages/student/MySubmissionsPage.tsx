
import React, { useState, useEffect } from 'react';
import { FileText, Trophy, AlertCircle, Loader2, ExternalLink, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import api from '@/services/api';

interface Submission {
  id: string;
  submittedAt: string;
  finalScore: number | null;
  content: {
    url?: string;
    description?: string;
  };
  team: {
    name: string;
  } | null;
  competition: {
    id: string;
    event: {
      title: string;
    };
  };
}

const MySubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get('/submissions/me');
        setSubmissions(response.data.data || []);
      } catch (err: any) {
        console.error('Failed to fetch submissions:', err);
        setError('Failed to load your submissions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              My Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <Button onClick={handleRetry} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          My Submissions
        </h1>
        <p className="text-muted-foreground mt-2">
          View all your competition submissions and results
        </p>
      </div>

      {/* Summary Stats */}
      {submissions.length > 0 && (
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-primary">{submissions.length}</div>
              <div className="text-sm text-muted-foreground">Total Submissions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-primary">
                {submissions.filter(s => s.team).length}
              </div>
              <div className="text-sm text-muted-foreground">Team Submissions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-primary">
                {submissions.filter(s => s.finalScore !== null).length}
              </div>
              <div className="text-sm text-muted-foreground">Evaluated Submissions</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content */}
      {submissions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Submissions Yet</h3>
            <p className="text-muted-foreground mb-6">
              You have not made any submissions yet. Find a competition to get started!
            </p>
            <Button onClick={() => window.location.href = '/student/events'}>
              Browse Events
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competition</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.competition.event.title}
                    </TableCell>
                    <TableCell>
                      {submission.team ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Team</Badge>
                          <span className="text-sm text-muted-foreground">
                            {submission.team.name}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline">Individual</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(submission.submittedAt)}
                    </TableCell>
                    <TableCell>
                      {submission.finalScore !== null ? (
                        <Badge variant="default">Evaluated</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {submission.finalScore !== null ? (
                        <span className={`font-bold ${getScoreColor(submission.finalScore)}`}>
                          {submission.finalScore}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSubmission(submission)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {submission.finalScore !== null && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/competitions/${submission.competition.id}/leaderboard`, '_blank')}
                          >
                            <Trophy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Submission Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSubmission?.competition.event.title}
            </DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Submission Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Submitted: {formatDate(selectedSubmission.submittedAt)}</p>
                  <p>
                    Type: {selectedSubmission.team 
                      ? `Team Submission (${selectedSubmission.team.name})` 
                      : 'Individual Submission'
                    }
                  </p>
                  {selectedSubmission.finalScore !== null && (
                    <p>
                      Score: <span className={getScoreColor(selectedSubmission.finalScore)}>
                        {selectedSubmission.finalScore}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              
              {selectedSubmission.content && (
                <div>
                  <h4 className="font-medium mb-2">Content</h4>
                  {selectedSubmission.content.url && (
                    <div className="mb-2">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-primary"
                        onClick={() => window.open(selectedSubmission.content.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {selectedSubmission.content.url}
                      </Button>
                    </div>
                  )}
                  {selectedSubmission.content.description && (
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {selectedSubmission.content.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MySubmissionsPage;
