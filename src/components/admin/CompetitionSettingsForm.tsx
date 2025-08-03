
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCompetition, Competition, JudgingCriterion } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, Trash2, Settings } from 'lucide-react';

interface CompetitionSettingsFormProps {
  eventId: string;
  competition: Competition;
}

interface FormData {
  isTeamBased: boolean;
  minTeamSize: number;
  maxTeamSize: number;
}

const CompetitionSettingsForm: React.FC<CompetitionSettingsFormProps> = ({ 
  eventId, 
  competition 
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [judgingCriteria, setJudgingCriteria] = useState<JudgingCriterion[]>(
    competition.judgingCriteria || []
  );

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      isTeamBased: competition.isTeamBased,
      minTeamSize: competition.minTeamSize || 1,
      maxTeamSize: competition.maxTeamSize || 5,
    }
  });

  const isTeamBased = watch('isTeamBased');

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Competition>) => updateCompetition(eventId, data),
    onSuccess: () => {
      toast({
        title: "Competition updated",
        description: "Competition settings have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating competition",
        description: error.response?.data?.message || "Failed to update competition.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    updateMutation.mutate({
      isTeamBased: data.isTeamBased,
      minTeamSize: data.minTeamSize,
      maxTeamSize: data.maxTeamSize,
      judgingCriteria: judgingCriteria,
    });
  };

  const addJudgingCriterion = () => {
    const newCriterion: JudgingCriterion = {
      id: Date.now().toString(),
      name: '',
      description: '',
      weight: 1,
    };
    setJudgingCriteria([...judgingCriteria, newCriterion]);
  };

  const removeJudgingCriterion = (id: string) => {
    setJudgingCriteria(judgingCriteria.filter(c => c.id !== id));
  };

  const updateJudgingCriterion = (id: string, field: keyof JudgingCriterion, value: any) => {
    setJudgingCriteria(judgingCriteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Team Configuration</h3>
          
          <div className="flex items-center space-x-3">
            <Switch
              id="isTeamBased"
              checked={isTeamBased}
              onCheckedChange={(checked) => setValue('isTeamBased', checked)}
            />
            <Label htmlFor="isTeamBased" className="font-medium">Team-based competition</Label>
          </div>

          {isTeamBased && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minTeamSize" className="text-sm font-medium">Min Team Size</Label>
                <Input
                  id="minTeamSize"
                  type="number"
                  min="1"
                  {...register('minTeamSize', { required: true, min: 1 })}
                />
                {errors.minTeamSize && (
                  <p className="text-sm text-destructive">Min team size is required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTeamSize" className="text-sm font-medium">Max Team Size</Label>
                <Input
                  id="maxTeamSize"
                  type="number"
                  min="1"
                  {...register('maxTeamSize', { required: true, min: 1 })}
                />
                {errors.maxTeamSize && (
                  <p className="text-sm text-destructive">Max team size is required</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Judging Criteria</h3>
          
          <div className="max-h-64 overflow-y-auto space-y-3">
            {judgingCriteria.map((criterion) => (
              <div key={criterion.id} className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Criterion name"
                    value={criterion.name}
                    onChange={(e) => updateJudgingCriterion(criterion.id, 'name', e.target.value)}
                    className="flex-1 mr-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeJudgingCriterion(criterion.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder="Description"
                  value={criterion.description}
                  onChange={(e) => updateJudgingCriterion(criterion.id, 'description', e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`weight-${criterion.id}`} className="text-sm">Weight:</Label>
                  <Input
                    id={`weight-${criterion.id}`}
                    type="number"
                    min="1"
                    max="10"
                    value={criterion.weight}
                    onChange={(e) => updateJudgingCriterion(criterion.id, 'weight', parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={addJudgingCriterion} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Judging Criterion
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="submit" disabled={updateMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default CompetitionSettingsForm;
