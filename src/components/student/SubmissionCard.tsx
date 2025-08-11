
import React, { useState } from 'react';
import { Calendar, Users, User, Eye, ExternalLink, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

interface SubmissionCardProps {
  submission: Submission;
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
      <CardHeader>
        <CardTitle className="text-lg">{submission.competition.event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Participant Info */}
        <div className="flex items-center gap-2">
          {submission.team ? (
            <>
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Team Submission</span>
              <Badge variant="outline">{submission.team.name}</Badge>
            </>
          ) : (
            <>
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Individual Submission</span>
            </>
          )}
        </div>

        {/* Submission Date */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Submitted on {formatDate(submission.submittedAt)}
          </span>
        </div>

        {/* Results Section */}
        <div className="space-y-2">
          {submission.finalScore !== null ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Final Score:</span>
                <span className={`ml-2 text-lg font-bold ${getScoreColor(submission.finalScore)}`}>
                  {submission.finalScore}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/competitions/${submission.competition.id}/leaderboard`, '_blank')}
              >
                <Trophy className="w-4 h-4 mr-1" />
                View Leaderboard
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Awaiting Evaluation</Badge>
              <span className="text-sm text-muted-foreground">Judging in Progress</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
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
                    <p>Submitted: {formatDate(submission.submittedAt)}</p>
                    <p>Type: {submission.team ? `Team Submission (${submission.team.name})` : 'Individual Submission'}</p>
                    {submission.finalScore !== null && (
                      <p>Score: <span className={getScoreColor(submission.finalScore)}>{submission.finalScore}</span></p>
                    )}
                  </div>
                </div>
                
                {submission.content && (
                  <div>
                    <h4 className="font-medium mb-2">Content</h4>
                    {submission.content.url && (
                      <div className="mb-2">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary"
                          onClick={() => window.open(submission.content.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          {submission.content.url}
                        </Button>
                      </div>
                    )}
                    {submission.content.description && (
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {submission.content.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;
