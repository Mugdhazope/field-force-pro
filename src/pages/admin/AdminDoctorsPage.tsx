import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Stethoscope, Plus } from 'lucide-react';
import { mockDoctors } from '@/lib/mock-data';

export const AdminDoctorsPage: React.FC = () => {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'specialization', header: 'Specialization' },
    { key: 'town', header: 'Location' },
    { key: 'phone', header: 'Phone' },
    { key: 'visits', header: 'Monthly Visits', render: (item: any) => item.visitFrequency.thisMonth },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Doctor Management" description="Manage doctor database" icon={Stethoscope} actions={<Button><Plus className="h-4 w-4 mr-2" />Add Doctor</Button>} />
      <DataTable columns={columns} data={mockDoctors} />
    </div>
  );
};
