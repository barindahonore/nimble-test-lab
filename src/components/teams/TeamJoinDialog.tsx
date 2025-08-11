
import React, { useState } from 'react';
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

interface TeamJoinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (teamId: string) => void;
  eventId: string;
}

const TeamJoinDialog: React.FC<TeamJoinDialogProps> = ({
  open,
  onOpenChange,
  onJoin,
  eventId,
}) => {
  const [invitationCode, setInvitationCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invitationCode.trim()) {
      onJoin(invitationCode.trim());
      setInvitationCode('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Team</DialogTitle>
          <DialogDescription>
            Enter the invitation code to join an existing team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invitationCode">Invitation Code</Label>
            <Input
              id="invitationCode"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
              placeholder="Enter invitation code"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!invitationCode.trim()}>
              Join Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamJoinDialog;
