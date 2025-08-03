
import { Trophy, Users, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Competition } from '@/services/api';

interface CompetitionInfoProps {
  competition: Competition;
}

export const CompetitionInfo: React.FC<CompetitionInfoProps> = ({ competition }) => {
  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="w-6 h-6 text-primary" />
          Competition Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Team Requirements */}
        <div className="flex items-start gap-4">
          <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold mb-3 text-lg">Team Requirements</h4>
            {competition.isTeamBased ? (
              <div className="space-y-3">
                <Badge variant="outline" className="mr-3 bg-blue-50 text-blue-700 border-blue-200">
                  Team-Based Competition
                </Badge>
                {competition.minTeamSize && competition.maxTeamSize && (
                  <p className="text-muted-foreground">
                    Team size: {competition.minTeamSize} - {competition.maxTeamSize} members
                  </p>
                )}
              </div>
            ) : (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Individual Competition
              </Badge>
            )}
          </div>
        </div>

        {/* Judging Criteria */}
        {competition.judgingCriteria && competition.judgingCriteria.length > 0 && (
          <div className="flex items-start gap-4">
            <Target className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold mb-4 text-lg">Judging Criteria</h4>
              <div className="grid gap-3">
                {competition.judgingCriteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-accent/20"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-medium">{criterion.name}</span>
                    </div>
                    {criterion.weight && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {criterion.weight} points
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
