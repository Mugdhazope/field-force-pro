import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Stethoscope, Store, Building2 } from 'lucide-react';
import { mockVisits } from '@/lib/mock-data';
import { Visit, VisitType } from '@/types';
import { format } from 'date-fns';

export const AdminVisitsPage: React.FC = () => {
  const doctorVisits = mockVisits.filter(v => v.type === 'doctor');
  const chemistVisits = mockVisits.filter(v => v.type === 'chemist');
  const stockistVisits = mockVisits.filter(v => v.type === 'stockist');

  const doctorColumns = [
    { key: 'mrName', header: 'MR Name', priority: 1 },
    { key: 'doctorName', header: 'Doctor', priority: 1 },
    { key: 'timestamp', header: 'Visit Time', priority: 2, render: (item: Visit) => format(new Date(item.timestamp), 'MMM d, h:mm a') },
    { key: 'productsPromoted', header: 'Products', priority: 3, hideOnMobile: true, render: (item: Visit) => item.productsPromoted.length > 0 ? item.productsPromoted.join(', ') : '-' },
    { key: 'status', header: 'Status', priority: 2, render: () => <StatusBadge status="completed" /> },
  ];

  const shopColumns = [
    { key: 'mrName', header: 'MR Name', priority: 1 },
    { key: 'shopName', header: 'Shop', priority: 1 },
    { key: 'timestamp', header: 'Visit Time', priority: 2, render: (item: Visit) => format(new Date(item.timestamp), 'MMM d, h:mm a') },
    { key: 'notes', header: 'Notes', priority: 3, hideOnMobile: true, render: (item: Visit) => item.notes || '-' },
    { key: 'status', header: 'Status', priority: 2, render: () => <StatusBadge status="completed" /> },
  ];

  const getEmptyState = (type: VisitType) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          {type === 'doctor' ? <Stethoscope className="h-8 w-8 text-muted-foreground" /> : 
           type === 'chemist' ? <Store className="h-8 w-8 text-muted-foreground" /> : 
           <Building2 className="h-8 w-8 text-muted-foreground" />}
        </div>
        <h3 className="font-semibold mb-1">No {type} visits recorded</h3>
        <p className="text-sm text-muted-foreground">
          {type.charAt(0).toUpperCase() + type.slice(1)} visits will appear here once recorded by MRs.
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Visit Records" 
        description="View all doctor, chemist, and stockist visits" 
        icon={MapPin} 
      />

      <Tabs defaultValue="doctor" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="doctor" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Doctor</span>
            <span className="inline sm:hidden">Doc</span>
          </TabsTrigger>
          <TabsTrigger value="chemist" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Chemist</span>
            <span className="inline sm:hidden">Chem</span>
          </TabsTrigger>
          <TabsTrigger value="stockist" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Stockist</span>
            <span className="inline sm:hidden">Stock</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctor" className="mt-6">
          {doctorVisits.length > 0 ? (
            <DataTable columns={doctorColumns} data={doctorVisits} />
          ) : (
            getEmptyState('doctor')
          )}
        </TabsContent>

        <TabsContent value="chemist" className="mt-6">
          {chemistVisits.length > 0 ? (
            <DataTable columns={shopColumns} data={chemistVisits} />
          ) : (
            getEmptyState('chemist')
          )}
        </TabsContent>

        <TabsContent value="stockist" className="mt-6">
          {stockistVisits.length > 0 ? (
            <DataTable columns={shopColumns} data={stockistVisits} />
          ) : (
            getEmptyState('stockist')
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
