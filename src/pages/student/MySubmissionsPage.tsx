
import React, { useState, useEffect } from 'react';
import { FileText, Trophy, AlertCircle, Loader2, Calendar, Users, User, Eye, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getMySubmissions, UserSubmission } from '@/services/submissionsApi';

const MySubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<UserSubmission | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getMySubmissions();
        setSubmissions(data);
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
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredSubmissions = submissions.filter(submission =>
    submission.competition.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (submission.team?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          <span>Loading your submissions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              My Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
        <p className="text-muted-foreground">
          View all your competition submissions and results
        </p>
      </div>

      {/* Search Bar */}
      {submissions.length > 0 && (
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search by competition or team name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {submissions.length === 0 ? 'No Submissions Yet' : `Submissions (${filteredSubmissions.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Submissions Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't made any submissions yet. Find a competition to get started!
              </p>
              <Button onClick={() => window.location.href = '/student/events'}>
                <Trophy className="w-4 h-4 mr-2" />
                Browse Events
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competition</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="font-medium">{submission.competition.event.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {submission.team ? (
                          <>
                            <Users className="w-4 h-4" />
                            <span>{submission.team.name}</span>
                          </>
                        ) : (
                          <>
                            <User className="w-4 h-4" />
                            <span>Individual</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(submission.submittedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {submission.finalScore !== null && submission.finalScore !== undefined ? (
                        <Badge variant="secondary" className={getScoreColor(submission.finalScore)}>
                          {submission.finalScore}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Awaiting Evaluation</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(submission)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{submission.competition.event.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Submission Details</h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <div>Submitted: {formatDate(submission.submittedAt)}</div>
                                  <div>Type: {submission.team ? `Team Submission (${submission.team.name})` : 'Individual Submission'}</div>
                                  {submission.finalScore !== null && submission.finalScore !== undefined && (
                                    <div>Score: {submission.finalScore}</div>
                                  )}
                                </div>
                              </div>
                              {submission.content && (
                                <div>
                                  <h4 className="font-medium mb-2">Content</h4>
                                  {submission.content.url && (
                                    <div className="mb-2">
                                      <a href={submission.content.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                        <ExternalLink className="w-3 h-3" />
                                        {submission.content.url}
                                      </a>
                                    </div>
                                  )}
                                  {submission.content.description && (
                                    <div className="text-sm text-muted-foreground">
                                      {submission.content.description}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        {submission.finalScore !== null && submission.finalScore !== undefined && (
                          <Button variant="ghost" size="sm" onClick={() => window.open(`/competitions/${submission.competition.id}/leaderboard`, '_blank')}>
                            <Trophy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {submissions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{submissions.length}</div>
              <div className="text-sm text-muted-foreground">Total Submissions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{submissions.filter(s => s.team).length}</div>
              <div className="text-sm text-muted-foreground">Team Submissions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{submissions.filter(s => s.finalScore !== null && s.finalScore !== undefined).length}</div>
              <div className="text-sm text-muted-foreground">Evaluated Submissions</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MySubmissionsPage;
