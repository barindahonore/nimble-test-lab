
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trophy, Calendar, Users, User, Eye, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserSubmission } from '@/services/submissionsApi';

interface SubmissionCardProps {
  submission: UserSubmission;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          {submission.competition.event.title}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(submission.submittedAt)}
          </div>
          <div className="flex items-center gap-1">
            {submission.team ? (
              <>
                <Users className="w-4 h-4" />
                <span>Team Submission</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span>Individual Submission</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Participant Info */}
          {submission.team && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Team: {submission.team.name}
              </Badge>
            </div>
          )}

          {/* Results Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              {submission.finalScore !== null && submission.finalScore !== undefined ? (
                <span className={`font-semibold ${getScoreColor(submission.finalScore)}`}>
                  Final Score: {submission.finalScore}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  Awaiting Evaluation
                </span>
              )}
            </div>

            {submission.finalScore !== null && submission.finalScore !== undefined && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`/competitions/${submission.competition.id}/leaderboard`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View Leaderboard
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View Submission
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;
