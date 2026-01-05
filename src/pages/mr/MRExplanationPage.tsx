import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Send, Loader2, AlertCircle } from 'lucide-react';
import { mockExplanations } from '@/lib/mock-data';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const reasonCategories = [
  { value: 'fewer_visits', label: 'Fewer Visits Than Expected' },
  { value: 'task_incomplete', label: 'Task Not Completed' },
  { value: 'late_start', label: 'Late Start' },
  { value: 'early_end', label: 'Early End' },
  { value: 'other', label: 'Other Reason' },
];

export const MRExplanationPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userExplanations = mockExplanations.filter(e => e.mrId === user?.id);

  const handleSubmit = async () => {
    if (!reason) {
      toast({ title: 'Please select a reason', variant: 'destructive' });
      return;
    }
    if (!notes.trim()) {
      toast({ title: 'Please provide details', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Explanation Submitted',
      description: 'Your daily explanation has been submitted for approval.',
    });

    setIsSubmitting(false);
    setReason('');
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Daily Explanation"
        description="Submit explanations for any variations in your daily work"
        icon={FileText}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Explanation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Reason Category</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  {reasonCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Details</Label>
              <Textarea
                placeholder="Provide details about the reason..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Explanation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
          </CardHeader>
          <CardContent>
            {userExplanations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mb-4 opacity-50" />
                <p>No explanations submitted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userExplanations.map((explanation) => (
                  <div
                    key={explanation.id}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {reasonCategories.find(c => c.value === explanation.reasonCategory)?.label}
                          </p>
                          <StatusBadge status={explanation.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(explanation.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm mt-3">{explanation.notes}</p>

                    {explanation.status === 'rejected' && explanation.rejectionReason && (
                      <div className="mt-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-destructive">Rejection Reason:</p>
                            <p className="text-sm text-destructive/80">{explanation.rejectionReason}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {explanation.status === 'approved' && explanation.approvedAt && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Approved on {format(new Date(explanation.approvedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
