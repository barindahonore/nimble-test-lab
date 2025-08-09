
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
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading your submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">My Submissions</h1>
          </div>

          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>

          <Button onClick={handleRetry} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Submissions</h1>
            <p className="text-muted-foreground">
              View all your competition submissions and results
            </p>
          </div>
        </div>

        {/* Search Bar */}
        {submissions.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Input
                  placeholder="Search submissions by competition or team name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4"
                />
              </div>
            </CardContent>
          </Card>
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
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Submissions Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  You haven't made any submissions yet. Find a competition to get started!
                </p>
                <Button onClick={() => window.location.href = '/student/events'}>
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
                      <TableCell className="font-medium">
                        {submission.competition.event.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {submission.team ? (
                            <>
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>{submission.team.name}</span>
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span>Individual</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {formatDate(submission.submittedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {submission.finalScore !== null && submission.finalScore !== undefined ? (
                          <span className={`font-semibold ${getScoreColor(submission.finalScore)}`}>
                            {submission.finalScore}
                          </span>
                        ) : (
                          <Badge variant="secondary">Awaiting Evaluation</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{submission.competition.event.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Submission Details</h4>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    <p><strong>Submitted:</strong> {formatDate(submission.submittedAt)}</p>
                                    <p><strong>Type:</strong> {submission.team ? `Team Submission (${submission.team.name})` : 'Individual Submission'}</p>
                                    {submission.finalScore !== null && submission.finalScore !== undefined && (
                                      <p><strong>Score:</strong> <span className={getScoreColor(submission.finalScore)}>{submission.finalScore}</span></p>
                                    )}
                                  </div>
                                </div>
                                {submission.content && (
                                  <div>
                                    <h4 className="font-medium mb-2">Content</h4>
                                    {submission.content.url && (
                                      <div className="mb-2">
                                        <a 
                                          href={submission.content.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-primary hover:underline"
                                        >
                                          {submission.content.url}
                                        </a>
                                      </div>
                                    )}
                                    {submission.content.description && (
                                      <div className="bg-muted p-3 rounded-md">
                                        <p className="text-sm">{submission.content.description}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {submission.finalScore !== null && submission.finalScore !== undefined && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/competitions/${submission.competition.id}/leaderboard`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
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
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {submissions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Submissions
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {submissions.filter(s => s.team).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Team Submissions
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {submissions.filter(s => s.finalScore !== null && s.finalScore !== undefined).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Evaluated Submissions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MySubmissionsPage;
