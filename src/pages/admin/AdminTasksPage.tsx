import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { ClipboardList, Plus } from 'lucide-react';
import { mockTasks } from '@/lib/mock-data';
import { format } from 'date-fns';

export const AdminTasksPage: React.FC = () => {
  const columns = [
    { key: 'mrName', header: 'Assigned To' },
    { key: 'target', header: 'Target', render: (item: any) => item.doctorName || item.shopName },
    { key: 'type', header: 'Type', render: (item: any) => <span className="capitalize">{item.type}</span> },
    { key: 'dueDate', header: 'Due Date', render: (item: any) => format(new Date(item.dueDate), 'MMM d, h:mm a') },
    { key: 'status', header: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Task Management" description="Create and manage MR tasks" icon={ClipboardList} actions={<Button><Plus className="h-4 w-4 mr-2" />Create Task</Button>} />
      <DataTable columns={columns} data={mockTasks} />
    </div>
  );
};
