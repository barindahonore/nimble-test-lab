
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Mail } from 'lucide-react';
import { User as UserType, Role, updateUser } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface EditUserModalProps {
  user: UserType;
  roles: Role[];
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  roles,
  isOpen,
  onClose,
  onUserUpdated,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'PENDING'>(user.status);
  const { toast } = useToast();

  const updateUserMutation = useMutation({
    mutationFn: (data: { roleId?: number; status?: string }) => 
      updateUser(user.id, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      onUserUpdated();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const updateData: { roleId?: number; status?: string } = {};
    
    if (selectedRoleId) {
      updateData.roleId = selectedRoleId;
    }
    
    if (selectedStatus !== user.status) {
      updateData.status = selectedStatus;
    }

    if (Object.keys(updateData).length === 0) {
      toast({
        title: "No Changes",
        description: "No changes were made to the user",
        variant: "default",
      });
      return;
    }

    updateUserMutation.mutate(updateData);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'SUSPENDED':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user role and status. Changes will be applied immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info Display */}
          <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-medium">
                {user.firstName} {user.lastName}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-1" />
                {user.email}
              </div>
            </div>
          </div>

          {/* Current Status Display */}
          <div className="space-y-2">
            <Label>Current Status</Label>
            <div className="flex items-center space-x-3">
              {getStatusBadge(user.status)}
              <span className="text-sm text-muted-foreground">
                Role: {user.role.name}
              </span>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label>Update Role</Label>
            <Select
              value={selectedRoleId?.toString() || ''}
              onValueChange={(value) => setSelectedRoleId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new role (optional)" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Current role: {user.role.name}
            </p>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label>Update Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as 'ACTIVE' | 'SUSPENDED' | 'PENDING')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={updateUserMutation.isPending}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
