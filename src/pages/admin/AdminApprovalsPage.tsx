import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Check, X } from 'lucide-react';
import { mockExplanations, mockExpenses } from '@/lib/mock-data';

export const AdminApprovalsPage: React.FC = () => {
  const pendingExplanations = mockExplanations.filter(e => e.status === 'pending');
  const pendingExpenses = mockExpenses.filter(e => e.status === 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Approvals" description="Review and approve MR submissions" icon={CheckSquare} />

      <h2 className="text-lg font-semibold">Daily Explanations ({pendingExplanations.length})</h2>
      {pendingExplanations.map(exp => (
        <Card key={exp.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div><p className="font-medium">{exp.mrName}</p><p className="text-sm text-muted-foreground">{exp.notes}</p></div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline"><X className="h-4 w-4" /></Button>
              <Button size="sm"><Check className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <h2 className="text-lg font-semibold mt-8">Expense Claims ({pendingExpenses.length})</h2>
      {pendingExpenses.map(exp => (
        <Card key={exp.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div><p className="font-medium">{exp.mrName}</p><p className="text-sm text-muted-foreground">₹{exp.dailyFare + exp.hqAllowance}</p></div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline"><X className="h-4 w-4" /></Button>
              <Button size="sm"><Check className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
