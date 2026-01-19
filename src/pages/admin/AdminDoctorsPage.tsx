import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Stethoscope, Plus } from 'lucide-react';
import { mockDoctors } from '@/lib/mock-data';
import { Doctor } from '@/types';
import { AddDoctorModal } from '@/components/modals';

export const AdminDoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDoctorAdded = (doctor: Doctor) => {
    setDoctors(prev => [doctor, ...prev]);
  };

  const columns = [
    { key: 'name', header: 'Name', priority: 1 },
    { key: 'specialization', header: 'Specialization', priority: 2 },
    { key: 'town', header: 'Location', priority: 3 },
    { key: 'phone', header: 'Phone', priority: 4, hideOnMobile: true },
    { key: 'visits', header: 'Monthly Visits', priority: 3, render: (item: any) => item.visitFrequency.thisMonth },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Doctor Management" 
        description="Manage doctor database" 
        icon={Stethoscope} 
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        } 
      />
      <DataTable columns={columns} data={doctors} />

      <AddDoctorModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onDoctorAdded={handleDoctorAdded}
      />
    </div>
  );
};
