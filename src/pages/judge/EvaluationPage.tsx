import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  getCompetitionSubmissions, 
  getEventById, 
  type Submission, 
  type Event,
  type JudgingCriterion 
} from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ClipboardList, Users } from 'lucide-react';
import SubmissionsList from '@/components/judge/SubmissionsList';
import EvaluationModal from '@/components/judge/EvaluationModal';

const EvaluationPage: React.FC = () => {
  const { id: competitionId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [judgingCriteria, setJudgingCriteria] = useState<JudgingCriterion[]>([]);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!competitionId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch submissions and event details in parallel
        const [submissionsData, eventData] = await Promise.all([
          getCompetitionSubmissions(competitionId),
          getEventById(competitionId)
        ]);

        setSubmissions(submissionsData);
        setEventTitle(eventData.title);
        setJudgingCriteria(eventData.competition?.judgingCriteria || []);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to load evaluation data';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [competitionId, toast]);

  const handleSelectSubmission = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubmissionId(null);
  };

  const handleEvaluationSubmitted = () => {
    // Refresh submissions to update status
    if (competitionId) {
      getCompetitionSubmissions(competitionId)
        .then(setSubmissions)
        .catch(console.error);
    }
    handleCloseModal();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Competition Evaluation</h1>
          <h2 className="text-xl text-muted-foreground">{eventTitle}</h2>
          <p className="text-sm text-muted-foreground">
            Judge: {user?.firstName} {user?.lastName}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions List - Left Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Submissions ({submissions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SubmissionsList 
                  submissions={submissions}
                  onSelectSubmission={handleSelectSubmission}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Panel - Right Side */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Evaluation Workspace
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSubmissionId ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Selected submission will appear here for evaluation
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Select a Submission to Evaluate
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a submission from the left panel to begin your evaluation
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Evaluation Modal */}
      {selectedSubmissionId && (
        <EvaluationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          submissionId={selectedSubmissionId}
          judgingCriteria={judgingCriteria}
          onEvaluationSubmitted={handleEvaluationSubmitted}
        />
      )}
    </div>
  );
};

export default EvaluationPage;