
import React from 'react';
import { Event } from '@/services/api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Users, 
  Trophy,
  Settings,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventsTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onViewRegistrations: (eventId: string) => void;
  onPromoteToCompetition: (eventId: string) => void;
  isDeleting: boolean;
}

const EventsTable: React.FC<EventsTableProps> = ({
  events,
  onEdit,
  onDelete,
  onViewRegistrations,
  onPromoteToCompetition,
  isDeleting,
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Organizer</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.title}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div>{new Date(event.startTime).toLocaleDateString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.startTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{event.location || 'TBD'}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </TableCell>
            <TableCell>
              {event.competition ? (
                <Badge variant="default" className="bg-purple-100 text-purple-800">
                  <Trophy className="w-3 h-3 mr-1" />
                  Competition
                </Badge>
              ) : (
                <Badge variant="secondary">Event</Badge>
              )}
            </TableCell>
            <TableCell>
              {event.organizer.firstName} {event.organizer.lastName}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(event)}
                  title="Edit event"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewRegistrations(event.id)}
                  title="View registrations"
                >
                  <Users className="w-4 h-4" />
                </Button>

                {event.competition ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/competitions/${event.id}/manage`)}
                    title="Manage competition"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPromoteToCompetition(event.id)}
                    title="Promote to competition"
                  >
                    <Trophy className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(event.id)}
                  disabled={isDeleting}
                  title="Delete event"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EventsTable;
