
import React, { useState, useEffect } from 'react';
import { FileText, Trophy, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import SubmissionCard from '@/components/student/SubmissionCard';

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {submissions.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
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
    </div>
  );
};

export default MySubmissionsPage;
