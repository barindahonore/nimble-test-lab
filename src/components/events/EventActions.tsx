
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
      <Card className="bg-accent/5 border-accent/20 shadow-card">
        <CardContent className="p-8">
          <div className="text-center">
            <LogIn className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Join This Event</h3>
            <p className="text-muted-foreground mb-6 text-lg">
              You need to be logged in to register for events.
            </p>
            <Button onClick={() => navigate('/login')} size="lg" className="w-full sm:w-auto">
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
      <Card className="bg-green-50 border-green-200 shadow-card">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <CheckCircle className="w-12 h-12 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-green-900 mb-2">
                You're Registered!
              </h3>
              <p className="text-green-700 text-lg">
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
      <Card className="bg-destructive/5 border-destructive/20 shadow-card">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-destructive font-medium text-lg">This event has been cancelled.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-primary/5 border-primary/20 shadow-card">
      <CardContent className="p-8">
        <div className="text-center">
          <UserPlus className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-3">Register for This Event</h3>
          <p className="text-muted-foreground mb-6 text-lg">
            Join this exciting event and be part of the experience.
          </p>
          <Button
            onClick={handleRegister}
            disabled={isRegistering}
            size="lg"
            className="w-full sm:w-auto px-8"
          >
            {isRegistering ? 'Registering...' : 'Register Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
