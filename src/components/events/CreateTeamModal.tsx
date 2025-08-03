
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createTeam } from '@/services/teamApi';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitionId: string;
  onSuccess: () => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  competitionId,
  onSuccess,
}) => {
  const [teamName, setTeamName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('CreateTeamModal - About to create team with competitionId:', competitionId);
    console.log('CreateTeamModal - competitionId type:', typeof competitionId);
    
    if (!teamName.trim()) {
      toast({
        title: 'Invalid Team Name',
        description: 'Please enter a valid team name.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await createTeam(competitionId, teamName.trim());
      toast({
        title: 'Team Created Successfully!',
        description: `Your team "${teamName}" has been created.`,
      });
      setTeamName('');
      onClose();
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Failed to Create Team',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTeamName('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Team</DialogTitle>
          <DialogDescription className="text-base">
            Create a new team for this competition. You will become the team leader and can invite others to join.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-sm font-medium">
                Team Name
              </Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                disabled={isLoading}
                maxLength={50}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !teamName.trim()}>
              {isLoading ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
