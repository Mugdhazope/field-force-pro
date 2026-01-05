import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';

export const AdminProductsPage: React.FC = () => {
  const columns = [
    { key: 'name', header: 'Product' },
    { key: 'category', header: 'Category' },
    { key: 'sku', header: 'SKU' },
    { key: 'price', header: 'Price', render: (item: any) => `₹${item.price}` },
    { key: 'targetFrequency', header: 'Weekly Target' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Product Management" description="Manage product catalog" icon={Package} actions={<Button><Plus className="h-4 w-4 mr-2" />Add Product</Button>} />
      <DataTable columns={columns} data={mockProducts} />
    </div>
  );
};
