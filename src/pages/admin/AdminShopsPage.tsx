import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Store, Plus } from 'lucide-react';
import { mockShops } from '@/lib/mock-data';

export const AdminShopsPage: React.FC = () => {
  const columns = [
    { key: 'name', header: 'Shop Name' },
    { key: 'address', header: 'Address' },
    { key: 'town', header: 'Town' },
    { key: 'contactPerson', header: 'Contact Person' },
    { key: 'phone', header: 'Phone' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Shop Management" description="Manage pharmacy and shop database" icon={Store} actions={<Button><Plus className="h-4 w-4 mr-2" />Add Shop</Button>} />
      <DataTable columns={columns} data={mockShops} />
    </div>
  );
};
