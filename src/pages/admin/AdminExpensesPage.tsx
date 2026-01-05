import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DollarSign } from 'lucide-react';
import { mockExpenses } from '@/lib/mock-data';
import { format } from 'date-fns';

export const AdminExpensesPage: React.FC = () => {
  const columns = [
    { key: 'mrName', header: 'MR Name' },
    { key: 'date', header: 'Date', render: (item: any) => format(new Date(item.date), 'MMM d, yyyy') },
    { key: 'dailyFare', header: 'Fare', render: (item: any) => `₹${item.dailyFare}` },
    { key: 'hqAllowance', header: 'HQ Allowance', render: (item: any) => `₹${item.hqAllowance}` },
    { key: 'total', header: 'Total', render: (item: any) => `₹${item.dailyFare + item.hqAllowance + item.otherExpenses}` },
    { key: 'status', header: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Expenses & Allowances" description="Manage expense claims" icon={DollarSign} />
      <DataTable columns={columns} data={mockExpenses} />
    </div>
  );
};
