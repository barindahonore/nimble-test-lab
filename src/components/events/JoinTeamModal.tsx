
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
import { joinTeam } from '@/services/teamApi';

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const JoinTeamModal: React.FC<JoinTeamModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [invitationCode, setInvitationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitationCode.trim()) {
      toast({
        title: 'Invalid Invitation Code',
        description: 'Please enter a valid invitation code.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await joinTeam(invitationCode.trim());
      toast({
        title: 'Successfully Joined Team!',
        description: 'You have been added to the team.',
      });
      setInvitationCode('');
      onClose();
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Failed to Join Team',
        description: error.response?.data?.message || 'Invalid invitation code or team is full.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setInvitationCode('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Join Existing Team</DialogTitle>
          <DialogDescription className="text-base">
            Enter the invitation code provided by your team leader to join their team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invitationCode" className="text-sm font-medium">
                Invitation Code
              </Label>
              <Input
                id="invitationCode"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                className="font-mono"
                placeholder="Enter invitation code"
                disabled={isLoading}
                maxLength={25}
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
            <Button type="submit" disabled={isLoading || !invitationCode.trim()}>
              {isLoading ? 'Joining...' : 'Join Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
