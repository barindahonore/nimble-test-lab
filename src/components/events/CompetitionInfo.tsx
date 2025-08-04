
import { Trophy, Users, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Competition } from '@/services/api';

interface CompetitionInfoProps {
  competition: Competition;
}

export const CompetitionInfo: React.FC<CompetitionInfoProps> = ({ competition }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Competition Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Team Requirements Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            <h4 className="font-semibold">Team Requirements</h4>
          </div>
          
          {competition.isTeamBased ? (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <Badge variant="outline" className="mb-3">
                <Users className="w-3 h-3 mr-1" />
                Team-Based Competition
              </Badge>
              
              {competition.minTeamSize && competition.maxTeamSize && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Team Size:</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span><strong>Min:</strong> {competition.minTeamSize} members</span>
                    <span><strong>Max:</strong> {competition.maxTeamSize} members</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <Badge variant="outline">
                Individual Competition
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                This is a solo challenge where you'll compete individually.
              </p>
            </div>
          )}
        </div>

        {/* Judging Criteria Section */}
        {competition.judgingCriteria && competition.judgingCriteria.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary" />
              <h4 className="font-semibold">Judging Criteria</h4>
            </div>
            
            <div className="space-y-3">
              {competition.judgingCriteria.map((criterion, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-primary" />
                      <div>
                        <h5 className="font-medium">{criterion.name}</h5>
                        {criterion.description && (
                          <p className="text-sm text-muted-foreground">{criterion.description}</p>
                        )}
                      </div>
                    </div>
                    
                    {criterion.weight && (
                      <Badge variant="secondary">
                        {criterion.weight} pts
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Total Points Display */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Total Possible Points:</span>
                  <span className="font-bold text-primary">
                    {competition.judgingCriteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0)} pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
