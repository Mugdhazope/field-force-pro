import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';

export const AdminMRsPage: React.FC = () => {
  const mrs = mockUsers.filter(u => u.role === 'mr');
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'username', header: 'Username' },
    { key: 'headquarters', header: 'Headquarters' },
    { key: 'phone', header: 'Phone' },
    { key: 'isActive', header: 'Status', render: (item: any) => <StatusBadge status={item.isActive ? 'active' : 'inactive'} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="MR Management" description="Manage medical representatives" icon={Users} actions={<Button><Plus className="h-4 w-4 mr-2" />Add MR</Button>} />
      <DataTable columns={columns} data={mrs} />
    </div>
  );
};
