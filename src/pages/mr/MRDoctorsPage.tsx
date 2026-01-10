import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Stethoscope, Search, MapPin, Phone, CheckCircle, Clock, Plus } from 'lucide-react';
import { mockDoctors } from '@/lib/mock-data';
import { Doctor, Visit } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AddDoctorModal, VisitModal } from '@/components/modals';
import { useToast } from '@/hooks/use-toast';

export const MRDoctorsPage: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');

  // Sort doctors by "proximity" (mock - just shuffle for demo)
  const sortedDoctors = [...doctors].sort((a, b) => {
    return a.coordinates.lat - b.coordinates.lat;
  });

  const filteredDoctors = sortedDoctors.filter(
    doctor =>
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(search.toLowerCase()) ||
      doctor.town.toLowerCase().includes(search.toLowerCase())
  );

  const handleDoctorAdded = (doctor: Doctor) => {
    setDoctors(prev => [doctor, ...prev]);
  };

  const handlePunchVisit = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setShowVisitModal(true);
  };

  const handleVisitRecorded = (visit: Visit) => {
    // Update doctor's visit frequency
    setDoctors(prev => prev.map(doc => 
      doc.id === visit.doctorId
        ? {
            ...doc,
            visitFrequency: {
              thisWeek: doc.visitFrequency.thisWeek + 1,
              thisMonth: doc.visitFrequency.thisMonth + 1,
            },
            lastVisit: visit.timestamp,
          }
        : doc
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Doctors"
        description="View doctors sorted by proximity to your location"
        icon={Stethoscope}
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        }
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, specialization, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor, index) => {
          const visitedToday = doctor.visitFrequency.thisWeek > 0;
          const visitedThisWeek = doctor.visitFrequency.thisWeek > 0;

          return (
            <Card key={doctor.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg shrink-0">
                    {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold truncate">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        #{index + 1}
                      </Badge>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{doctor.town}, {doctor.headquarters}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{doctor.phone}</span>
                      </div>
                    </div>

                    {/* Visit Status */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className={cn(
                        "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
                        visitedToday ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      )}>
                        {visitedToday ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {visitedToday ? 'Visited Today' : 'Not Visited Today'}
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
                        visitedThisWeek ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      )}>
                        This Week: {doctor.visitFrequency.thisWeek}
                      </div>
                    </div>

                    {/* Last Visit */}
                    {doctor.lastVisit && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Last visit: {format(new Date(doctor.lastVisit), 'MMM d, yyyy')}
                      </p>
                    )}

                    {/* Quick Action */}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => handlePunchVisit(doctor.id)}
                    >
                      Punch Visit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDoctors.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Stethoscope className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No doctors found</p>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </CardContent>
        </Card>
      )}

      {/* Add Doctor Modal */}
      <AddDoctorModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onDoctorAdded={handleDoctorAdded}
      />

      {/* Visit Modal */}
      <VisitModal
        open={showVisitModal}
        onOpenChange={setShowVisitModal}
        onVisitRecorded={handleVisitRecorded}
        visitType="doctor"
        prefilledDoctorId={selectedDoctorId}
      />
    </div>
  );
};
