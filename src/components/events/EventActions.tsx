
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Event, EventRegistration, registerForEvent } from '@/services/api';
import { MyTeam } from '@/services/teamApi';

interface EventActionsProps {
  event: Event;
  user: any;
  registrationStatus: EventRegistration | null;
  teamStatus: MyTeam | null;
  onRegistrationSuccess: () => void;
}

export const EventActions: React.FC<EventActionsProps> = ({
  event,
  user,
  registrationStatus,
  teamStatus,
  onRegistrationSuccess,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsRegistering(true);
    try {
      await registerForEvent(event.id);
      toast({
        title: 'Registration Successful!',
        description: 'You have been registered for this event.',
      });
      onRegistrationSuccess();
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Failed to register for event',
        variant: 'destructive',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <LogIn className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Join This Event</h3>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to register for events.
            </p>
            <Button onClick={() => navigate('/login')}>
              <LogIn className="w-4 h-4 mr-2" />
              Login to Register
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (registrationStatus) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-1">
                You're Registered!
              </h3>
              <p className="text-green-700 text-sm">
                Registered on {new Date(registrationStatus.registeredAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (event.status === 'CANCELLED') {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-destructive font-medium">This event has been cancelled.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <UserPlus className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Register for This Event</h3>
          <p className="text-muted-foreground mb-4">
            Join this exciting event and be part of the experience.
          </p>
          <Button
            onClick={handleRegister}
            disabled={isRegistering}
            size="lg"
          >
            {isRegistering ? 'Registering...' : 'Register Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
