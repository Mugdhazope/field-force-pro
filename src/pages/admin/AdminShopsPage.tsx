import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Store, Plus } from 'lucide-react';
import { mockShops } from '@/lib/mock-data';
import { Shop } from '@/types';
import { AddShopModal } from '@/components/modals';

export const AdminShopsPage: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>(mockShops);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleShopAdded = (shop: Shop) => {
    setShops(prev => [shop, ...prev]);
  };

  const columns = [
    { key: 'name', header: 'Shop Name' },
    { key: 'address', header: 'Address' },
    { key: 'town', header: 'Town' },
    { key: 'contactPerson', header: 'Contact Person' },
    { key: 'phone', header: 'Phone' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Shop Management" 
        description="Manage pharmacy and shop database" 
        icon={Store} 
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Shop
          </Button>
        } 
      />
      <DataTable columns={columns} data={shops} />

      <AddShopModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onShopAdded={handleShopAdded}
      />
    </div>
  );
};
