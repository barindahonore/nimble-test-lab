
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createCompetition } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trophy, Plus, X } from 'lucide-react';

interface PromoteToCompetitionModalProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCompetitionCreated: () => void;
}

interface JudgingCriterion {
  name: string;
  maxScore: number;
}

interface CompetitionFormData {
  isTeamBased: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  judgingCriteria: JudgingCriterion[];
}

const PromoteToCompetitionModal: React.FC<PromoteToCompetitionModalProps> = ({
  eventId,
  isOpen,
  onClose,
  onCompetitionCreated,
}) => {
  const [formData, setFormData] = useState<CompetitionFormData>({
    isTeamBased: false,
    minTeamSize: 2,
    maxTeamSize: 4,
    judgingCriteria: [
      { name: 'Innovation', maxScore: 25 },
      { name: 'Presentation', maxScore: 25 }
    ],
  });

  const { toast } = useToast();

  const createCompetitionMutation = useMutation({
    mutationFn: (data: { eventId: string; competitionData: any }) =>
      createCompetition(data.eventId, data.competitionData),
    onSuccess: () => {
      toast({
        title: "Competition created",
        description: "The event has been successfully promoted to a competition.",
      });
      onCompetitionCreated();
      // Reset form
      setFormData({
        isTeamBased: false,
        minTeamSize: 2,
        maxTeamSize: 4,
        judgingCriteria: [
          { name: 'Innovation', maxScore: 25 },
          { name: 'Presentation', maxScore: 25 }
        ],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating competition",
        description: error.response?.data?.message || "Failed to create competition.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventId) return;

    // Validate judging criteria
    const validCriteria = formData.judgingCriteria.filter(
      criterion => criterion.name.trim() && criterion.maxScore > 0
    );

    if (validCriteria.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one judging criterion with a name and score greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const competitionData = {
      isTeamBased: formData.isTeamBased,
      minTeamSize: formData.isTeamBased ? formData.minTeamSize : undefined,
      maxTeamSize: formData.isTeamBased ? formData.maxTeamSize : undefined,
      judgingCriteria: validCriteria,
    };

    createCompetitionMutation.mutate({
      eventId,
      competitionData,
    });
  };

  const addJudgingCriterion = () => {
    setFormData(prev => ({
      ...prev,
      judgingCriteria: [...prev.judgingCriteria, { name: '', maxScore: 25 }]
    }));
  };

  const removeJudgingCriterion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      judgingCriteria: prev.judgingCriteria.filter((_, i) => i !== index)
    }));
  };

  const updateJudgingCriterion = (index: number, field: keyof JudgingCriterion, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      judgingCriteria: prev.judgingCriteria.map((criterion, i) =>
        i === index ? { ...criterion, [field]: value } : criterion
      )
    }));
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setFormData({
      isTeamBased: false,
      minTeamSize: 2,
      maxTeamSize: 4,
      judgingCriteria: [
        { name: 'Innovation', maxScore: 25 },
        { name: 'Presentation', maxScore: 25 }
      ],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Promote to Competition
          </DialogTitle>
          <DialogDescription>
            Convert this event into a competition with judging and scoring capabilities.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="teamBased">Team-based Competition</Label>
                <div className="text-sm text-muted-foreground">
                  Enable if participants will compete in teams
                </div>
              </div>
              <Switch
                id="teamBased"
                checked={formData.isTeamBased}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isTeamBased: checked }))}
              />
            </div>

            {formData.isTeamBased && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minTeamSize">Minimum Team Size</Label>
                  <Input
                    id="minTeamSize"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.minTeamSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, minTeamSize: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxTeamSize">Maximum Team Size</Label>
                  <Input
                    id="maxTeamSize"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.maxTeamSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxTeamSize: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Judging Criteria</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addJudgingCriterion}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Criterion
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.judgingCriteria.map((criterion, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1">
                      <Input
                        placeholder="Criterion name (e.g., Innovation)"
                        value={criterion.name}
                        onChange={(e) => updateJudgingCriterion(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        placeholder="Score"
                        value={criterion.maxScore}
                        onChange={(e) => updateJudgingCriterion(index, 'maxScore', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeJudgingCriterion(index)}
                      disabled={formData.judgingCriteria.length <= 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                Add criteria that judges will use to evaluate participants. Each criterion should have a maximum score.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCompetitionMutation.isPending}>
              {createCompetitionMutation.isPending ? 'Creating...' : 'Create Competition'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PromoteToCompetitionModal;
