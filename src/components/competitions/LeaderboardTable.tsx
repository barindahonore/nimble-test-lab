
import React from 'react';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntry } from '@/services/api';

interface LeaderboardTableProps {
  leaderboardData: LeaderboardEntry[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ leaderboardData }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-300" />;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getParticipantName = (entry: LeaderboardEntry): string => {
    if (entry.team) {
      return entry.team.name;
    }
    if (entry.submitter) {
      return `${entry.submitter.firstName} ${entry.submitter.lastName}`;
    }
    return 'Unknown Participant';
  };

  const getParticipantType = (entry: LeaderboardEntry): string => {
    return entry.team ? 'Team' : 'Individual';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Final Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboardData.map((entry, index) => {
            const rank = index + 1;
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  rank <= 3 ? 'bg-gradient-to-r from-background to-muted/30 border-primary/20' : 'bg-card'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center gap-2">
                    {getRankIcon(rank)}
                    <Badge className={getRankBadgeVariant(rank)}>
                      #{rank}
                    </Badge>
                  </div>

                  {/* Participant Info */}
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {getParticipantName(entry)}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {getParticipantType(entry)}
                    </Badge>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {entry.finalScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
