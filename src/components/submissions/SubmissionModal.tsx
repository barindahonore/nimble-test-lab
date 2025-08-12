
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link, FileText } from 'lucide-react';
import { createSubmission } from '@/services/teamApi';
import api from '@/services/api';

interface SubmissionModalProps {
  teamId?: string;
  competitionId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  teamId,
  competitionId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Validation
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isFormValid = url.trim() && description.trim() && isValidUrl(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    setIsLoading(true);
    setError('');

    try {
      const submissionData = {
        content: {
          url: url.trim(),
          description: description.trim(),
        }
      };

      if (teamId) {
        // Team submission
        await createSubmission(teamId, submissionData.content);
      } else if (competitionId) {
        // Individual submission
        await api.post(`/competitions/${competitionId}/submission`, submissionData);
      } else {
        throw new Error('Either teamId or competitionId must be provided');
      }

      toast({
        title: "Success!",
        description: "Your project has been submitted successfully.",
      });

      // Reset form
      setUrl('');
      setDescription('');
      
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while submitting your project.';
      setError(errorMessage);
      
      toast({
        title: "Submission failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setUrl('');
      setDescription('');
      setError('');
      onClose();
    }
  };

  const submissionType = teamId ? 'Team' : 'Individual';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Submit Your {submissionType} Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Project URL *
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://github.com/your-team/project"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className={!url || isValidUrl(url) ? '' : 'border-destructive'}
            />
            {url && !isValidUrl(url) && (
              <p className="text-sm text-destructive">Please enter a valid URL.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Project Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your project, the technologies used, key features, and any important details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Project'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
