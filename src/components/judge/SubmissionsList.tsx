import React from 'react';
import { type Submission } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

interface SubmissionsListProps {
  submissions: Submission[];
  onSelectSubmission: (submissionId: string) => void;
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({
  submissions,
  onSelectSubmission,
}) => {
  const getStatusBadge = (submission: Submission) => {
    if (submission.finalScore !== null && submission.finalScore !== undefined) {
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Evaluated
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    );
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No submissions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
        >
          <div className="space-y-3">
            {/* Team Name and Status */}
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-foreground leading-tight">
                {submission.team.name}
              </h3>
              {getStatusBadge(submission)}
            </div>

            {/* Submission Date */}
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              Submitted {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}
            </div>

            {/* Score Display (if evaluated) */}
            {submission.finalScore !== null && submission.finalScore !== undefined && (
              <div className="text-sm">
                <span className="text-muted-foreground">Final Score: </span>
                <span className="font-medium text-foreground">
                  {submission.finalScore}
                </span>
              </div>
            )}

            {/* Action Button */}
            <Button
              variant={submission.finalScore !== null ? "outline" : "default"}
              size="sm"
              className="w-full"
              onClick={() => onSelectSubmission(submission.id)}
            >
              {submission.finalScore !== null ? 'View Evaluation' : 'Start Evaluation'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionsList;