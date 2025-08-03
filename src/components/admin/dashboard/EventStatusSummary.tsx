
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface EventsByStatus {
  draft: number;
  published: number;
  in_progress: number;
  completed: number;
}

interface EventStatusSummaryProps {
  eventsByStatus: EventsByStatus;
}

const EventStatusSummary: React.FC<EventStatusSummaryProps> = ({ eventsByStatus }) => {
  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    published: { label: 'Published', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-primary" />
          Event Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(eventsByStatus).map(([status, count]) => (
          <div key={status} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={statusConfig[status as keyof EventsByStatus].color}>
                {statusConfig[status as keyof EventsByStatus].label}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-foreground">{count}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EventStatusSummary;
