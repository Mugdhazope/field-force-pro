import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';
import { Product } from '@/types';
import { AddProductModal } from '@/components/modals';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleProductAdded = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const columns = [
    { key: 'name', header: 'Product', priority: 1 },
    { key: 'category', header: 'Category', priority: 2 },
    { key: 'sku', header: 'SKU', priority: 4, hideOnMobile: true },
    { key: 'price', header: 'Price', priority: 3, render: (item: any) => `₹${item.price}` },
    { key: 'targetFrequency', header: 'Weekly Target', priority: 4, hideOnMobile: true },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Product Management" 
        description="Manage product catalog" 
        icon={Package} 
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        } 
      />
      <DataTable columns={columns} data={products} />

      <AddProductModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};
