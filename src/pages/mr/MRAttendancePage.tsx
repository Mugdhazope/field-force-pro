import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapView } from '@/components/map/MapView';
import { Calendar as CalendarIcon, Clock, MapPin, Stethoscope, Store } from 'lucide-react';
import { mockAttendance, mockVisits } from '@/lib/mock-data';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const MRAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const attendance = mockAttendance.find(
    a => a.mrId === user?.id && a.date === dateStr
  ) || mockAttendance.find(a => a.mrId === user?.id);

  const visits = mockVisits.filter(
    v => v.mrId === user?.id && v.timestamp.startsWith(dateStr)
  ) || mockVisits.filter(v => v.mrId === user?.id);

  const routePoints = attendance?.route.map(r => ({
    coordinates: r.coordinates,
    label: r.label,
    timestamp: r.timestamp,
    type: r.type as 'punch' | 'visit',
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Attendance & Route"
        description="View your daily attendance and visit route"
        icon={CalendarIcon}
        actions={
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        }
      />

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">First Punch</p>
                <p className="font-semibold">
                  {attendance?.firstPunch
                    ? format(new Date(attendance.firstPunch), 'h:mm a')
                    : '--:--'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Punch</p>
                <p className="font-semibold">
                  {attendance?.lastPunch
                    ? format(new Date(attendance.lastPunch), 'h:mm a')
                    : '--:--'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Visits</p>
                <p className="font-semibold">{attendance?.totalVisits || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge status={attendance?.status || 'absent'} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Map */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Route Map</CardTitle>
          </CardHeader>
          <CardContent>
            {routePoints.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <MapPin className="h-12 w-12 mb-4 opacity-50" />
                <p>No route data available for this date</p>
              </div>
            ) : (
              <MapView points={routePoints} showRoute height="400px" />
            )}
          </CardContent>
        </Card>

        {/* Visit Timeline */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Visit Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {visits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Stethoscope className="h-12 w-12 mb-4 opacity-50" />
                <p>No visits recorded for this date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {visits.map((visit, index) => (
                  <div key={visit.id} className="relative flex gap-4">
                    {/* Timeline Line */}
                    {index < visits.length - 1 && (
                      <div className="absolute left-5 top-12 w-0.5 h-full bg-border" />
                    )}
                    
                    {/* Timeline Dot */}
                    <div className={cn(
                      "relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                      visit.type === 'doctor' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    )}>
                      {visit.type === 'doctor' ? (
                        <Stethoscope className="h-5 w-5" />
                      ) : (
                        <Store className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{visit.doctorName || visit.shopName}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(visit.timestamp), 'h:mm a')}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {visit.type}
                        </span>
                      </div>
                      {visit.notes && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {visit.notes}
                        </p>
                      )}
                      {visit.productsPromoted.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {visit.productsPromoted.length} products promoted
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
