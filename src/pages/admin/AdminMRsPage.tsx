import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';
import { User } from '@/types';
import { AddMRModal } from '@/components/modals';

export const AdminMRsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);

  const mrs = users.filter(u => u.role === 'mr');

  const handleMRAdded = (mr: User) => {
    setUsers(prev => [...prev, mr]);
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'username', header: 'Username' },
    { key: 'headquarters', header: 'Headquarters' },
    { key: 'phone', header: 'Phone' },
    { key: 'isActive', header: 'Status', render: (item: any) => <StatusBadge status={item.isActive ? 'active' : 'inactive'} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="MR Management" 
        description="Manage medical representatives" 
        icon={Users} 
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add MR
          </Button>
        } 
      />
      <DataTable columns={columns} data={mrs} />

      <AddMRModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onMRAdded={handleMRAdded}
      />
    </div>
  );
};
