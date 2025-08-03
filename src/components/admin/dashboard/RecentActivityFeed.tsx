
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Activity, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface RecentEvent {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface RecentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  role: {
    name: string;
  };
}

interface RecentActivityFeedProps {
  recentEvents: RecentEvent[];
  recentUsers: RecentUser[];
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ 
  recentEvents, 
  recentUsers 
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-700 border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'student': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'judge': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-primary" />
          Recent Platform Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recent Events */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Recent Events
          </h4>
          <div className="space-y-2">
            {recentEvents.length > 0 ? (
              recentEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(event.status)}>
                    {event.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent events</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Recent Users
          </h4>
          <div className="space-y-2">
            {recentUsers.length > 0 ? (
              recentUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getRoleColor(user.role.name)}>
                    {user.role.name}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent users</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;
