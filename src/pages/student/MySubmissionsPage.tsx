
import React, { useState, useEffect } from 'react';
import { FileText, Trophy, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getMySubmissions, UserSubmission } from '@/services/submissionsApi';
import SubmissionCard from '@/components/student/SubmissionCard';

const MySubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    // Re-trigger the useEffect
    window.location.reload();
  };

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

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
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
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {submissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}

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
