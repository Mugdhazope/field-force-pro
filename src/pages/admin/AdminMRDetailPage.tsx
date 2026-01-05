import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapView } from '@/components/map/MapView';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { User, MapPin, Package, CheckSquare } from 'lucide-react';
import { mockUsers, mockAttendance, mockVisits, mockExplanations } from '@/lib/mock-data';
import { format } from 'date-fns';

export const AdminMRDetailPage: React.FC = () => {
  const { id } = useParams();
  const mr = mockUsers.find(u => u.id === id) || mockUsers[1];
  const attendance = mockAttendance.find(a => a.mrId === id) || mockAttendance[0];
  const visits = mockVisits.filter(v => v.mrId === id || v.mrId === mockUsers[1].id);
  const explanations = mockExplanations.filter(e => e.mrId === id || e.mrId === mockUsers[1].id);

  const routePoints = attendance?.route.map(r => ({ coordinates: r.coordinates, label: r.label, timestamp: r.timestamp, type: r.type as 'punch' | 'visit' })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={mr.name} description={`${mr.role.toUpperCase()} • ${mr.headquarters}`} icon={User} />

      <Tabs defaultValue="route">
        <TabsList>
          <TabsTrigger value="route">Route Map</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="route" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Today's Route</CardTitle></CardHeader>
            <CardContent>
              <MapView points={routePoints} showRoute height="450px" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits" className="mt-6 space-y-4">
          {visits.map(visit => (
            <Card key={visit.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{visit.doctorName || visit.shopName}</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(visit.timestamp), 'h:mm a')} • {visit.type}</p>
                </div>
                <StatusBadge status="completed" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approvals" className="mt-6 space-y-4">
          {explanations.length === 0 ? <p className="text-muted-foreground text-center py-8">No pending approvals</p> : explanations.map(exp => (
            <Card key={exp.id}>
              <CardContent className="p-4">
                <div className="flex justify-between"><p className="font-medium">{exp.notes}</p><StatusBadge status={exp.status} /></div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
