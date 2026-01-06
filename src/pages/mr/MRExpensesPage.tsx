import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, Plus, Calendar, TrendingUp } from 'lucide-react';
import { mockExpenses } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const MRExpensesPage: React.FC = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    dailyFare: '',
    hqAllowance: '',
    otherExpenses: '',
    notes: '',
  });

  // Filter expenses for current MR
  const myExpenses = mockExpenses.filter((exp) => exp.mrId === user?.id);

  // Calculate totals
  const pendingTotal = myExpenses
    .filter((exp) => exp.status === 'pending')
    .reduce((sum, exp) => sum + exp.dailyFare + exp.hqAllowance + exp.otherExpenses, 0);
  
  const approvedTotal = myExpenses
    .filter((exp) => exp.status === 'approved')
    .reduce((sum, exp) => sum + exp.dailyFare + exp.hqAllowance + exp.otherExpenses, 0);

  const thisMonthTotal = myExpenses
    .filter((exp) => {
      const expDate = new Date(exp.date);
      const now = new Date();
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, exp) => sum + exp.dailyFare + exp.hqAllowance + exp.otherExpenses, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dailyFare = parseFloat(formData.dailyFare) || 0;
    const hqAllowance = parseFloat(formData.hqAllowance) || 0;
    const otherExpenses = parseFloat(formData.otherExpenses) || 0;
    
    if (dailyFare === 0 && hqAllowance === 0 && otherExpenses === 0) {
      toast.error('Please enter at least one expense amount');
      return;
    }

    // In real app, this would be an API call
    toast.success('Expense submitted for approval');
    setIsDialogOpen(false);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      dailyFare: '',
      hqAllowance: '',
      otherExpenses: '',
      notes: '',
    });
  };

  const columns = [
    { 
      key: 'date', 
      header: 'Date', 
      render: (item: any) => format(new Date(item.date), 'MMM d, yyyy') 
    },
    { 
      key: 'dailyFare', 
      header: 'Daily Fare', 
      render: (item: any) => `₹${item.dailyFare.toLocaleString()}` 
    },
    { 
      key: 'hqAllowance', 
      header: 'HQ Allowance', 
      render: (item: any) => `₹${item.hqAllowance.toLocaleString()}` 
    },
    { 
      key: 'otherExpenses', 
      header: 'Other', 
      render: (item: any) => `₹${item.otherExpenses.toLocaleString()}` 
    },
    { 
      key: 'total', 
      header: 'Total', 
      render: (item: any) => (
        <span className="font-semibold">
          ₹{(item.dailyFare + item.hqAllowance + item.otherExpenses).toLocaleString()}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (item: any) => <StatusBadge status={item.status} /> 
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="My Expenses" 
        description="Submit and track your daily expenses"
        icon={DollarSign}
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Submit Daily Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    max={format(new Date(), 'yyyy-MM-dd')}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyFare">Daily Fare (₹)</Label>
                    <Input
                      id="dailyFare"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={formData.dailyFare}
                      onChange={(e) => setFormData({ ...formData, dailyFare: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hqAllowance">HQ Allowance (₹)</Label>
                    <Input
                      id="hqAllowance"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={formData.hqAllowance}
                      onChange={(e) => setFormData({ ...formData, hqAllowance: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherExpenses">Other Expenses (₹)</Label>
                  <Input
                    id="otherExpenses"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={formData.otherExpenses}
                    onChange={(e) => setFormData({ ...formData, otherExpenses: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional details..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <span className="text-lg font-bold text-primary">
                      ₹{(
                        (parseFloat(formData.dailyFare) || 0) +
                        (parseFloat(formData.hqAllowance) || 0) +
                        (parseFloat(formData.otherExpenses) || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit for Approval</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{thisMonthTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total expenses this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">₹{pendingTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{approvedTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ready for reimbursement</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense History */}
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={myExpenses} 
            emptyMessage="No expenses submitted yet"
          />
        </CardContent>
      </Card>
    </div>
  );
};
