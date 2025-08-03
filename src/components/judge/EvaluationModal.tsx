import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  getSubmissionDetail,
  submitEvaluation,
  type SubmissionDetail,
  type JudgingCriterion,
  type EvaluationData,
} from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ExternalLink, Users, Star } from 'lucide-react';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
  judgingCriteria: JudgingCriterion[];
  onEvaluationSubmitted: () => void;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({
  isOpen,
  onClose,
  submissionId,
  judgingCriteria,
  onEvaluationSubmitted,
}) => {
  const { toast } = useToast();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create dynamic form schema based on judging criteria
  const createFormSchema = (criteria: JudgingCriterion[]) => {
    const scoresSchema: Record<string, z.ZodNumber> = {};
    criteria.forEach((criterion) => {
      scoresSchema[criterion.name] = z
        .number()
        .min(0, `${criterion.name} score must be at least 0`)
        .max(criterion.weight, `${criterion.name} score cannot exceed ${criterion.weight}`);
    });

    return z.object({
      scores: z.object(scoresSchema),
      comments: z.string().min(1, 'Comments are required'),
    });
  };

  const formSchema = createFormSchema(judgingCriteria);
  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scores: {},
      comments: '',
    },
  });

  // Fetch submission details when modal opens
  useEffect(() => {
    if (isOpen && submissionId) {
      const fetchSubmissionDetail = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await getSubmissionDetail(submissionId);
          setSubmission(data);
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || 'Failed to load submission details';
          setError(errorMessage);
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchSubmissionDetail();
    }
  }, [isOpen, submissionId, toast]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setSubmission(null);
      setError(null);
    }
  }, [isOpen, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const evaluationData: EvaluationData = {
        scores: data.scores,
        comments: data.comments,
      };

      await submitEvaluation(submissionId, evaluationData);

      toast({
        title: "Evaluation Submitted",
        description: "Your evaluation has been successfully submitted.",
      });

      onEvaluationSubmitted();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to submit evaluation';
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPossibleScore = judgingCriteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  const currentTotalScore = judgingCriteria.reduce((sum, criterion) => {
    const score = form.watch(`scores.${criterion.name}`) || 0;
    return sum + score;
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Evaluate Submission
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : submission ? (
          <div className="space-y-6">
            {/* Submission Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <h3 className="font-medium">Team: {submission.team.name}</h3>
              </div>
              
              {submission.content.url && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Submission URL:
                  </label>
                  <div className="mt-1">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary"
                      asChild
                    >
                      <a
                        href={submission.content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        {submission.content.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {submission.content.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Description:
                  </label>
                  <p className="mt-1 text-sm">{submission.content.description}</p>
                </div>
              )}
            </div>

            {/* Evaluation Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Scoring Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Scoring Criteria</h4>
                    <div className="text-sm text-muted-foreground">
                      Total: {currentTotalScore} / {totalPossibleScore}
                    </div>
                  </div>

                  {judgingCriteria.map((criterion) => (
                    <FormField
                      key={criterion.name}
                      control={form.control}
                      name={`scores.${criterion.name}`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>{criterion.name}</FormLabel>
                            <span className="text-xs text-muted-foreground">
                              Max: {criterion.weight}
                            </span>
                          </div>
                          {criterion.description && (
                            <p className="text-xs text-muted-foreground">
                              {criterion.description}
                            </p>
                          )}
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={criterion.weight}
                              step={1}
                              placeholder={`0 - ${criterion.weight}`}
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {/* Comments Section */}
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide detailed feedback on the submission..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !form.formState.isValid}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationModal;