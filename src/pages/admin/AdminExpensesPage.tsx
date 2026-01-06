import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DollarSign, Check, X, Calendar, TrendingUp, Users } from 'lucide-react';
import { mockExpenses, mockUsers } from '@/lib/mock-data';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Expense } from '@/types';

export const AdminExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingExpenses = expenses.filter((exp) => exp.status === 'pending');
  const approvedExpenses = expenses.filter((exp) => exp.status === 'approved');
  const rejectedExpenses = expenses.filter((exp) => exp.status === 'rejected');

  // Calculate totals
  const totalPending = pendingExpenses.reduce(
    (sum, exp) => sum + exp.dailyFare + exp.hqAllowance + exp.otherExpenses, 0
  );
  const totalApproved = approvedExpenses.reduce(
    (sum, exp) => sum + exp.dailyFare + exp.hqAllowance + exp.otherExpenses, 0
  );
  const thisMonthTotal = expenses
    .filter((exp) => {
      const expDate = new Date(exp.date);
      const now = new Date();
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, exp) => sum + exp.dailyFare + exp.hqAllowance + exp.otherExpenses, 0);

  const handleApprove = (expense: Expense) => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === expense.id
          ? { ...exp, status: 'approved' as const, approvedAt: new Date().toISOString() }
          : exp
      )
    );
    toast.success(`Expense approved for ${expense.mrName}`);
  };

  const handleReject = () => {
    if (!selectedExpense) return;
    
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === selectedExpense.id
          ? { ...exp, status: 'rejected' as const, rejectionReason: rejectionReason.trim() }
          : exp
      )
    );
    toast.success(`Expense rejected for ${selectedExpense.mrName}`);
    setIsRejectDialogOpen(false);
    setSelectedExpense(null);
    setRejectionReason('');
  };

  const openRejectDialog = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsRejectDialogOpen(true);
  };

  const columns = [
    { key: 'mrName', header: 'MR Name' },
    { 
      key: 'date', 
      header: 'Date', 
      render: (item: Expense) => format(new Date(item.date), 'MMM d, yyyy') 
    },
    { 
      key: 'dailyFare', 
      header: 'Daily Fare', 
      render: (item: Expense) => `₹${item.dailyFare.toLocaleString()}` 
    },
    { 
      key: 'hqAllowance', 
      header: 'HQ Allowance', 
      render: (item: Expense) => `₹${item.hqAllowance.toLocaleString()}` 
    },
    { 
      key: 'otherExpenses', 
      header: 'Other', 
      render: (item: Expense) => `₹${item.otherExpenses.toLocaleString()}` 
    },
    { 
      key: 'total', 
      header: 'Total', 
      render: (item: Expense) => (
        <span className="font-semibold">
          ₹{(item.dailyFare + item.hqAllowance + item.otherExpenses).toLocaleString()}
        </span>
      )
    },
    { 
      key: 'notes', 
      header: 'Notes', 
      render: (item: Expense) => (
        <span className="text-sm text-muted-foreground truncate max-w-[150px] block">
          {item.notes || '-'}
        </span>
      )
    },
  ];

  const pendingColumns = [
    ...columns,
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Expense) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            className="bg-success hover:bg-success/90"
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(item);
            }}
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              openRejectDialog(item);
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const historyColumns = [
    ...columns,
    { 
      key: 'status', 
      header: 'Status', 
      render: (item: Expense) => <StatusBadge status={item.status} /> 
    },
  ];

  // Get unique MRs with their expense totals
  const mrSummary = mockUsers
    .filter((u) => u.role === 'mr')
    .map((mr) => {
      const mrExpenses = expenses.filter((exp) => exp.mrId === mr.id);
      const total = mrExpenses.reduce(
        (sum, exp) => sum + exp.dailyFare + exp.hqAllowance + exp.otherExpenses, 0
      );
      const pending = mrExpenses
        .filter((exp) => exp.status === 'pending')
        .reduce((sum, exp) => sum + exp.dailyFare + exp.hqAllowance + exp.otherExpenses, 0);
      return {
        id: mr.id,
        name: mr.name,
        total,
        pending,
        count: mrExpenses.length,
      };
    })
    .filter((mr) => mr.count > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Expenses & Allowances" 
        description="Review and approve expense claims from MRs"
        icon={DollarSign}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">₹{totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{pendingExpenses.length} claims pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹{totalApproved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{approvedExpenses.length} claims approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{thisMonthTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total expense claims</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active MRs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mrSummary.length}</div>
            <p className="text-xs text-muted-foreground">With expense claims</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingExpenses.length > 0 && (
              <span className="ml-2 bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-full">
                {pendingExpenses.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="by-mr">By MR</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Expense Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={pendingColumns} 
                data={pendingExpenses}
                emptyMessage="No pending expense claims"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>All Expense Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={historyColumns} 
                data={expenses}
                emptyMessage="No expense claims found"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-mr">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by MR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {mrSummary.map((mr) => (
                  <div
                    key={mr.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{mr.name}</h4>
                      <p className="text-sm text-muted-foreground">{mr.count} claims submitted</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{mr.total.toLocaleString()}</p>
                      {mr.pending > 0 && (
                        <p className="text-sm text-warning">₹{mr.pending.toLocaleString()} pending</p>
                      )}
                    </div>
                  </div>
                ))}
                {mrSummary.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No expense data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Expense Claim</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-medium">{selectedExpense.mrName}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedExpense.date), 'MMMM d, yyyy')}
                </p>
                <p className="text-lg font-bold mt-1">
                  ₹{(selectedExpense.dailyFare + selectedExpense.hqAllowance + selectedExpense.otherExpenses).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Reason for Rejection</Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Please provide a reason for rejecting this expense claim..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
