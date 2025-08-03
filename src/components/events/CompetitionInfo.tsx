
import { Trophy, Users, Target, Award, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Competition } from '@/services/api';

interface CompetitionInfoProps {
  competition: Competition;
}

export const CompetitionInfo: React.FC<CompetitionInfoProps> = ({ competition }) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-background via-background/90 to-accent/5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <CardHeader className="relative pb-6 border-b border-border/10">
        <CardTitle className="flex items-center gap-4 text-2xl font-bold">
          <div className="relative p-3 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg">
            <Trophy className="w-7 h-7 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Competition Rules & Requirements
            </span>
            <p className="text-sm font-normal text-muted-foreground mt-1">
              Everything you need to know to participate
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative pt-8 space-y-8">
        {/* Team Requirements Section */}
        <div className="group">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-white" />
            </div>
            
            <div className="flex-1 space-y-4">
              <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                Team Requirements
                <Zap className="w-5 h-5 text-primary" />
              </h4>
              
              <div className="space-y-4">
                {competition.isTeamBased ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 px-4 py-2 font-semibold">
                        <Users className="w-4 h-4 mr-2" />
                        Team-Based Competition
                      </Badge>
                    </div>
                    
                    {competition.minTeamSize && competition.maxTeamSize && (
                      <div className="space-y-3">
                        <p className="text-muted-foreground font-medium">
                          Team Size Requirements:
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-background/70 backdrop-blur px-4 py-2 rounded-xl border border-border/50">
                            <span className="text-sm font-semibold text-green-600">Min:</span>
                            <span className="text-lg font-bold text-foreground">{competition.minTeamSize}</span>
                          </div>
                          <div className="w-8 h-px bg-gradient-to-r from-border to-transparent" />
                          <div className="flex items-center gap-2 bg-background/70 backdrop-blur px-4 py-2 rounded-xl border border-border/50">
                            <span className="text-sm font-semibold text-blue-600">Max:</span>
                            <span className="text-lg font-bold text-foreground">{competition.maxTeamSize}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 dark:from-purple-950/30 dark:to-pink-950/30 dark:border-purple-800">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 px-4 py-2 font-semibold">
                      <Star className="w-4 h-4 mr-2" />
                      Individual Competition
                    </Badge>
                    <p className="text-muted-foreground mt-3">
                      This is a solo challenge where you'll compete on your own merits.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Judging Criteria Section */}
        {competition.judgingCriteria && competition.judgingCriteria.length > 0 && (
          <div className="group">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7 text-white" />
              </div>
              
              <div className="flex-1 space-y-6">
                <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                  Judging Criteria
                  <Award className="w-5 h-5 text-primary" />
                </h4>
                
                <div className="grid gap-4">
                  {competition.judgingCriteria.map((criterion, index) => (
                    <div
                      key={index}
                      className="group/item p-6 rounded-2xl bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform duration-300">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-bold text-lg text-foreground">{criterion.name}</h5>
                            {criterion.description && (
                              <p className="text-sm text-muted-foreground mt-1">{criterion.description}</p>
                            )}
                          </div>
                        </div>
                        
                        {criterion.weight && (
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 px-4 py-2 text-sm font-bold"
                            >
                              <Trophy className="w-3 h-3 mr-1" />
                              {criterion.weight} pts
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Points Display */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground">Total Possible Points:</span>
                    <span className="text-xl font-bold text-primary">
                      {competition.judgingCriteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0)} pts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
