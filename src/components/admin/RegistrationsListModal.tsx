
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEventRegistrations, Registration } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface RegistrationsListModalProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationsListModal: React.FC<RegistrationsListModalProps> = ({
  eventId,
  isOpen,
  onClose,
}) => {
  const {
    data: registrations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['eventRegistrations', eventId],
    queryFn: () => getEventRegistrations(eventId!),
    enabled: !!eventId && isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Event Registrations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">Error loading registrations. Please try again.</p>
            </div>
          ) : !registrations || registrations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No registrations found for this event.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-sm">
                  {registrations.length} {registrations.length === 1 ? 'Registration' : 'Registrations'}
                </Badge>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {registrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {registration.user.firstName.charAt(0)}
                          {registration.user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {registration.user.firstName} {registration.user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {registration.user.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(registration.registeredAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs">
                        {format(new Date(registration.registeredAt), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationsListModal;
