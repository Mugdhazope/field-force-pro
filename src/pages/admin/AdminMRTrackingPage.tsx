import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Eye } from 'lucide-react';
import { mockAttendance } from '@/lib/mock-data';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const AdminMRTrackingPage: React.FC = () => {
  const navigate = useNavigate();

  const columns = [
    { key: 'mrName', header: 'MR Name' },
    { key: 'firstPunch', header: 'First Punch', render: (item: any) => item.firstPunch ? format(new Date(item.firstPunch), 'h:mm a') : '--' },
    { key: 'lastPunch', header: 'Last Punch', render: (item: any) => item.lastPunch ? format(new Date(item.lastPunch), 'h:mm a') : '--' },
    { key: 'totalVisits', header: 'Visits' },
    { key: 'status', header: 'Status', render: (item: any) => <StatusBadge status={item.status} /> },
    { key: 'actions', header: '', render: (item: any) => (
      <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/mr-tracking/${item.mrId}`)}>
        <Eye className="h-4 w-4 mr-1" /> View
      </Button>
    )},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="MR Tracking" description="Monitor MR attendance and activities" icon={MapPin} />
      <DataTable columns={columns} data={mockAttendance} onRowClick={(item) => navigate(`/admin/mr-tracking/${item.mrId}`)} />
    </div>
  );
};
